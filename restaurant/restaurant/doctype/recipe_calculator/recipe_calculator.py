import frappe
from frappe.model.document import Document

class RecipeCalculator(Document):

    def calculate_from_bom(self):
        self.set("raw_materials", [])
        raw_materials_map = {}
        total_sales = 0
        total_cost = 0

        selling_pl = self.selling_price_list or "Standard Selling"
        buying_pl = self.buying_price_list or "Standard Buying"

        # الأصناف النهائية
        for d in self.items:
            selling_rate = frappe.get_value(
                "Item Price",
                {"item_code": d.item_code, "price_list": selling_pl},
                "price_list_rate"
            ) or 0
            d.price = selling_rate
            d.total = d.qty * selling_rate
            total_sales += d.total

            bom = frappe.get_value("BOM", {"item": d.item_code, "is_active": 1, "is_default": 1}, "name")
            if not bom:
                frappe.throw(f"لا يوجد BOM للصنف {d.item_code}")

            bom_doc = frappe.get_doc("BOM", bom)
            for rm in bom_doc.items:
                total_qty = rm.qty * d.qty
                if rm.item_code in raw_materials_map:
                    raw_materials_map[rm.item_code]["qty"] += total_qty
                else:
                    raw_materials_map[rm.item_code] = {
                        "raw_item_code": rm.item_code,
                        "raw_item_name": rm.item_name,
                        "qty": total_qty,
                        "bom_rate": rm.rate or 0
                    }

        # المواد الخام
        for k, v in raw_materials_map.items():
            cost_rate = frappe.get_value(
                "Item Price",
                {"item_code": v["raw_item_code"], "price_list": buying_pl},
                "price_list_rate"
            )

            if not cost_rate:
                cost_rate = v["bom_rate"] or 0

            v["rate"] = cost_rate
            v["amount"] = v["qty"] * cost_rate
            total_cost += v["amount"]

            self.append("raw_materials", v)

        self.total_sales = total_sales
        self.total_cost = total_cost
        self.profit = total_sales - total_cost

    def update_totals(self):
        total_sales = 0
        total_cost = 0

        for d in self.items:
            d.total = (d.qty or 0) * (d.price or 0)
            total_sales += d.total

        for rm in self.raw_materials:
            rm.amount = (rm.qty or 0) * (rm.rate or 0)
            total_cost += rm.amount

        self.total_sales = total_sales
        self.total_cost = total_cost
        self.profit = total_sales - total_cost

    @frappe.whitelist()
    def calculate_from_bom_now(self):
        self.calculate_from_bom()
        return {
            "total_sales": self.total_sales,
            "total_cost": self.total_cost,
            "profit": self.profit
        }

    @frappe.whitelist()
    def update_totals_now(self):
        self.update_totals()
        return {
            "total_sales": self.total_sales,
            "total_cost": self.total_cost,
            "profit": self.profit
        }
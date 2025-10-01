import frappe
from frappe.desk.doctype.notification_log.notification_log import enqueue_create_notification
from erpnext.manufacturing.doctype.work_order import work_order
from frappe.utils import flt

@frappe.whitelist()
def create_kot_from_pos(doc, method=None):
    #doc = frappe.get_doc("POS Invoice", pos_invoice_name)
    
    kot = frappe.new_doc("Kitchen Order Ticket")
    kot.invoice = doc.name
    kot.status = "قيد التحضير"
    kot.table_number = doc.get("table_number") or 1
    kot.order_type = doc.get("order_type") or "Dine-In"
    
    
    for item in doc.items:
        kot.append("items", {
            "item_code": item.item_code,
            "item_name": item.item_name,
            "qty": item.qty,
            "note": item.get("item_note") or ""
        })
    
    items_text = "\n".join([f"{item.item_name}-{item.qty}" for item in doc.items])
    kot.items_summary = items_text
    
    kot.insert(ignore_permissions=True)
    frappe.db.commit()
    frappe.publish_realtime("kot_added", {"name": doc.name}, user=None)
    return kot.name

@frappe.whitelist()
def make_work_orders_from_sales_invoice(doc, method=None):
    print("DEBUG HOOK TRIGGERED for", doc.name)
    frappe.msgprint(f"DEBUG HOOK TRIGGERED for {doc.name}")
    """
    Create Work Orders and Stock Entriprint("DEBUG HOOK TRIGGERED for", doc.name)es for manufacturable items
    in a Consolidated Sales Invoice.
    """
    if not is_consolidated_invoice(doc):
        frappe.msgprint("DEBUG: Not a consolidated invoice or invalid docstatus/pos flag")
        return

    created_wos = []
    created_ses = []
    default_company = doc.company

    for item in doc.items:
        frappe.msgprint(f"DEBUG: Processing item {item.item_code} (qty: {item.qty})")
        bom_no = frappe.get_cached_value(
            "BOM", {"item": item.item_code, "is_default": 1}, "name"
        )
        if not bom_no:
            frappe.msgprint(f"Skipping {item.item_code}: No Default BOM found", indicator="orange")
            continue

        # Work Order
        wo = frappe.new_doc("Work Order")
        wo.production_item = item.item_code
        wo.qty = item.qty
        wo.bom_no = bom_no
        wo.company = default_company
        wo.wip_warehouse = frappe.get_cached_value(
            "Manufacturing Settings", None, "default_wip_warehouse"
        )
        wo.fg_warehouse = doc.set_warehouse
        wo.skip_transfer = 1
        wo.sales_invoice = doc.name
        wo.insert(ignore_permissions=True)
        wo.submit()
        created_wos.append(wo.name)
        frappe.msgprint(f"Created Work Order: {wo.name}")

        # Stock Entry
        try:
            se_dict = work_order.make_stock_entry(wo.name, "Manufacture", qty=item.qty)
            if not se_dict:
                frappe.msgprint(f"Failed to make Stock Entry for {item.item_code}")
                continue

            se_doc = frappe.get_doc(se_dict)

            for row in se_doc.items:
                raw_wh = frappe.get_value(
                    "Item Default",
                    {"parent": row.item_code, "company": default_company},
                    "default_warehouse",
                )
                if raw_wh:
                    if row.s_warehouse:
                        row.s_warehouse = raw_wh
                    else:
                        row.t_warehouse = raw_wh

            
            se_doc.insert(ignore_permissions=True)
            se_doc.submit()
            created_ses.append(se_doc.name)

        except Exception as e:
            frappe.log_error(frappe.get_traceback(), f"Error creating Stock Entry for WO {wo.name}")
            frappe.msgprint(
                f"Error creating Stock Entry for Work Order {wo.name}: {e}",
                indicator="orange",
            )

    if created_wos:
        frappe.msgprint(f"Created Work Orders: {', '.join(created_wos)}", alert=True, indicator="green")
    if created_ses:
        frappe.msgprint(f"Created Stock Entries: {', '.join(created_ses)}", alert=True, indicator="blue")
        


def delete_related_docs(doc, method=None):
    """
    Delete Work Orders and Stock Entries created from this Sales Invoice Consolidated.
    """
    if not is_consolidated_invoice(doc):
        return

    # Delete Stock Entries first
    wo_list = frappe.get_all(
        "Work Order",
        filters={"sales_invoice": doc.name},
        pluck="name"
    )

    if not wo_list:
        frappe.msgprint("DEBUG: No Work Orders found for this Sales Invoice.")
        return

   
    for wo_name in wo_list:
        se_list = frappe.get_all(
            "Stock Entry",
            filters={"work_order": wo_name},
            pluck="name"
        )

        for se_name in se_list:
            try:
                se_doc = frappe.get_doc("Stock Entry", se_name)
                if se_doc.docstatus == 1:
                    se_doc.cancel()
                    frappe.msgprint(f"Cancelled Stock Entry {se_name}")
                se_doc.delete(ignore_permissions=True)
                frappe.msgprint(f"Deleted Stock Entry {se_name}")
            except Exception as e:
                frappe.log_error(frappe.get_traceback(), f"Error deleting Stock Entry {se_name}")
                frappe.msgprint(f"Could not delete Stock Entry {se_name}: {e}", indicator="orange")

    
    for wo_name in wo_list:
        try:
            wo_doc = frappe.get_doc("Work Order", wo_name)
            if wo_doc.docstatus == 1:
                wo_doc.cancel()
                frappe.msgprint(f"Cancelled Work Order {wo_name}")
            wo_doc.delete(ignore_permissions=True)
            frappe.msgprint(f"Deleted Work Order {wo_name}")
        except Exception as e:
            frappe.log_error(frappe.get_traceback(), f"Error deleting Work Order {wo_name}")
            frappe.msgprint(f"Could not delete Work Order {wo_name}: {e}", indicator="orange")

def is_consolidated_invoice(doc):
    """
    Return True if this Sales Invoice is a Consolidated POS Invoice.
    """
    # Must be submitted
    if doc.is_consolidated != 1:
        return False

    # Must not be a POS Invoice itself
    if doc.is_pos != 1:
        return False
    return True
    # Check if there are any POS Invoices linked to this Consolidated Invoice
    pos_invoice_count = frappe.db.count(
        "POS Invoice", {"consolidated_invoice": doc.name}
    )
    return pos_invoice_count > 0


frappe.ui.form.on('Kitchen Order Ticket', {
    onload: function(frm) {
        if(!frappe.route_options) {
            frappe.set_route("List", "Kitchen Order Ticket", "Kanban");
        }
    }
});

frappe.listview_settings['Kitchen Order Ticket'] = {
    add_fields: ["status", "order_type", "table_number", "items"],
    get_indicator: function(doc) {
        if (doc.status === "قيد التحضير") {
            return [__("قيد التحضير"), "orange", "status,=,قيد التحضير"];
        } else if (doc.status === "جاهز") {
            return [__("جاهز"), "green", "status,=,جاهز"];
        } else if (doc.status === "تم التسليم") {
            return [__("تم التسليم"), "blue", "status,=,تم التسليم"];
        }
    },
    formatters: {
        "items": function(value, doc) {
            let list = doc.items.map(i => `${i.item_name} x${i.qty}`).join("<br>");
            return list;
        }
    }
};

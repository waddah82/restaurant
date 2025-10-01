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
    },
    onload: function(listview) {
        if(!frappe.route_options) {
            frappe.set_route("List", "Kitchen Order Ticket", "Kanban");
        }

        listview.page.body.find(".list-row").each(function() {
            let $row = $(this);
            let docname = $row.attr("data-name");
            let doc = frappe.get_doc("Kitchen Order Ticket", docname);

            if (!$row.find(".status-dropdown").length) {
                let $select = $('<select class="status-dropdown"></select>');
                ["قيد التحضير", "جاهز", "تم التسليم"].forEach(status => {
                    let $option = $('<option></option>').text(status).val(status);
                    if (status === doc.status) $option.attr("selected", true);
                    $select.append($option);
                });
                $select.change(function() {
                    let new_status = $(this).val();
                    frappe.db.set_value("Kitchen Order Ticket", docname, "status", new_status)
                        .then(() => frappe.show_alert(`تم تغيير الحالة إلى: ${new_status}`));
                });
                $row.find(".data-row").first().append($select);
            }
        });
    }
};
frappe.realtime.on("kot_added", function(data) {

    if (cur_list && cur_list.view_name === "Kanban" && cur_list.doctype === "Kitchen Order Ticket") {
        cur_list.refresh(); 
    }

    if (cur_list && cur_list.view_name === "List" && cur_list.doctype === "Kitchen Order Ticket") {
        cur_list.refresh();
    }
});


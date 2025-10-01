frappe.ui.form.on("Recipe Calculator", {
    refresh: function(frm) {
        frm.add_custom_button("Calculte Cost", function() {
            frm.call("calculate_from_bom_now").then(() => {
                frm.refresh_fields();
            });
        });

    }
});

frappe.ui.form.on("Recipe Calculator Item", {
    qty: function(frm) { frm.trigger("recalc"); },
    price: function(frm) { frm.trigger("recalc"); }
});

frappe.ui.form.on("Recipe Calculator Raw Material", {
    qty: function(frm) { frm.trigger("recalc"); },
    rate: function(frm) { frm.trigger("recalc"); }
});

frappe.ui.form.on("Recipe Calculator", {
    recalc: function(frm) {
        frm.call("update_totals_now").then(() => {
            frm.refresh_fields();
        });
    }
});
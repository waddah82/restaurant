

frappe.ui.form.on('Restaurant Menu', {
	setup: function (frm) {
		frm.add_fetch('item', 'standard_rate', 'rate');
	},
});

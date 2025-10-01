frappe.provide("erpnext.PointOfSale");

frappe.pages['point-of-sale'].on_page_load = function (wrapper) {
    frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Point of Sale"),
        single_column: true,
    });

    frappe.require("point-of-sale.bundle.js", function () {

        class MyPOSController extends erpnext.PointOfSale.Controller {
            constructor(wrapper) {
                super(wrapper);
            }

            check_stock_availability(item, qty, warehouse) {
                console.log("add item nnn", item.item_code);
                return true;
            }
        }

        wrapper.pos = new MyPOSController(wrapper);
        window.cur_pos = wrapper.pos;

        class MyPastOrderSummary extends erpnext.PointOfSale.PastOrderSummary {
            constructor(wrapper, args) {
                super(wrapper, args);
            }

            print_receipt() {
                const doc = this.doc;
                if (!doc) return;

                const settings = window.pos_print_settings;
                if (!settings) return;

                // Print only if method = Button Only
                if (settings.print_method !== "Button Only") {
                    frappe.msgprint("This invoice is printed automatically on submit.");
                    return;
                }

                // local send2bridge
                const send2bridge = function (doc, print_format, print_type) {
                    frappe.call({
                        method: 'silent_print.utils.print_format.create_pdf',
                        args: {
                            doctype: doc.doctype,
                            name: doc.name,
                            silent_print_format: print_format,
                            no_letterhead: 1,
                            _lang: "ar"
                        },
                        callback: (r) => {
                            if (r.message && r.message.pdf_base64) {
                                var printService = new silent_print.utils.WebSocketPrinter({
                                    onConnect: () => {
                                        printService.submit({
                                            'type': print_type,
                                            'url': 'file.pdf',
                                            'file_content': r.message.pdf_base64
                                        });
                                    }
                                });
                            } else {
                                frappe.msgprint(__("Failed to create the PDF file."));
                            }
                        }
                    });
                };

                const rules = settings.rules || [];
                rules.forEach(rule => {
                    if (rule.do_print) {
                        send2bridge(doc, rule.silent_print_format, rule.print_type);
                    }
                });

                // Update local cache to prevent re-print
                settings.last_printed_invoice = doc.name;
            }
        }

        erpnext.PointOfSale.PastOrderSummary = MyPastOrderSummary;

        // ------------------------------
        // Load POS Print Settings once
        // ------------------------------
        if (!window.pos_print_settings) {
            frappe.call({
                method: "frappe.client.get",
                args: { doctype: "POS Print Settings", name: "POS Print Settings" },
                callback: function (r) {
                    if (r.message) {
                        window.pos_print_settings = r.message;
                        console.log("POS Print Settings loaded", window.pos_print_settings);
                    }
                }
            });
        }

        // ------------------------------
        // Shortcut F2 for manual print
        // ------------------------------

    });
};

app_name = "restaurant"
app_title = "Restaurant"
app_publisher = "waddah"
app_description = "for restaurant"
app_email = "wd@wd.wd"
app_license = "mit"
app_logo_url = "/assets/restaurant/Images/H-logo.jpg"
# required_apps = []
#app_include_js = ["public/js/pos_invoice.js"]
# Includes in <head>
# ------------------

app_include_js = [
	"/assets/restaurant/js/pos_invoice.js",
 	"/assets/restaurant/js/silent_print.js",
 	"/assets/restaurant/js/gcs.bundle.js"
]

#web_include_js = "/assets/restaurant/js/silent_print.js"
website_context = {"splash_image": "/assets/restaurant/Images/H-logo.jpg"}

doc_events = {
    "POS Invoice": {
        "on_submit": "restaurant.api.create_kot_from_pos"
    
    },
    "Sales Invoice": {
        "on_submit": "restaurant.api.make_work_orders_from_sales_invoice",
        "on_cancel": "restaurant.api.delete_related_docs",
    }
}

page_js = {
    "point-of-sale": "public/js/custom_pos.js"
}

fixtures = [
    {
        "doctype": "Print Format",
        "filters": [
            ["name", "in", ["POS Juice Format", "POS Kitchen Format", "POS Cashier Format"]]
        ]
    },
    {
        "doctype": "Custom Field",
        "filters": [
            ["name", "in", ["Work Order-custom_sales_invoice","POS Invoice-custom_order_type000", "POS Invoice-custom_table_number000"]]
        ]
    },
    {
        "dt": "POS Settings"
    }
]

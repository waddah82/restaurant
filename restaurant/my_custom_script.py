import frappe
from frappe import whitelist
from frappe import _

@whitelist()
def get_modules_with_workspaces():
    """
    كود مع تصحيح كامل للأخطاء
    """
    try:
        print("🚀 بدء جلب البيانات...")
        
        # جلب جميع الـ Workspaces بدون فلتر أولاً
        all_workspaces = frappe.get_all(
            "Workspace",
            fields=["name", "title", "module", "icon", "for_user"],
            order_by="module, title"
        )
        
        print(f"🔍 العدد الإجمالي للـ Workspaces: {len(all_workspaces)}")
        
        # عرض بعض الأمثلة
        for i, ws in enumerate(all_workspaces[:5]):
            print(f"   مثال {i+1}: {ws.title} - module: {ws.module} - for_user: {ws.for_user}")
        
        # تصفية الـ Workspaces العامة (for_user = 0 أو null أو "")
        public_workspaces = []
        for ws in all_workspaces:
            # for_user يمكن أن يكون 0, "", None, أو "0"
            if not ws.for_user or ws.for_user == 0 or ws.for_user == "0":
                public_workspaces.append(ws)
        
        print(f"🌐 الـ Workspaces العامة: {len(public_workspaces)}")
        
        # إذا لم توجد workspaces عامة، نستخدم الكل
        if not public_workspaces:
            print("⚠️ لا توجد workspaces عامة، نستخدم جميع الـ workspaces")
            public_workspaces = all_workspaces
        
        # تجميع حسب الـ Module
        modules_map = {}
        
        for ws in public_workspaces:
            module_name = ws.module or "unassigned"
            
            if module_name not in modules_map:
                modules_map[module_name] = {
                    "name": module_name,
                    "title": _(module_name),
                    "icon": get_module_icon(module_name),
                    "workspaces": []
                }
            workspace_cards = get_workspace_cards(ws.name)
            # إضافة الـ Workspace
            workspace_data = {
                "name": ws.name,
                "title": _(ws.title or ws.name),
                "icon": get_workspace_icon(ws.icon),
                "cards": workspace_cards
            }
            if workspace_cards:
                modules_map[module_name]["workspaces"].append(workspace_data)

        modules_map = {k: v for k, v in modules_map.items() if v["workspaces"]}
        result = list(modules_map.values())
        print(f"🎯 النتيجة النهائية: {len(result)} وحدات")
        
        # إذا كانت النتيجة فارغة، نرجع بيانات اختبار
        if not result:
            print("🔄 النتيجة فارغة، نرجع بيانات اختبار")
            return get_test_data()
        
        return result
        
    except Exception as e:
        print(f"❌ خطأ رئيسي: {str(e)}")
        import traceback
        print(f"🔍 تفاصيل الخطأ: {traceback.format_exc()}")
        return get_test_data()

def get_workspace_cards(workspace_name):

    try:

        def user_can_read(doctype, user):
            try:
                roles = [r.role for r in frappe.get_all(
                    "Has Role",
                    filters={"parent": user},
                    fields=["role"]
                )]

                if not roles:
                    return False

                perms = frappe.get_all(
                    "DocPerm",
                    filters={
                        "parent": doctype,
                        "permlevel": 0,
                        "read": 1,
                        "role": ["in", roles]
                    },
                    limit=1
                )

                return True if perms else False

            except:
                return False

        links = frappe.get_all(
            "Workspace Link",
            filters={"parent": workspace_name},
            fields=["label", "link_to", "type", "link_type", "icon"],
            order_by="idx"
        )

        cards = []
        current_card = None

        for link in links:

            # Card Break
            if link.type == "Card Break":
                current_card = {
                    "title": _(link.label or "Card"),
                    "links": []
                }
                cards.append(current_card)

            # Link
            elif link.type == "Link" and link.link_to:

                if not user_can_read(link.link_to, frappe.session.user):
                    continue

                if not current_card:
                    current_card = {
                        "title": _("Links"),
                        "links": []
                    }
                    cards.append(current_card)

                link_data = {
                    "title": _(link.label or link.link_to),
                    "type": link.link_type,
                    "href": build_route(link.link_type, link.link_to),
                    "icon": get_link_icon(link.icon, link.link_type)
                }
                current_card["links"].append(link_data)

        # ��� ������ ������
        cards = [card for card in cards if card.get("links")]

        return cards

    except Exception as e:
        return []




def get_workspace_cards11111111111111(workspace_name):

    try:


        def user_can_read(doctype, user):
            try:
                roles = [r.role for r in frappe.get_all(
                    "Has Role",
                    filters={"parent": user},
                    fields=["role"]
                )]

                if not roles:
                    return False

                perms = frappe.get_all(
                    "DocPerm",
                    filters={
                        "parent": doctype,
                        "permlevel": 0,
                        "read": 1,
                        "role": ["in", roles]
                    },
                    limit=1
                )

                return True if perms else False

            except:
                return False

        links = frappe.get_all(
            "Workspace Link",
            filters={"parent": workspace_name},
            fields=["label", "link_to", "type", "link_type", "icon"],
            order_by="idx"
        )



        cards = []
        current_card = None

        for link in links:

            # --------- Card Break ---------
            if link.type == "Card Break":
                current_card = {
                    "title": link.label or "Card",
                    "links": []
                }
                cards.append(current_card)
 


            elif link.type == "Link" and link.link_to:


                if not user_can_read(link.link_to, frappe.session.user):

                    continue


                if not current_card:
                    current_card = {
                        "title": "Links",
                        "links": []
                    }
                    cards.append(current_card)


    
                link_data = {
                    "title": link.label or link.link_to,
                    "type": link.link_type,
                    "href": build_route(link.link_type, link.link_to),
                    "icon": get_link_icon(link.icon, link.link_type)
                }
                current_card["links"].append(link_data)
    


        if not cards:
            cards = [{
                "title": "Open Workspace",
                "links": [{
                    "title": "Open Workspace",
                    "type": "Workspace",
                    "href": f"/app/workspace/{frappe.scrub(workspace_name)}",
                    "icon": "fa-solid fa-external-link"
                }]
            }]
         

       
        return cards

    except Exception as e:
       
        return [{
            "title": "Default Card",
            "links": [{
                "title": "Open Workspace",
                "type": "Workspace",
                "href": f"/app/workspace/{frappe.scrub(workspace_name)}",
                "icon": "fa-solid fa-external-link"
            }]
        }]

def get_workspace_cards555555(workspace_name):
    """
    Fetch workspace cards and links according to current user permissions
    """
    try:
        current_user = frappe.session.user

        links = frappe.get_all(
            "Workspace Link",
            filters={"parent": workspace_name},
            fields=["label", "link_to", "type", "link_type", "icon"],
            order_by="idx"
        )

        cards = []
        current_card = None

        for link in links:

            # Card Break
            if link.type == "Card Break":
                current_card = {
                    "title": link.label or "Card",
                    "links": []
                }
                cards.append(current_card)

            # Normal Link
            elif link.type == "Link" and link.link_to:

                # Check user permission
                if not frappe.has_permission(link.link_to, "read", current_user):
                    continue

                # Create a default card if none exists
                if not current_card:
                    current_card = {
                        "title": "Links",
                        "links": []
                    }
                    cards.append(current_card)

                # Add link
                link_data = {
                    "title": link.label or link.link_to,
                    "type": link.link_type,
                    "href": build_route(link.link_type, link.link_to),
                    "icon": get_link_icon(link.icon, link.link_type)
                }
                current_card["links"].append(link_data)

        # If no cards, create a default one
        if not cards:
            cards = [{
                "title": "Open Workspace",
                "links": [{
                    "title": "Open Workspace",
                    "type": "Workspace",
                    "href": f"/app/workspace/{frappe.scrub(workspace_name)}",
                    "icon": "fa-solid fa-external-link"
                }]
            }]

        return cards

    except Exception as e:
        return [{
            "title": "Default Card",
            "links": [{
                "title": "Open Workspace",
                "type": "Workspace",
                "href": f"/app/workspace/{frappe.scrub(workspace_name)}",
                "icon": "fa-solid fa-external-link"
            }]
        }]

def get_workspace_cards1(workspace_name):
    """
    جلب الكروت والروابط مع معالجة الأخطاء
    """
    try:
        print(f"   📁 معالجة workspace: {workspace_name}")
        
        links = frappe.get_all(
            "Workspace Link",
            filters={"parent": workspace_name},
            fields=["label", "link_to", "type", "link_type", "icon"],
            order_by="idx"
        )
        
        print(f"      🔗 عدد الـ Links: {len(links)}")
        
        cards = []
        current_card = None
        
        for link in links:
            if link.type == "Card Break":
                # بدء كارد جديد
                current_card = {
                    "title": link.label or "Card",
                    "links": []
                }
                cards.append(current_card)
                print(f"         🎴 كارد جديد: {current_card['title']}")
                
            elif link.type == "Link" and link.link_to:
                # إذا لم يكن هناك كارد، ننشئ واحد افتراضي
                if not current_card:
                    current_card = {
                        "title": "Links",
                        "links": []
                    }
                    cards.append(current_card)
                    print(f"         🎴 كارد افتراضي: {current_card['title']}")
                
                # إضافة الرابط
                link_data = {
                    "title": link.label or link.link_to,
                    "type": link.link_type,
                    "href": build_route(link.link_type, link.link_to),
                    "icon": get_link_icon(link.icon, link.link_type)
                }
                
                current_card["links"].append(link_data)
                print(f"            ➕ رابط: {link_data['title']}")
        
        # إذا لم يكن هناك كروت، نضيف كارد افتراضي
        if not cards:
            cards = [{
                "title": "Open Workspace",
                "links": [{
                    "title": "Open Workspace",
                    "type": "Workspace", 
                    "href": f"/app/workspace/{frappe.scrub(workspace_name)}",
                    "icon": "fa-solid fa-external-link"
                }]
            }]
            print(f"         ℹ️ أضيف كارد افتراضي")
        
        print(f"      ✅ تم معالجة {workspace_name}: {len(cards)} كروت")
        return cards
        
    except Exception as e:
        print(f"      ❌ خطأ في {workspace_name}: {str(e)}")
        return [{
            "title": "Default Card",
            "links": [{
                "title": "Open Workspace", 
                "type": "Workspace",
                "href": f"/app/workspace/{frappe.scrub(workspace_name)}",
                "icon": "fa-solid fa-external-link"
            }]
        }]

def get_test_data():
    """بيانات اختبار شاملة"""
    return [
        {
            "name": "accounts",
            "title": "المحاسبة",
            "icon": "fa-solid fa-calculator",
            "workspaces": [
                {
                    "name": "accounting",
                    "title": "Accounting",
                    "icon": "fa-solid fa-calculator", 
                    "cards": [
                        {
                            "title": "الكارد الرئيسي",
                            "links": [
                                {
                                    "title": "Company",
                                    "type": "DocType",
                                    "href": "/app/company",
                                    "icon": "fa-solid fa-building"
                                },
                                {
                                    "title": "Account",
                                    "type": "DocType",
                                    "href": "/app/account", 
                                    "icon": "fa-solid fa-chart-bar"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "hr", 
            "title": "الموارد البشرية",
            "icon": "fa-solid fa-users",
            "workspaces": [
                {
                    "name": "hr",
                    "title": "HR",
                    "icon": "fa-solid fa-users",
                    "cards": [
                        {
                            "title": "إدارة الموظفين",
                            "links": [
                                {
                                    "title": "Employee",
                                    "type": "DocType",
                                    "href": "/app/employee",
                                    "icon": "fa-solid fa-user-tie"
                                },
                                {
                                    "title": "Department",
                                    "type": "DocType",
                                    "href": "/app/department",
                                    "icon": "fa-solid fa-sitemap"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]



@whitelist()
def get_workspaces_with_cards_and_links():
    try:
        workspaces_data = []
        workspaces = frappe.get_all(
            "Workspace",
            fields=["name","title","icon"],
            order_by="sequence_id"
        )


        for ws in workspaces:
            ws_links = frappe.get_all(
                "Workspace Link",
                filters={
                    "parent": ws.name,
                    "parenttype": "Workspace",
                    "parentfield": "links"
                },
                fields=["label","type","link_type","link_to"],
                order_by="idx asc"
            )

            workspace_info = {
                "name": ws.name,
                "title": ws.title or ws.name,
                "icon": ws.icon or "fa-solid fa-folder",
                "cards": []
            }

            current_card = None

            for row in ws_links:
                if row.type == "Card Break":
                    current_card = {
                        "title": row.label or "Card",
                        "links": [],
                        "color": "#007bff"
                    }
                    workspace_info["cards"].append(current_card)
                elif row.type == "Link":
                    if not current_card:
                        current_card = {
                            "title": "Links",
                            "links": [],
                            "color": "#6c757d"
                        }
                        workspace_info["cards"].append(current_card)

                    # بناء الرابط
                    slug = to_slug(row.link_to)
                    href = build_correct_route1(row.link_type, row.link_to, slug)

                    current_card["links"].append({
                        "title": row.label,
                        "type": row.link_type,
                        "href": href
                    })

            workspaces_data.append(workspace_info)

        return workspaces_data

    except Exception as e:
        frappe.log_error(f"Error: {str(e)}")
        return []


def to_slug(text):
    return text.strip().lower().replace(" ", "-")

def build_correct_route1(link_type, link_to, slug):



    if link_type == "DocType":
        return f"/app/{slug}"
    if link_type == "Report":
        return f"/app/query-report/{link_to}"
    if link_type == "Page":
        return f"/app/{slug}"
    if link_type == "Dashboard":
        return f"/app/dashboard/{slug}"
    if link_type == "Workspace":
        return f"/app/workspace/{slug}"
    return f"/app/{slug}"
    

def build_route(link_type, link_to):
    """بناء الرابط"""
    try:
        slug = link_to.strip().lower().replace(" ", "-")

        if link_type == "DocType":
            return f"/app/{slug}"
        elif link_type == "Report":
            return f"/app/query-report/{link_to}"
        elif link_type == "Page":
            return f"/app/{slug}"
        elif link_type == "Dashboard":
            return f"/app/dashboard/{slug}"
        elif link_type == "Workspace":
            return f"/app/workspace/{slug}"
        else:
            return f"/app/{slug}"
    except:
        return f"/app/{frappe.scrub(link_to)}"

def get_module_title(module_name):
    """عنوان الوحدة"""
    titles = {
        "unassigned": "تطبيقات أخرى",
        "Accounts": "المحاسبة",
        "Assets": "الأصول",
        "Buying": "المشتريات", 
        "CRM": "إدارة العملاء",
        "HR": "الموارد البشرية",
        "Manufacturing": "التصنيع",
        "Setup": "الإعدادات",
        "Core": "الأساسيات"
    }
    return titles.get(module_name, module_name)

def get_module_icon(module_name):
    """أيقونة الوحدة"""
    icons = {
        "unassigned": "fa-solid fa-th-large",
        "Accounts": "fa-solid fa-calculator", 
        "Assets": "fa-solid fa-toolbox",
        "Buying": "fa-solid fa-shopping-cart",
        "CRM": "fa-solid fa-handshake",
        "HR": "fa-solid fa-users",
        "Manufacturing": "fa-solid fa-industry", 
        "Setup": "fa-solid fa-cog",
        "Core": "fa-solid fa-cube"
    }
    return icons.get(module_name, "fa-solid fa-cube")

def get_workspace_icon(icon_name):
    """تحويل الأيقونات"""
    icon_map = {
        "accounting": "fa-solid fa-calculator",
        "file": "fa-solid fa-file",
        "arrow-left": "fa-solid fa-arrow-left",
        "assets": "fa-solid fa-toolbox",
        "tool": "fa-solid fa-wrench",
        "buying": "fa-solid fa-shopping-cart",
        "crm": "fa-solid fa-handshake",
        "assign": "fa-solid fa-user-check",
        "expenses": "fa-solid fa-receipt",
        "hr": "fa-solid fa-users",
        "non-profit": "fa-solid fa-hand-holding-heart",
        "integration": "fa-solid fa-plug",
        "setting": "fa-solid fa-cog",
        "getting-started": "fa-solid fa-home",
        "organization": "fa-solid fa-building",
        "": "fa-solid fa-folder",
        None: "fa-solid fa-folder"
    }
    return icon_map.get(icon_name, "fa-solid fa-folder")

def get_link_icon(icon_name, link_type):
    """أيقونة الرابط"""
    if icon_name:
        return get_workspace_icon(icon_name)
    
    icons = {
        "DocType": "fa-solid fa-table",
        "Report": "fa-solid fa-chart-bar",
        "Page": "fa-solid fa-file",
        "Dashboard": "fa-solid fa-gauge",
        "Workspace": "fa-solid fa-folder",
    }
    return icons.get(link_type, "fa-solid fa-link")
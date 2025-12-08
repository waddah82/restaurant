document.addEventListener("DOMContentLoaded", () => {
    if (window.__CUSTOM_SIDEBAR_LOADED__) {
        console.warn("Sidebar already loaded, skipping injection.");
        return;
    }
    
    window.__CUSTOM_SIDEBAR_LOADED__ = true;
    if (frappe.boot.user.language && frappe.boot.user.language.startsWith("ar")) {
        document.body.classList.add("rtl-mode");
        console.log('rtl-mode   arabic   llllllll');
    } else {
        console.log('rtl-mode not loaded');
    }
    injectCustomCSS();
    replaceERPNextSidebar();
    injectEverything();
    setTimeout(() => {
        const floatBtn = document.getElementById("floating-sidebar-btn");
        if (floatBtn) {
            floatBtn.addEventListener("click", () => {
                openSidebar();
            });
        }
    }, 300);
});

document.addEventListener("click", (e) => {
    const sidebar = document.getElementById("custom-sidebar");
    const floatBtn = document.getElementById("floating-sidebar-btn");
    if (!sidebar) return;

    // ≈–« sidebar „› ÊÕ Ê·Ì”  collapsed
    if (!sidebar.classList.contains("collapsed")) {
        // ≈–« «·‰ﬁ— Œ«—Ã sidebar Ê ·Ì” ⁄·Ï «·“— «·⁄«∆„
        if (!sidebar.contains(e.target) && (!floatBtn || !floatBtn.contains(e.target))) {
            toggleSidebar(); // Ì€·ﬁ sidebar
        }
    }
});


function openSidebar() {
    const sidebar = document.getElementById("custom-sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("collapsed");
    //sidebar.classList.remove("collapsed");  // Ì› Õ «·”«Ìœ»«—
}

// ==== CSS „œ„Ã ====
function injectCustomC() {
    if (document.getElementById("custom-style")) return;

    const style = document.createElement("style");
    style.id = "custom-style";
    style.innerHTML = `
    /* ==== Custom Sidebar & Layout ==== */
    body.custom-loaded {
        display: flex;
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    }

    .custom-sidebar {
        width: 320px;
        background: #1f2937;
        color: #f9fafb;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        overflow: hidden;
        z-index: 1000;
        transition: width 0.3s ease;
        display: flex;
        flex-direction: column;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .sidebar-header {
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
    }

    .sidebar-header h3 {
        margin: 0;
        color: #fbbf24;
    }

    .custom-sidebar .sidebar-toggle {
        padding: 15px;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
    }

    .custom-sidebar .user-section {
        padding: 15px 20px;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
    }

    .custom-sidebar .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }

    .custom-sidebar .toggle-btn {
        position: absolute;
        top: 20px;
        right: -15px;
        background: #1f2937;
        color: #D4AF37;
        border: 2px solid #374151;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.3s;
        z-index: 1001;
    }

    .custom-sidebar .toggle-btn:hover {
        transform: scale(1.1);
        background: #374151;
        color: #f1cc5b;
    }

    .modules-container {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        min-height: 0; /* „Â„ ··‹ flexbox scrolling */
    }

    /* Module Styles */
    .module-item {
        margin-bottom: 8px;
        border-radius: 8px;
        overflow: hidden;
    }

    .module-header {
        padding: 12px 15px;
        background: #374151;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        transition: background 0.3s;
    }

    .module-header:hover {
        background: #4b5563;
    }

    .menu-text {
        flex: 1;
    }

    .dropdown-icon {
        margin-left: auto;
        transition: transform 0.3s;
    }

    .module-content.active .dropdown-icon {
        transform: rotate(180deg);
    }

    .module-content {
        background: #111827;
        display: none;
    }

    .module-content.active {
        display: block;
    }

    /* Workspace Styles */
    .workspace-item {
        border-bottom: 1px solid #2d3748;
    }

    .workspace-header {
        padding: 10px 15px 10px 25px;
        background: #2d3748;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background 0.3s;
    }

    .workspace-header:hover {
        background: #374151;
    }

    .workspace-dropdown {
        margin-left: auto;
        transition: transform 0.3s;
    }

    .workspace-content.active .workspace-dropdown {
        transform: rotate(180deg);
    }

    .workspace-content {
        background: #1a202c;
        display: none;
    }

    .workspace-content.active {
        display: block;
    }

    /* Card Styles */
    .card-item {
        border-bottom: 1px solid #2d3748;
    }

    .card-header {
        padding: 8px 15px 8px 35px;
        background: #2d3748;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background 0.3s;
    }

    .card-header:hover {
        background: #374151;
    }

    .card-title {
        flex: 1;
    }

    .card-dropdown {
        margin-left: auto;
        transition: transform 0.3s;
    }

    .card-content.active .card-dropdown {
        transform: rotate(180deg);
    }

    .card-content {
        background: #1a202c;
        display: none;
    }

    .card-content.active {
        display: block;
    }

    /* Link Styles */
    .link-item {
        padding: 6px 15px 6px 45px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.3s;
        border-bottom: 1px solid #2d3748;
        font-size: 13px;
    }

    .link-item:hover {
        background: #2d3748;
    }

    .link-item:last-child {
        border-bottom: none;
    }

    .link-item i {
        width: 16px;
        text-align: center;
        color: #9ca3af;
    }

    /* Main Content */
    .main-content {
        margin-left: 340px;
        padding: 20px;
        background: #f3f4f6;
        height: 100vh;
        overflow-y: auto;
        transition: margin-left 0.3s ease;
        width: calc(100% - 340px);
        flex: 1;
    }

    .custom-sidebar.collapsed + .main-content {
        margin-left: 80px;
        width: calc(100% - 80px);
    }

    /* States */
    .loading, .error, .empty {
        padding: 20px;
        text-align: center;
        color: #9ca3af;
    }

    .error {
        color: #ef4444;
    }

    .empty {
        color: #6b7280;
    }

    .no-workspaces, .no-cards, .no-links {
        padding: 15px 20px;
        color: #6b7280;
        font-style: italic;
        text-align: center;
    }

    /* Icons */
    .es-icon {
        width: 16px;
        height: 16px;
        fill: currentColor;
    }

    .icon-sm {
        width: 14px;
        height: 14px;
    }

    .icon-xs {
        width: 12px;
        height: 12px;
    }

    /* Scrollbar „Õ”‰ */
    .modules-container::-webkit-scrollbar {
        width: 6px;
    }

    .modules-container::-webkit-scrollbar-track {
        background: #1f2937;
        border-radius: 3px;
    }

    .modules-container::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 3px;
    }

    .modules-container::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
    }

    /* Scrollbar ··„Õ ÊÏ «·—∆Ì”Ì */
    .main-content::-webkit-scrollbar {
        width: 8px;
    }

    .main-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
    }

    .main-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }

    .main-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }

    /* Responsive */
    @media (max-height: 600px) {
        .modules-container {
            padding: 5px;
        }
        
        .module-header {
            padding: 8px 12px;
        }
        
        .workspace-header {
            padding: 8px 12px 8px 20px;
        }
        
        .card-header {
            padding: 6px 12px 6px 25px;
        }
        
        .link-item {
            padding: 4px 12px 4px 35px;
        }
    }

    @media (max-width: 768px) {
        .custom-sidebar {
            width: 100%;
            transform: translateX(-100%);
        }
        
        .custom-sidebar.active {
            transform: translateX(0);
        }
        
        .main-content {
            margin-left: 0;
            width: 100%;
        }
    }
    .floating-sidebar-btn {
        position: fixed;
        top: 35px;
        left: 2px; /* «› —«÷Ì ··Ì”«— */
        width: 30px;
        height: 30px;
        background: #4b4b4b;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99999;
        font-size: 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    
    /* ⁄‰œ «··€… «·⁄—»Ì… ó Ì‰ﬁ· «·“— ··Ì”«— */
    body.rtl-mode .floating-sidebar-btn {
        right: 25px;
        
    }
    
    .floating-sidebar-btn:hover {
        background: #333;
    }
    
    /* «·Ê÷⁄ «·⁄«œÌ («·≈‰Ã·Ì“Ì) */
    .custom-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 260px;
        height: 100vh;
        transform: translateX(0);
        transition: all 0.3s ease;
        direction: ltr;
    }
    
    /* ⁄‰œ ≈€·«ﬁ «·”«Ìœ»«— */
    .custom-sidebar.closed {
        transform: translateX(-260px);
    }
    
    /* RTL ⁄‰œ ·€… ⁄—»Ì… */
    body.rtl-mode .custom-sidebar {
        right: 0;
        left: auto;
        direction: rtl;
        text-align: right;
    }
    
    /* RTL ⁄‰œ «·≈€·«ﬁ */
    body.rtl-mode .custom-sidebar.closed {
        transform: translateX(260px);
    }
    
    /* “— «· ﬂ„‘… (toggle-btn) */
    .toggle-btn {
        position: absolute;
        top: 10px;
        right: -25px;
        cursor: pointer;
    }
    
    /* RTL ó ‰ﬁ· “— «· ﬂ„‘… ··ÃÂ… «·√Œ—Ï */
    body.rtl-mode .toggle-btn {
        left: -25px;
        right: auto;
    }
    
    /* √ÌﬁÊ‰… «·Â«„»—€— */
    #sidebar-toggle {
        position: absolute;
        top: 10px;
        left: 10px;
    }
    
    /* RTL ó ‰ﬁ· √ÌﬁÊ‰… «·Â«„»—€— */
    body.rtl-mode #sidebar-toggle {
        right: 10px;
        left: -20px;
        display: flex;
        justify-content: flex-end;
        padding: 8px;
        cursor: pointer;
        position: sticky;
        top: 50px;
        z-index: 1001;
        background: blue;
    }
    
    .menu-text {
        flex: 1;
        margin: 10 !important;
        font-size: 15px !important;
        font-weight: 600;
        color: white;
    }
    .standard-sidebar,
    .desk-sidebar,
    .search-dialog .search-results .search-sidebar {
        display: none !important;
        width: 0 !important;
        max-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
    }
    
    .dropdown-container {
        margin-bottom: 8px;
        width: 100%;
    }
    .custom-sidebar .sidebar-toggle {
        display: flex;
        justify-content: flex-end;
        padding: 2px;
        cursor: pointer;
        position: sticky;
        top: 50px;
        z-index: 1001;
        background: blue;
    }
    
    .custom-sidebar.collapsed {
        width: 10px;
    }
    
    .module-item .module-header,
    .workspace-item .workspace-header,
    .card-item .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 1px;
        transition: background 0.2s;
    }
    .module-item .module-header {
        display: flex;
        font-family: 'wad7';
        font-size: 19px;
        align-items: center;
        justify-content: space-between;
        padding-top: 10px;
        padding-right: 3px;
        padding-bottom: 10px;
        padding-left: 3px;
        cursor: pointer;
        cursor: pointer;
        border-radius: 1px;
        transition: background 0.2s;
        background:  var(--blue-primary);
        
        
    }
    .workspace-item .workspace-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        cursor: pointer;
        background:  var(--blue-secondary);
    }
    .card-title {
        display: flex;
        padding-left: 22px !important;
        text-align: center;
        align-items: center;
        
    }
    .card-item .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 22px !important;
        padding-right: 22px !important;
        text-align: center;
        cursor: pointer;
        border-radius: 1px;
        transition: background 0.2s;
    }
    /* --------------------------- */
    /* --- ’›Õ«   ”ÃÌ· «·œŒÊ· --- */
    /* --------------------------- */
    /* ==== Custom Sidebar & Layout ==== */
    .container,
    .container-sm,
    .container-md,
    .container-lg,
    .container-xl,
    .container-xxl,
    .page-container,
    .layout-main-section {
        max-width: 100% !important;
        width: 100% !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
    }
    
    /* Ã⁄· ÕﬁÊ· «·‰„Ê–Ã „„ œ… */
    .form-layout,
    .form-section,
    .section-body,
    .layout-main {
        max-width: 100% !important;
        width: 100% !important;
    }
    
    
    
    
    /*.layout-side-section,*/
    
    /* --------------------------- */
    /* --- ’›Õ«   ”ÃÌ· «·œŒÊ· --- */
    /* --------------------------- */
    /* ==== Custom Sidebar & Layout ==== */
    .container,
    .container-sm,
    .container-md,
    .container-lg,
    .container-xl,
    .container-xxl,
    .page-container,
    .layout-main-section {
        max-width: 100% !important;
        width: 100% !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
    }
    
    /* Ã⁄· ÕﬁÊ· «·‰„Ê–Ã „„ œ… */
    .form-layout,
    .form-section,
    .section-body,
    .layout-main {
        max-width: 100% !important;
        width: 100% !important;
    }
    
    /*  Ê”Ì⁄ „‰ÿﬁ… «·„Õ ÊÏ */
    .page-body,
    #page-content,
    .main-section {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Õ Ï œ«Œ· «·‹ Dialog */
    .modal-dialog {
        max-width: 90% !important;
    }
    
    /*  Ê”Ì⁄ «·‹ Grid ›Ì Child Tables */
    .grid-form,
    .grid-body {
        max-width: 100% !important;
    }
    
    /* ≈·€«¡ «·ÂÊ«„‘ «·«› —«÷Ì… */
    .container {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    body.custom-loaded {
        display: flex;
        margin: 0;
        
    }
    `;
    document.head.appendChild(style);
}

function injectCustomCSS() {
    if (document.getElementById("custom-style")) return;

    const style = document.createElement("style");
    style.id = "custom-style";
    style.innerHTML = `
    body.custom-loaded {
        display: flex;
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    body.custom-loaded {
        display: flex;
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    }

    .custom-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 260px;
        height: 100vh;
        background: #1f2937;
        color: #f9fafb;
        overflow: hidden;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        transition: width 0.3s ease;
    }

    .custom-sidebar.closed {
        transform: translateX(-260px);
    }

    .custom-sidebar.collapsed {
        width: 10px;
    }

    body.rtl-mode .custom-sidebar {
        right: 0;
        left: auto;
        direction: rtl;
        text-align: right;
    }

    body.rtl-mode .custom-sidebar.closed {
        transform: translateX(260px);
    }

    .sidebar-header {
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
    }

    .sidebar-header h3 {
        margin: 0;
        color: #fbbf24;
    }

    .custom-sidebar .sidebar-toggle {
        padding: 2px;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
        position: sticky;
        top: 50px;
        z-index: 1001;
        background: blue;
    }

    .custom-sidebar .user-section {
        padding: 15px 20px;
        border-bottom: 1px solid #374151;
        background: #111827;
        flex-shrink: 0;
    }

    .custom-sidebar .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }

    .toggle-btn {
        position: absolute;
        top: 10px;
        right: -25px;
        cursor: pointer;
    }

    body.rtl-mode .toggle-btn {
        left: -25px;
        right: auto;
    }

    #sidebar-toggle {
        position: absolute;
        top: 10px;
        left: 10px;
    }

    body.rtl-mode #sidebar-toggle {
        right: 10px;
        left: -20px;
        display: flex;
        justify-content: flex-end;
        padding: 8px;
        cursor: pointer;
        position: sticky;
        top: 50px;
        z-index: 1001;
        background: blue;
    }

    .modules-container {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        min-height: 0;
    }

    .modules-container::-webkit-scrollbar {
        width: 6px;
    }

    .modules-container::-webkit-scrollbar-track {
        background: #1f2937;
        border-radius: 3px;
    }

    .modules-container::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 3px;
    }

    .modules-container::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
    }

    .module-item {
        margin-bottom: 8px;
        border-radius: 8px;
        overflow: hidden;
    }

    .module-item .module-header {
        display: flex;
        font-family: 'wad7';
        font-size: 19px;
        align-items: center;
        justify-content: space-between;
        padding: 10px 3px;
        cursor: pointer;
        background: var(--blue-primary);
        transition: background 0.2s;
    }

    .module-item .module-header:hover {
        background: #4b5563;
    }

    .menu-text {
        flex: 1;
        margin: 10 !important;
        font-size: 15px !important;
        font-weight: 600;
        color: white;
    }

    .dropdown-icon {
        margin-left: auto;
        transition: transform 0.3s;
    }

    .module-content.active .dropdown-icon {
        transform: rotate(180deg);
    }

    .module-content {
        background: #111827;
        display: none;
    }

    .module-content.active {
        display: block;
    }

    .workspace-item {
        border-bottom: 1px solid #2d3748;
    }

    .workspace-item .workspace-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        cursor: pointer;
        background: var(--blue-secondary);
        transition: background 0.2s;
    }

    .workspace-item .workspace-header:hover {
        background: #374151;
    }

    .workspace-dropdown {
        margin-left: auto;
        transition: transform 0.3s;
    }

    .workspace-content.active .workspace-dropdown {
        transform: rotate(180deg);
    }

    .workspace-content {
        background: #1a202c;
        display: none;
    }

    .workspace-content.active {
        display: block;
    }

    .card-item {
        border-bottom: 1px solid #2d3748;
    }

    .card-item .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 2px;
        padding-right: 22px;
        padding-bottom: 2px;
        padding-left: 22px;
        cursor: pointer;
        background: #2d3748;
        transition: background 0.2s;
    }

    .card-item .card-header:hover {
        background: #374151;
    }

    .card-title {
        flex: 1;
        padding-left: 22px !important;
        text-align: center;
        align-items: center;
    }

    .card-dropdown {
        margin-left: auto;
        transition: transform 0.3s;
    }

    .card-content.active .card-dropdown {
        transform: rotate(180deg);
    }

    .card-content {
        background: #1a202c;
        display: none;
    }

    .card-content.active {
        display: block;
    }

    .link-item {
        padding: 6px 15px 6px 45px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.3s;
        border-bottom: 1px solid #2d3748;
        font-size: 13px;
    }

    .link-item:hover {
        background: #2d3748;
    }

    .link-item:last-child {
        border-bottom: none;
    }

    .link-item i {
        width: 16px;
        text-align: center;
        color: #9ca3af;
    }

    .main-content {
        margin-left: 340px;
        padding: 20px;
        background: #f3f4f6;
        height: 100vh;
        overflow-y: auto;
        transition: margin-left 0.3s ease;
        width: calc(100% - 340px);
        flex: 1;
    }

    .main-content::-webkit-scrollbar {
        width: 8px;
    }

    .main-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
    }

    .main-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }

    .main-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }

    .custom-sidebar.collapsed + .main-content {
        margin-left: 80px;
        width: calc(100% - 80px);
    }

    .loading, .error, .empty {
        padding: 20px;
        text-align: center;
        color: #9ca3af;
    }

    .error {
        color: #ef4444;
    }

    .empty {
        color: #6b7280;
    }

    .no-workspaces, .no-cards, .no-links {
        padding: 15px 20px;
        color: #6b7280;
        font-style: italic;
        text-align: center;
    }

    .es-icon {
        width: 16px;
        height: 16px;
        fill: currentColor;
    }

    .icon-sm {
        width: 14px;
        height: 14px;
    }

    .icon-xs {
        width: 12px;
        height: 12px;
    }

    @media (max-height: 600px) {
        .modules-container {
            padding: 5px;
        }
        
        .module-header {
            padding: 8px 12px;
        }
        
        .workspace-header {
            padding: 8px 12px 8px 20px;
        }
        
        .card-header {
            padding: 6px 12px 6px 25px;
        }
        
        .link-item {
            padding: 4px 12px 4px 35px;
        }
    }

    @media (max-width: 768px) {
        .custom-sidebar {
            width: 100%;
            transform: translateX(-100%);
        }
        
        .custom-sidebar.active {
            transform: translateX(0);
        }
        
        .main-content {
            margin-left: 0;
            width: 100%;
        }
    }

    .floating-sidebar-btn {
        position: fixed;
        top: 35px;
        left: 2px;
        width: 30px;
        height: 30px;
        background: #4b4b4b;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99999;
        font-size: 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    
    body.rtl-mode .floating-sidebar-btn {
        right: 25px;
    }
    
    .floating-sidebar-btn:hover {
        background: #333;
    }

    .dropdown-container {
        margin-bottom: 8px;
        width: 100%;
    }

    .container,
    .container-sm,
    .container-md,
    .container-lg,
    .container-xl,
    .container-xxl,
    .page-container,
    .layout-main-section {
        max-width: 100% !important;
        width: 100% !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
    }
    
    .form-layout,
    .form-section,
    .section-body,
    .layout-main {
        max-width: 100% !important;
        width: 100% !important;
    }
    
    .page-body,
    #page-content,
    .main-section {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    .modal-dialog {
        max-width: 90% !important;
    }
    
    .grid-form,
    .grid-body {
        max-width: 100% !important;
    }
    
    .container {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .standard-sidebar,
    .desk-sidebar,
    .search-dialog .search-results .search-sidebar {
        display: none !important;
        width: 0 !important;
        max-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
    }
    `;
    document.head.appendChild(style);
}

// ==== ≈“«·… sidebar «·‰Ÿ«„ ====
function replaceERPNextSidebar() {
    const oldSidebar = document.querySelector(".layout-side-section");
    if (oldSidebar) {
        oldSidebar.style.display = 'none';
    }
}

// ==== Inject everything ====
function injectEverything() {
    injectCustomSidebar();
    document.body.classList.add("custom-loaded");
    loadCurrentUser();
    loadWorkspaces();
}

// ==== Sidebar HTML „œ„Ã ====
function injectCustomSidebar11() {
    if (document.querySelector(".custom-sidebar")) return;

    const sidebarHTML = `
    <div class="custom-sidebar" id="custom-sidebar">
        <div class="sidebar-header">
            <h3>?? ·ÊÕ… «· ÿ»Ìﬁ« </h3>
        </div>
        <div class="sidebar-toggle" id="sidebar-toggle">
            <i class="fa-solid fa-bars"></i>
        </div>
        <button class="toggle-btn" onclick="toggleSidebar()">
            <i class="fa-solid fa-angles-left"></i>
        </button>

        <div class="user-section">
            <div class="user-info">
                <i class="fa-solid fa-user"></i>
                <span id="currentUser">Ã«—Ì «· Õ„Ì·...</span>
            </div>
        </div>

        <div class="modules-container" id="modules-container">
            <div class="loading">? Ã«—Ì  Õ„Ì· «·»Ì«‰« ...</div>
        </div>
    </div>
    
    <div class="main-content">
        <!-- «·„Õ ÊÏ «·√’·Ì -->
    </div>
    `;
    
    // ‰ﬁ· «·„Õ ÊÏ «·√’·Ì ≈·Ï main-content
    const pageContent = document.querySelector('.layout-main-section') || document.querySelector('.page-content');
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    
    if (pageContent) {
        document.body.insertBefore(mainContent, pageContent);
        mainContent.appendChild(pageContent);
    } else {
        document.body.insertAdjacentHTML('beforeend', '<div class="main-content"><div style="padding: 20px;">„Õ ÊÏ «· ÿ»Ìﬁ</div></div>');
    }
    
    document.body.insertAdjacentHTML("afterbegin", sidebarHTML);
    setupSidebarToggle();
}
function injectCustomSidebar() {
    if (document.querySelector(".custom-sidebar")) return;

    const sidebarHTML = `
    <div class="custom-sidebar" id="custom-sidebar">
        <div class="sidebar-toggle" id="sidebar-toggle">
            <i class="fa-solid fa-bars"></i>
        </div>
        <div class="toggle-btn" onclick="toggleSidebar()">
            <i class="fa-solid fa-angles-left"></i>
        </div>

        <div class="user-section">
            <div class="user-info">
                <i class="fa-solid fa-user"></i>
                <span id="currentUser">Loading...</span>
            </div>
        </div>

        <ul class="modules-container" id="modules-container">
            <li class="loading">Loading menu...</li>
        </ul>
    </div>
    <div class="floating-sidebar-btn" id="floating-sidebar-btn">
        <i class="fa-solid fa-bars"></i>
    </div>
    `;
    document.body.insertAdjacentHTML("afterbegin", sidebarHTML);
    setupSidebarToggle();
}
function toggleSidebar() {
    const sidebar = document.getElementById("custom-sidebar");
    if (sidebar) {
        sidebar.classList.toggle("collapsed");
        const icon = sidebar.querySelector('.toggle-btn i');
        if (sidebar.classList.contains('collapsed')) {
            icon.className = 'fa-solid fa-angles-right';
        } else {
            icon.className = 'fa-solid fa-angles-left';
        }
    }
}

// ==== ≈⁄œ«œ “— collapse ====
function setupSidebarToggle() {
    const btn = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("custom-sidebar");

    if (btn && sidebar) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }
}

// ====  Õ„Ì· «·»Ì«‰«  „‰ «·»«ÌÀÊ‰ ====
function loadWorkspaces() {
    console.log('?? »œ¡  Õ„Ì· «·»Ì«‰« ...');
    
    frappe.call({
        method: 'restaurant.my_custom_script.get_modules_with_workspaces',
        callback: function(response) {
            console.log('?? «” Ã«»… API:', response);
            
            if (response.message && Array.isArray(response.message)) {
                if (response.message.length > 0) {
                    console.log(`?  „  Õ„Ì· ${response.message.length} ÊÕœ…`);
                    renderRealWorkspacesStructure(response.message);
                } else {
                    showEmptyState();
                }
            } else if (response.message && response.message.error) {
                showErrorState(response.message.error);
            } else {
                showErrorState('—œ €Ì— „⁄—Ê› „‰ «·Œ«œ„');
            }
        },
        error: function(err) {
            console.error('? Œÿ√ ›Ì «” œ⁄«¡ API:', err);
            showErrorState('›‘· ›Ì «·« ’«· »«·Œ«œ„');
        }
    });
}

// ==== ⁄—÷ «·»Ì«‰«  »‰„ÿ «·‹ Workspaces ====
function renderRealWorkspacesStructure(workspaces) {
    const container = document.getElementById('modules-container');
    if (!container) return;

    let html = '';
    workspaces.forEach(module => {
        const safeModuleName = module.name.replace(/'/g, "\\'");
        html += `<div class="module-item">
                    <div class="module-header" onclick="toggleModule('${safeModuleName}')">
                        <i class="${module.icon || 'fa-solid fa-cube'}"></i>
                        <span class="menu-text">${module.title || module.name}</span>
                        <svg class="es-icon icon-sm dropdown-icon" aria-hidden="true">
                            <use href="#es-line-down"></use>
                        </svg>
                    </div>
                    <div class="module-content" id="module-${safeModuleName}">
                        ${renderModuleWorkspaces(module.workspaces)}
                    </div>
                 </div>`;
    });
    container.innerHTML = html;
}

function renderModuleWorkspaces(workspaces) {
    if (!workspaces || workspaces.length === 0) {
        return `<div class="no-workspaces">No workspaces available</div>`;
    }
    
    let html = '';
    workspaces.forEach(ws => {
        html += `<div class="workspace-item">
                    <div class="workspace-header" onclick="toggleWorkspace('${ws.name.replace(/'/g,"\\'")}')">
                        <i class="${ws.icon || 'fa-solid fa-folder'}"></i>
                        <span class="menu-text">${ws.title || ws.name}</span>
                        <svg class="es-icon icon-sm workspace-dropdown" aria-hidden="true">
                            <use href="#es-line-down"></use>
                        </svg>
                    </div>
                    <div class="workspace-content" id="workspace-${ws.name.replace(/'/g,"\\'")}">
                        ${renderCardsStructure(ws)}
                    </div>
                 </div>`;
    });
    return html;
}

function renderCardsStructure(workspace) {
    if (!workspace.cards || workspace.cards.length === 0) {
        return `<div class="no-cards">No content available</div>`;
    }
    let html = '';
    workspace.cards.forEach((card, index) => {
        const cardId = `card-${workspace.name}-${index}`;
        html += `<div class="card-item">
            <div class="card-header" onclick="toggleCard('${cardId}')">
                <span class="card-title">${card.title}</span>
                <svg class="es-icon icon-sm card-dropdown" aria-hidden="true">
                    <use href="#es-line-down"></use>
                </svg>
            </div>
            <div class="card-content" id="${cardId}">
                ${renderLinksStructure(card)}
            </div>
        </div>`;
    });
    return html;
}

function renderLinksStructure(card) {
    if (!card.links || card.links.length === 0) {
        return `<div class="no-links">No links available</div>`;
    }
    let html = '';
    card.links.forEach(link => {
        html += `<div class="link-item" onclick="navigateTo('${link.href}')">
            <i class="${link.icon||'fa-solid fa-link'}"></i>
            <span>${link.title}</span>
        </div>`;
    });
    return html;
}

// ==== ÊŸ«∆› «· »œÌ· ====
window.toggleModule = function(moduleName) {
    const content = document.getElementById(`module-${moduleName}`);
    const icon = event.currentTarget.querySelector('.dropdown-icon use');
    
    if (content) {
        // ≈€·«ﬁ Ã„Ì⁄ «·‹ modules «·√Œ—Ï
        document.querySelectorAll('.module-content').forEach(item => {
            if (item.id !== `module-${moduleName}`) {
                item.classList.remove('active');
                const otherIcon = item.previousElementSibling?.querySelector('.dropdown-icon use');
                if (otherIcon) {
                    otherIcon.setAttribute('href', '#es-line-down');
                }
            }
        });
        
        content.classList.toggle('active');
        if (icon) {
            if (content.classList.contains('active')) {
                icon.setAttribute('href', '#es-line-up');
            } else {
                icon.setAttribute('href', '#es-line-down');
            }
        }
    }
}

window.toggleWorkspace = function(workspaceName) {
    const content = document.getElementById(`workspace-${workspaceName}`);
    const icon = event.currentTarget.querySelector('.workspace-dropdown use');
    
    if (content) {
        content.classList.toggle('active');
        if (icon) {
            if (content.classList.contains('active')) {
                icon.setAttribute('href', '#es-line-up');
            } else {
                icon.setAttribute('href', '#es-line-down');
            }
        }
    }
}

window.toggleCard = function(cardId) {
    const content = document.getElementById(cardId);
    const icon = event.currentTarget.querySelector('.card-dropdown use');
    
    if (content) {
        content.classList.toggle('active');
        if (icon) {
            if (content.classList.contains('active')) {
                icon.setAttribute('href', '#es-line-up');
            } else {
                icon.setAttribute('href', '#es-line-down');
            }
        }
    }
}

// ==== «· ‰ﬁ· ====
window.navigateTo = function(path) {
    console.log("?? «·«‰ ﬁ«· ≈·Ï:", path);
    if (typeof frappe !== 'undefined' && frappe.set_route) {
        frappe.set_route(path);
    } else {
        window.location.href = path;
    }
}

// ==== Õ«·«  «·⁄—÷ ====
function showEmptyState() {
    const container = document.getElementById('modules-container');
    if (container) {
        container.innerHTML = `
            <div class="empty">
                <i class="fa-solid fa-inbox" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <div>·«  ÊÃœ  ÿ»Ìﬁ«  „ «Õ…</div>
                <small>Ì—ÃÏ «· Õﬁﬁ „‰ ≈⁄œ«œ«  «·‰Ÿ«„</small>
            </div>
        `;
    }
}

function showErrorState(message) {
    const container = document.getElementById('modules-container');
    if (container) {
        container.innerHTML = `
            <div class="error">
                <i class="fa-solid fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <div>? ${message}</div>
                <small>Ì—ÃÏ «·„Õ«Ê·… „—… √Œ—Ï</small>
            </div>
        `;
    }
}

// ==== Load current user ====
async function loadCurrentUser() {
    const span = document.getElementById('currentUser');
    if (!span) return;
    
    try {
        if (typeof frappe !== 'undefined' && frappe.session && frappe.session.user) {
            span.innerText = frappe.session.user_fullname || frappe.session.user;
        } else {
            const res = await fetch('/api/method/frappe.auth.get_logged_user', {
                credentials: 'include'
            });
            const data = await res.json();
            span.innerText = data.message || "“«∆—";
        }
    } catch (error) {
        console.error('Error loading user:', error);
        span.innerText = "„” Œœ„";
    }
}

// ==== ÊŸ«∆› „”«⁄œ… ≈÷«›Ì… ====
function refreshSidebar() {
    console.log('??  ÕœÌÀ «·‹ Sidebar...');
    const container = document.getElementById('modules-container');
    if (container) {
        container.innerHTML = '<div class="loading">? Ã«—Ì  ÕœÌÀ «·»Ì«‰« ...</div>';
    }
    loadWorkspaces();
}

// Ã⁄· ÊŸÌ›… «· ÕœÌÀ „ «Õ… globally
window.refreshSidebar = refreshSidebar;

// ≈÷«›… event listener ··ÊÕ… «·„›« ÌÕ (Ctrl+R · ÕœÌÀ «·‹ Sidebar)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshSidebar();
    }
});

console.log('?  „  Õ„Ì· Custom Sidebar »‰Ã«Õ!');
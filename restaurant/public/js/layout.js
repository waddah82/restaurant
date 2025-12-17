document.addEventListener("DOMContentLoaded", () => {
(function loadFA() {
    if (document.getElementById("fa-6")) return;

    const fa = document.createElement("link");
    fa.id = "fa-6";
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(fa);
})();

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

    
    if (!sidebar.classList.contains("collapsed")) {
       
        if (!sidebar.contains(e.target) && (!floatBtn || !floatBtn.contains(e.target))) {
            toggleSidebar(); 
        }
    }
});


function openSidebar() {
    const sidebar = document.getElementById("custom-sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("collapsed");
 
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
        color: #BA9F63;
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
        background: #153351;
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

    .clink-item {
        padding: 6px 15px 6px 45px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.3s;
        border-bottom: 1px solid #2d3748;
        font-size: 13px;
    }

    .clink-item:hover {
        background: #2d3748;
    }

    .clink-item:last-child {
        border-bottom: none;
    }

    .clink-item i {
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
        
        .clink-item {
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
    /* =================== PROFESSIONAL UI POLISH =================== */

/* Sidebar background with depth */
.custom-sidebar {
    background: linear-gradient(
        180deg,
        #153351 0%,
        #0f2a44 100%
    );
}

/* Modules – strong & clear */
.module-header {
    background: rgba(255,255,255,0.08);
    border-left: 4px solid transparent;
}

.module-header:hover {
    background: rgba(255,255,255,0.14);
    border-left-color: #BA9F63;
}

/* Active module */
.module-content.active + .module-header,
.module-header.active {
    border-left-color: #BA9F63;
}

/* Workspace – lighter */
.workspace-header {
    background: rgba(255,255,255,0.05);
}

.workspace-header:hover {
    background: rgba(255,255,255,0.1);
}

/* Card – very subtle */
.card-header {
    background: rgba(255,255,255,0.04);
}

.card-header:hover {
    background: rgba(255,255,255,0.08);
}

/* Links – action feeling */
.clink-item {
    color: #DAE1E3;
}

.clink-item:hover {
    background: rgba(186,159,99,0.25);
    color: #ffffff;
}

/* Icons color harmony */
.module-header i,
.workspace-header i,
.clink-item i {
    color: #BA9F63;
}

/* Dropdown arrows */
.dropdown-icon,
.workspace-dropdown,
.card-dropdown {
    opacity: 0.7;
}

.module-header:hover .dropdown-icon,
.workspace-header:hover .workspace-dropdown,
.card-header:hover .card-dropdown {
    opacity: 1;
}

/* Smooth feel */
.module-header,
.workspace-header,
.card-header,
.clink-item {
    transition: all 0.2s ease;
}

/* Sidebar shadow – depth */
.custom-sidebar {
    box-shadow: 6px 0 24px rgba(0,0,0,0.35);
}
/* ================= CLEAN ENTERPRISE SIDEBAR ================= */

/* إزالة الإحساس بالكروت */
.module-item,
.workspace-item,
.card-item {
    border-radius: 0 !important;
    margin-bottom: 0 !important;
}

/* إزالة أي borders ثقيلة */
.module-header,
.workspace-header,
.card-header {
    border: none !important;
    box-shadow: none !important;
}

/* Hover ناعم بدون مربعات */
.module-header:hover,
.workspace-header:hover,
.card-header:hover {
    background: rgba(186,159,99,0.12) !important;
}

/* Active state احترافي (خط ذهبي رفيع فقط) */
.module-content.active > .workspace-item:first-child,
.module-header.active {
    box-shadow: inset 3px 0 0 #BA9F63;
}

/* Links – بدون صناديق */
.clink-item {
    background: transparent !important;
    border-radius: 0 !important;
}

.clink-item:hover {
    background: rgba(186,159,99,0.18) !important;
}

/* إزالة أي outline أبيض من المتصفح */
.module-header:focus,
.workspace-header:focus,
.card-header:focus,
.clink-item:focus {
    outline: none !important;
}

/* تحسين الإحساس العام */
.module-header,
.workspace-header,
.card-header,
.clink-item {
    transition: background-color 0.18s ease,
                color 0.18s ease;
}

/* أي SVG أو icon لا يعطي إطار */
svg,
i {
    outline: none !important;
    box-shadow: none !important;
}

    /* مسافة بين الأيقونة والنص – حل عام */
.module-header,
.workspace-header,
.card-header,
.clink-item,
.user-info {
    display: flex;
    align-items: center;
    gap: 12px; /* ← عدّل الرقم حسب ذوقك */
}
/* ================= FINAL ENTERPRISE DESIGN ================= */

/* إزالة أي إحساس مربعات نهائيًا */
.module-item,
.workspace-item,
.card-item {
    background: transparent !important;
    border-radius: 0 !important;
    margin: 0 !important;
}

/* العناوين الأساسية */
.module-header,
.workspace-header,
.card-header,
.clink-item {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    position: relative;
}

/* Hover ناعم جدًا (بدون أبيض) */
.module-header:hover,
.workspace-header:hover,
.card-header:hover,
.clink-item:hover {
    background: rgba(21, 51, 81, 0.35) !important; /* أزرق داكن شفاف */
}

/* شريط ذهبي احترافي عند التحويم */
.module-header::before,
.workspace-header::before,
.card-header::before,
.clink-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: #BA9F63;
    opacity: 0.9;
    transition: width 0.18s ease;
}

.module-header:hover::before,
.workspace-header:hover::before,
.card-header:hover::before,
.clink-item:hover::before {
    width: 3px;
}

/* Active state (ثابت وهادئ) */
.module-content.active + .module-header::before,
.module-header.active::before {
    width: 3px;
}

/* النص */
.menu-text,
.card-title,
.clink-item span {
    color: #DAE1E3;
    font-weight: 500;
}

/* الأيقونات */
.module-header i,
.workspace-header i,
.card-header i,
.clink-item i {
    color: #BA9F63;
    opacity: 0.85;
}

/* بدون أي outline من المتصفح */
*:focus,
*:focus-visible,
*:active {
    outline: none !important;
    box-shadow: none !important;
}

/* حركة خفيفة جدًا عند hover */
.module-header:hover,
.workspace-header:hover,
.card-header:hover,
.clink-item:hover {
    transform: translateX(2px);
}

/* انتقالات ناعمة */
.module-header,
.workspace-header,
.card-header,
.clink-item {
    transition:
        background-color 0.15s ease,
        transform 0.15s ease;
}
/* ================= CLEAN MODERN SCROLLBAR ================= */

/* Firefox */
.modules-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(186,159,99,0.6) transparent;
}

/* Chrome / Edge / Safari */
.modules-container::-webkit-scrollbar {
    width: 4px;               /* نحيف جدًا */
}

.modules-container::-webkit-scrollbar-track {
    background: transparent;  /* بدون مسار */
}

.modules-container::-webkit-scrollbar-thumb {
    background: rgba(186,159,99,0.55); /* ذهبي شفاف */
    border-radius: 10px;
}

/* يظهر فقط عند التمرير */
.modules-container:not(:hover)::-webkit-scrollbar-thumb {
    background: transparent;
}

/* عند hover */
.modules-container:hover::-webkit-scrollbar-thumb {
    background: rgba(186,159,99,0.8);
}

/* يمنع أي إطار غبي */
.modules-container::-webkit-scrollbar-thumb:window-inactive {
    background: transparent;
}

    
    `;
    document.head.appendChild(style);
}

function replaceERPNextSidebar() {
    const oldSidebar = document.querySelector(".layout-side-section");
    if (oldSidebar) {
        oldSidebar.style.display = 'none';
    }
}

function injectEverything() {
    injectCustomSidebar();
    document.body.classList.add("custom-loaded");
    loadCurrentUser();
    loadWorkspaces();
}

function injectCustomSidebar11() {
    if (document.querySelector(".custom-sidebar")) return;

    const sidebarHTML = `
    <div class="custom-sidebar" id="custom-sidebar">
        <div class="sidebar-header">
            <h3>?? ���� ���������</h3>
        </div>
        
        <button class="toggle-btn" onclick="toggleSidebar()">
            <i class="fa-solid fa-angles-left"></i>
        </button>

        <div class="user-section">
            <div class="user-info">
                <i class="fa-solid fa-user"></i>
                <span id="currentUser">���� �������...</span>
            </div>
        </div>

        <div class="modules-container" id="modules-container">
            <div class="loading">? ���� ����� ��������...</div>
        </div>
    </div>
    
    <div class="main-content">
        <!-- ������� ������ -->
    </div>
    `;
    
    const pageContent = document.querySelector('.layout-main-section') || document.querySelector('.page-content');
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    
    if (pageContent) {
        document.body.insertBefore(mainContent, pageContent);
        mainContent.appendChild(pageContent);
    } else {
        document.body.insertAdjacentHTML('beforeend', '<div class="main-content"><div style="padding: 20px;">����� �������</div></div>');
    }
    
    document.body.insertAdjacentHTML("afterbegin", sidebarHTML);
    setupSidebarToggle();
}
function injectCustomSidebar() {
    if (document.querySelector(".custom-sidebar")) return;

    const sidebarHTML = `
    <div class="custom-sidebar collapsed" id="custom-sidebar">
     
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
        ☰
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

function loadWorkspaces() {
    console.log('?? ��� ����� ��������...');
    
    frappe.call({
        method: 'my_custom_app.my_custom_script.get_modules_with_workspaces',
        callback: function(response) {
            console.log('?? ������� API:', response);
            
            if (response.message && Array.isArray(response.message)) {
                if (response.message.length > 0) {
                    console.log(`? �� ����� ${response.message.length} ����`);
                    renderRealWorkspacesStructure(response.message);
                } else {
                    showEmptyState();
                }
            } else if (response.message && response.message.error) {
                showErrorState(response.message.error);
            } else {
                showErrorState('�� ��� ����� �� ������');
            }
        },
        error: function(err) {
            console.error('? ��� �� ������� API:', err);
            showErrorState('��� �� ������� �������');
        }
    });
}

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
        html += `<div class="clink-item" onclick="navigateTo('${link.href}')">
            <i class="${link.icon||'fa-solid fa-link'}"></i>
            <span>${link.title}</span>
        </div>`;
    });
    return html;
}


window.toggleModule = function(moduleName) {
    const content = document.getElementById(`module-${moduleName}`);
    const icon = event.currentTarget.querySelector('.dropdown-icon use');
    
    if (content) {
        // ����� ���� ��� modules ������
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

// ==== ������ ====
window.navigateTo = function(path) {
    console.log("?? �������� ���:", path);
    if (typeof frappe !== 'undefined' && frappe.set_route) {
        frappe.set_route(path);
    } else {
        window.location.href = path;
    }
}

// ==== ����� ����� ====
function showEmptyState() {
    const container = document.getElementById('modules-container');
    if (container) {
        container.innerHTML = `
            <div class="empty">
                <i class="fa-solid fa-inbox" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <div>�� ���� ������� �����</div>
                <small>���� ������ �� ������� ������</small>
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
                <small>���� �������� ��� ����</small>
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
            span.innerText = data.message || "����";
        }
    } catch (error) {
        console.error('Error loading user:', error);
        span.innerText = "������";
    }
}

// ==== ����� ������ ������ ====
function refreshSidebar() {
    console.log('?? ����� ��� Sidebar...');
    const container = document.getElementById('modules-container');
    if (container) {
        container.innerHTML = '<div class="loading">? ���� ����� ��������...</div>';
    }
    loadWorkspaces();
}

// ��� ����� ������� ����� globally
window.refreshSidebar = refreshSidebar;

// ����� event listener ����� �������� (Ctrl+R ������ ��� Sidebar)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshSidebar();
    }
});

console.log('? �� ����� Custom Sidebar �����!');

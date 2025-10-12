window.onload = function () {
    setTimeout(applyCustomCSS, 1000);
};

function applyCustomCSS() {

    getCSSFromUISettings().then(settings => {
        if (settings.enable_custom_css && settings.custom_css) {
            applyCSS(settings.custom_css);
            console.log('✅ تم تطبيق CSS المخصص بنجاح');
        } else {
            console.log('ℹ️ CSS المخصص غير مفعل أو غير موجود');
        }
    }).catch(error => {
        console.log('❌ خطأ في جلب إعدادات CSS:', error);
    });
}

function getCSSFromUISettings() {
    return new Promise((resolve, reject) => {
        if (typeof frappe === 'undefined' || !frappe.db) {
            reject('Frappe framework not available');
            return;
        }


        frappe.db.get_value('UI Setting', 'UI Setting', ['custom_css', 'enable_custom_css'])
            .then(response => {
                if (response && response.message) {
                    resolve(response.message);
                } else {
                    // إذا لم يوجد سجل، نجلب أول سجل موجود
                    frappe.db.get_list('UI Setting', {
                        fields: ['custom_css', 'enable_custom_css'],
                        limit: 1
                    }).then(listResponse => {
                        if (listResponse && listResponse.length > 0) {
                            resolve(listResponse[0]);
                        } else {
                            reject('No UI Setting record found');
                        }
                    }).catch(reject);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

function applyCSS(cssCode) {
    // إزالة الأنماط القديمة إذا كانت موجودة
    const oldStyle = document.getElementById('custom-ui-styles');
    if (oldStyle) {
        oldStyle.remove();
    }

    // إضافة الأنماط الجديدة
    let style = document.createElement('style');
    style.id = 'custom-ui-styles';
    style.innerHTML = cssCode;
    document.head.appendChild(style);
}

// دالة التحديث اليدوي
function manualUpdateCSS() {
    console.log('🔄 جاري تحديث CSS...');
    applyCustomCSS();
}

// إضافة زر للتحديث اليدوي
function addManualUpdateButton() {
    if (document.getElementById('css-update-btn')) return;

    const updateButton = document.createElement('button');
    updateButton.id = 'css-update-btn';
    updateButton.innerHTML = '🎨 تحديث التصميم';
    updateButton.style.position = 'fixed';
    updateButton.style.bottom = '20px';
    updateButton.style.right = '20px';
    updateButton.style.zIndex = '9999';
    updateButton.style.padding = '10px 15px';
    updateButton.style.backgroundColor = '#071879';
    updateButton.style.color = 'white';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '5px';
    updateButton.style.cursor = 'pointer';
    updateButton.style.fontSize = '12px';
    updateButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    updateButton.addEventListener('click', function () {
        manualUpdateCSS();
        if (typeof frappe !== 'undefined' && frappe.show_alert) {
            frappe.show_alert({
                message: 'تم تحديث التصميم بنجاح',
                indicator: 'green'
            });
        }
    });

    document.body.appendChild(updateButton);
}

// جعل الدوال متاحة globally
window.applyCustomCSS = applyCustomCSS;
window.manualUpdateCSS = manualUpdateCSS;

// تفعيل الزر اليدوي (اختياري)
// addManualUpdateButton();
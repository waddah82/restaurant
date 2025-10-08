window.onload = function() {

    setTimeout(applyCustomStyles, 500);
};

function applyCustomStyles() {
    const css = `
             .widget.links-widget-box.link-item {
        color: #180101 !important;
    font-weight: 500 !important;
    font-size: larger !important;
    }
    `;
    
    let style = document.createElement('style');
    style.id = 'custom-global-styles';
    style.innerHTML = css;
    document.head.appendChild(style);
}
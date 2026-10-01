// Apply the saved preference before the stylesheet paints the page.
(() => {
    let theme;
    try { theme = localStorage.getItem('wisdomday-theme'); } catch (_) { /* Storage may be unavailable. */ }
    if (theme !== 'light' && theme !== 'dark') {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.dataset.theme = theme;
})();

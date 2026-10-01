(() => {
    const button = document.getElementById('theme-toggle');
    const toast = document.getElementById('theme-toast');
    let toastTimer;
    const updateButton = () => {
        const label = document.documentElement.dataset.theme === 'dark' ? '切換為淺色模式' : '切換為深色模式';
        button.setAttribute('aria-label', label);
        button.title = label;
    };
    updateButton();
    button.addEventListener('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem('wisdomday-theme', theme); } catch (_) { /* Keep the session preference. */ }
        updateButton();
        clearTimeout(toastTimer);
        toast.textContent = `已切換為${theme === 'dark' ? '深色' : '淺色'}模式`;
        toast.classList.add('visible');
        toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
    });
})();

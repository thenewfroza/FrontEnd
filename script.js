(function() {
    if (window.PerformanceObserver) {
        const observer = new PerformanceObserver((list) => {
            list.getEntriesByType('navigation').forEach((entry) => {
                const loadTime = entry.domContentLoadedEventEnd - entry.startTime;
                document.getElementById('load-time').textContent = 'Page load time is ' + (loadTime / 1000).toFixed(2) + ' seconds.';
            });
        });

        observer.observe({ type: 'navigation', buffered: true });
    }

    function setActiveMenuItem() {
        const navItems = document.querySelectorAll('.navbar__menu a');
        const currentPage = window.location.pathname.split('/').pop();

        navItems.forEach(item => {
            const linkPage = item.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('load', setActiveMenuItem);
})();
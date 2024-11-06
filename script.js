(function() {
    const observer = new PerformanceObserver((list) => {
        list.getEntriesByType('navigation').forEach((entry) => {
            const loadTime = entry.domContentLoadedEventEnd - entry.startTime;
            document.getElementById('load-time').textContent = 'Page load time is ' + (loadTime / 1000).toFixed(2) + ' seconds.';
        });
    });

    observer.observe({ type: 'navigation', buffered: true });
})();
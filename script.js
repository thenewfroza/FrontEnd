(function() {
    if (window.PerformanceObserver) {

        const observer = new PerformanceObserver((list) => {
               const [temp] = list.getEntriesByType('navigation')
                const loadTime = temp.domContentLoadedEventEnd - temp.startTime;
                document.getElementById('load-time').textContent = 'Page load time is '
                    + (loadTime / 1000).toFixed(2) + ' seconds'
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

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('album-container');
    let lastFetched = 0; // Переменная для отслеживания последнего фильтра

    const getRandomFilter = () => {
        // Генерируем случайное значение (1 или 2)
        const random = Math.random() < 0.5 ? 1 : 2;
        return random === 1 ? { minId: 1, maxId: 5 } : { minId: 6, maxId: 10 };
    };

    const fetchAlbums = async () => {
        try {
            container.classList.add('loading');
            const { minId, maxId } = getRandomFilter();
            const response = await fetch('https://jsonplaceholder.typicode.com/photos');
            if (!response.ok) throw new Error('Network response was not ok');
            let albums = await response.json();
            container.classList.remove('loading');

            // Фильтруем альбомы по случайному диапазону ID
            albums = albums.filter(album => album.id >= minId && album.id <= maxId);

            renderAlbums(albums.slice(0, 5)); // Отображаем первые 20 альбомов после фильтрации
        } catch (error) {
            container.classList.remove('loading');
            container.innerHTML = '<p>⚠ Что-то пошло не так</p>';
            console.error('Error:', error);
        }
    };

    const renderAlbums = (albums) => {
        container.innerHTML = ''; // Очищаем контейнер
        albums.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.classList.add('album');

            const img = document.createElement('img');
            img.src = album.thumbnailUrl;
            img.alt = album.title;

            // Обработчик загрузки изображения
            img.onload = () => {
                preloaderElement.style.display = 'none'; // Прячем прелоадер после загрузки
            };

            // Обработчик ошибки загрузки изображения
            img.onerror = () => {
                preloaderElement.style.display = 'none';
                const errorMessage = document.createElement('div');
                errorMessage.innerText = 'Ошибка загрузки изображения';
                errorMessage.style.color = 'red';
                albumElement.appendChild(errorMessage);
            };

            const titleElement = document.createElement('h3');
            titleElement.innerText = album.title;

            albumElement.appendChild(titleElement);
            albumElement.appendChild(img);
            container.appendChild(albumElement);
        });
    };

    setTimeout(() => {
        fetchAlbums();
    }, 3000);  // Вызов функции
});
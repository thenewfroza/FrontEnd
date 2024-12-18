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
    const loadMoreButton = document.createElement('button');
    loadMoreButton.innerText = 'Загрузить еще';

    let lastFetched = 0;
    let allAlbums = [];

    const getRandomFilter = () => {
        const random = Math.random() < 0.5 ? 1 : 2;
        return random === 1 ? { minId: 1, maxId: 5 } : { minId: 6, maxId: 10 };
    };

    const fetchAlbums = async (limit = 5) => {
        try {
            container.classList.add('loading');
            const { minId, maxId } = getRandomFilter();
            const response = await fetch('https://jsonplaceholder.typicode.com/albums/1/photos');
            if (!response.ok) throw new Error('Network response was not ok');
            let albums = await response.json();
            container.classList.remove('loading');

            albums = albums.filter(album => album.id >= minId && album.id <= maxId);

            allAlbums = allAlbums.concat(albums.slice(lastFetched, lastFetched + limit));
            lastFetched += limit;
            renderAlbums(albums.slice(0, 7));

        } catch (error) {
            container.classList.remove('loading');
            container.innerHTML = '<p>⚠ Что-то пошло не так</p>';
            console.error('Error:', error);
        }
    };

    const renderAlbums = (albums) => {
        albums.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.classList.add('album');

            const img = document.createElement('img');
            img.src = album.thumbnailUrl;
            img.alt = album.title;


            img.onload = () => {
                preloaderElement.style.display = 'none';
            };


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
        if (!container.contains(loadMoreButton)) {
            container.appendChild(loadMoreButton);
        }
    };

    loadMoreButton.addEventListener('click', () => {
        fetchAlbums(5); // Загрузить 5 новых фото
    });

    setTimeout(() => {
        fetchAlbums(5);
    }, 3000);
});

// ===== СКРИПТ ДЛЯ САЙТА "БОЛЬШАЯ МЫШЬ" =====

class BigMouth {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎬 Big Mouth сайт загружен!');
        this.initSmoothScroll();
        this.initTrailer();
        this.initGallery();
    }

    // ПЛАВНАЯ ПРОКРУТКА
    initSmoothScroll() {
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // УПРАВЛЕНИЕ ТРЕЙЛЕРОМ
    initTrailer() {
        window.showTrailer = () => {
            const trailerBlock = document.getElementById('trailer-block');
            if (trailerBlock) {
                trailerBlock.style.display = 'block';
                trailerBlock.scrollIntoView({ behavior: 'smooth' });
            }
        };

        window.showAllEpisodes = () => {
            alert('🚀 Функция "Смотреть серии" будет доступна после добавления видеоплеера!');
        };
    }

    // ГАЛЕРЕЯ
    initGallery() {
        // Автоматическая генерация галереи из album.html
        const gallery = document.getElementById('gallery');
        if (gallery) {
            this.generateGallery(gallery);
        }
    }

    generateGallery(gallery) {
        const start = 87;
        const end = 144;

        for (let i = start; i <= end; i++) {
            const div = document.createElement('div');
            div.className = 'photo';

            const img = document.createElement('img');
            const num = i.toString().padStart(4, '0');
            
            img.src = `media/gallery/IMG_${num}.JPG`;
            img.alt = `Кадр из сериала Большая мышь ${i}`;
            img.loading = 'lazy';

            img.onerror = () => {
                // Если изображение не найдено, используем заглушку
                img.src = 'https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Big+Mouth';
            };

            div.appendChild(img);
            gallery.appendChild(div);
        }
    }
}

// ЗАПУСК САЙТА
document.addEventListener('DOMContentLoaded', () => {
    window.bigMouth = new BigMouth();
});
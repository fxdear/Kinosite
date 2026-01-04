// ==================== ОСНОВНОЙ КОД KINOSITE 2025 ====================
class Kinosite {
    constructor() {
        this.init();
    }

    // ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
    init() {
        console.log('🎬 Kinosite 2025 загружен!');
        this.initTheme();
        this.initCarousel();
        this.initSearch();
        this.initFilters();
        this.initFavorites();
        this.initSorting();
        this.initCategoryCards();
        this.initNewsCards();
        this.initBannerButtons();
        this.initAuthButtons();
        
        // Запускаем генерацию контента в зависимости от страницы
        if (window.location.pathname.includes('catalog.html') || document.getElementById('catalogGrid')) {
            this.generateCatalog();
            this.fillYearFilter();
        }
        
        if (window.location.pathname.includes('glavnoe.html') || document.getElementById('top10Slider')) {
            this.generateTop10Slider();
            this.generateNewReleases();
            this.generateRecommended();
        }
        
        if (window.location.pathname.includes('favorite.html')) {
            this.displayFavoritesPage();
        }
        
        this.initSmartImageLoading();
    }

    // ИНИЦИАЛИЗАЦИЯ КНОПОК АВТОРИЗАЦИИ
    initAuthButtons() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userProfile = document.getElementById('userProfile');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Проверяем, есть ли сохраненный пользователь
        this.updateAuthUI();
    }

    // ПОКАЗ МОДАЛЬНОГО ОКНА ВХОДА
    showLoginModal() {
        const modalHTML = `
            <div class="modal-overlay" id="loginModal">
                <div class="modal">
                    <div class="modal-header">
                        <h2>Вход / Регистрация</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 20px; text-align: center;">
                            <button id="showLoginForm" class="auth-btn" style="margin-right: 10px; background: linear-gradient(45deg, var(--accent-blue), var(--accent-purple)); color: white;">Вход</button>
                            <button id="showRegisterForm" class="auth-btn">Регистрация</button>
                        </div>
                        
                        <form id="loginForm" style="display: block;">
                            <div class="form-group">
                                <label for="loginEmail">Email или имя пользователя</label>
                                <input type="text" id="loginEmail" required placeholder="Введите email или имя пользователя">
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Пароль</label>
                                <input type="password" id="loginPassword" required placeholder="Введите пароль">
                            </div>
                            <button type="submit" class="btn-submit">Войти</button>
                        </form>
                        
                        <form id="registrationForm" style="display: none;">
                            <div class="form-group">
                                <label for="regEmail">Email</label>
                                <input type="email" id="regEmail" required placeholder="Введите ваш email">
                            </div>
                            <div class="form-group">
                                <label for="regUsername">Имя пользователя</label>
                                <input type="text" id="regUsername" required placeholder="Придумайте имя пользователя">
                            </div>
                            <div class="form-group">
                                <label for="regPassword">Пароль</label>
                                <input type="password" id="regPassword" required placeholder="Придумайте пароль">
                            </div>
                            <div class="form-group">
                                <label for="regConfirmPassword">Подтвердите пароль</label>
                                <input type="password" id="regConfirmPassword" required placeholder="Повторите пароль">
                            </div>
                            <button type="submit" class="btn-submit">Зарегистрироваться</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.initLoginModal();
    }

    // ИНИЦИАЛИЗАЦИЯ МОДАЛЬНОГО ОКНА ВХОДА
    initLoginModal() {
        const modal = document.getElementById('loginModal');
        const closeBtn = modal.querySelector('.modal-close');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registrationForm');
        const showLoginBtn = document.getElementById('showLoginForm');
        const showRegisterBtn = document.getElementById('showRegisterForm');

        // Закрытие модального окна
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Переключение между формами
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginBtn.style.background = 'linear-gradient(45deg, var(--accent-blue), var(--accent-purple))';
            showLoginBtn.style.color = 'white';
            showRegisterBtn.style.background = 'transparent';
            showRegisterBtn.style.color = 'var(--text-secondary)';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });

        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterBtn.style.background = 'linear-gradient(45deg, var(--accent-blue), var(--accent-purple))';
            showRegisterBtn.style.color = 'white';
            showLoginBtn.style.background = 'transparent';
            showLoginBtn.style.color = 'var(--text-secondary)';
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });

        // Обработка формы входа
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Обработка формы регистрации
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        // Анимация появления
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal').style.transform = 'translateY(0)';
        }, 10);
    }

    // ОБРАБОТКА ВХОДА
    handleLogin() {
        const login = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!login || !password) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('kinosite-users')) || [];
        const user = users.find(user => 
            (user.email === login || user.username === login) && 
            user.password === btoa(password)
        );

        if (!user) {
            this.showNotification('Неверный логин или пароль', 'error');
            return;
        }

        // Сохраняем текущего пользователя
        localStorage.setItem('kinosite-current-user', JSON.stringify({
            email: user.email,
            username: user.username,
            id: user.id
        }));

        // Закрываем модальное окно
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }

        this.showNotification('Вход выполнен! Добро пожаловать, ' + user.username + '!', 'success');
        this.updateAuthUI();
        this.updateFavoritesUI(); // Обновляем избранное после входа
    }

    // ОБРАБОТКА РЕГИСТРАЦИИ
    handleRegistration() {
        const email = document.getElementById('regEmail').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Валидация
        if (!email || !username || !password || !confirmPassword) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Пароль должен быть не менее 6 символов', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('Введите корректный email', 'error');
            return;
        }

        // Проверяем, существует ли пользователь
        const users = JSON.parse(localStorage.getItem('kinosite-users')) || [];
        const existingUser = users.find(user => user.email === email || user.username === username);

        if (existingUser) {
            this.showNotification('Пользователь с таким email или именем уже существует', 'error');
            return;
        }

        // Сохраняем пользователя
        const newUser = {
            email,
            username,
            password: btoa(password),
            id: Date.now(),
            favorites: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('kinosite-users', JSON.stringify(users));

        // Автоматически логиним пользователя
        localStorage.setItem('kinosite-current-user', JSON.stringify({
            email: newUser.email,
            username: newUser.username,
            id: newUser.id
        }));

        // Закрываем модальное окно
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }

        this.showNotification('Регистрация успешна! Добро пожаловать, ' + username + '!', 'success');
        this.updateAuthUI();
        this.updateFavoritesUI(); // Обновляем избранное после регистрации
    }

    // ВАЛИДАЦИЯ EMAIL
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ВЫХОД
    logout() {
        localStorage.removeItem('kinosite-current-user');
        this.showNotification('Вы вышли из системы', 'info');
        this.updateAuthUI();
        this.updateFavoritesUI(); // Обновляем избранное после выхода
    }

    // ОБНОВЛЕНИЕ ИНТЕРФЕЙСА АВТОРИЗАЦИИ
    updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userProfile = document.getElementById('userProfile');
        const currentUser = JSON.parse(localStorage.getItem('kinosite-current-user'));

        if (currentUser) {
            // Пользователь авторизован
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.innerHTML = `
                    <div class="user-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
                    <span>${currentUser.username}</span>
                `;
            }
        } else {
            // Пользователь не авторизован
            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'none';
            }
        }
    }

    // СИСТЕМА ТЕМ
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('kinosite-theme') || 'dark';

        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');

            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('kinosite-theme', 'light');
                themeToggle.textContent = '☀️';
            } else {
                localStorage.setItem('kinosite-theme', 'dark');
                themeToggle.textContent = '🌙';
            }
        });
    }

    // УМНАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ
    initSmartImageLoading() {
        setTimeout(() => {
            this.optimizeMoviePosters();
            this.optimizeNewsImages();
        }, 500);
    }

    // ОПТИМИЗАЦИЯ ПОСТЕРОВ ФИЛЬМОВ
    optimizeMoviePosters() {
        document.querySelectorAll('.movie-card-image').forEach(container => {
            const img = container.querySelector('img');
            if (!img) return;

            const src = img.src;
            const alt = img.alt;
            
            // Создаем временное изображение для проверки загрузки
            const tempImg = new Image();
            tempImg.onload = () => {
                container.style.backgroundImage = `url('${src}')`;
                container.style.backgroundSize = 'cover';
                container.style.backgroundPosition = 'center center';
                container.style.backgroundRepeat = 'no-repeat';
                img.style.display = 'none';
            };
            
            tempImg.onerror = () => {
                // Используем fallback изображение
                container.style.backgroundImage = "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop')";
                container.style.backgroundSize = 'cover';
                container.style.backgroundPosition = 'center center';
                container.style.backgroundRepeat = 'no-repeat';
                img.style.display = 'none';
            };
            
            tempImg.src = src;
        });
    }

    // ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ НОВОСТЕЙ
    optimizeNewsImages() {
        document.querySelectorAll('.news-card-image').forEach(container => {
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center center';
            container.style.backgroundRepeat = 'no-repeat';
        });
    }

    // КАРУСЕЛЬ БАННЕРОВ
    initCarousel() {
        const banners = document.querySelectorAll('.banner');
        if (!banners.length) return;

        let currentIndex = 0;
        const totalBanners = banners.length;

        const showBanner = (index) => {
            banners.forEach(banner => banner.classList.remove('active'));
            banners[index].classList.add('active');
        };

        const nextBanner = () => {
            currentIndex = (currentIndex + 1) % totalBanners;
            showBanner(currentIndex);
        };

        setInterval(nextBanner, 5000);

        const nextBtn = document.querySelector('.banner-next');
        const prevBtn = document.querySelector('.banner-prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextBanner();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + totalBanners) % totalBanners;
                showBanner(currentIndex);
            });
        }
    }

    // КНОПКИ БАННЕРОВ
    initBannerButtons() {
        document.querySelectorAll('.banner-text button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const buttonText = e.target.textContent;
                
                switch(buttonText) {
                    case 'Смотреть всё':
                        window.location.href = 'catalog.html';
                        break;
                    case 'Смотреть сериалы':
                        window.location.href = 'catalog.html?category=series';
                        break;
                    case 'Смотреть мультфильмы':
                        window.location.href = 'catalog.html?category=cartoons';
                        break;
                    case 'Смотреть фэнтези':
                        window.location.href = 'catalog.html?category=fantasy';
                        break;
                    default:
                        window.location.href = 'catalog.html';
                }
            });
        });
    }

    // КАТЕГОРИИ НА ГЛАВНОЙ
    initCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                
                categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });
    }

    // НОВОСТИ КИНО
    initNewsCards() {
        const newsCards = document.querySelectorAll('.news-card');
        
        newsCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const title = card.querySelector('h3').textContent;
                this.showNotification(`Открываем новость: ${title}`, 'info');
                
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // ФИЛЬТРАЦИЯ ПО КАТЕГОРИИ
    filterByCategory(category) {
        if (window.location.pathname.includes('catalog.html')) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = category;
                this.applyFilters();
            }
        } else {
            if (category === 'all') {
                window.location.href = 'catalog.html';
            } else {
                window.location.href = `catalog.html?category=${category}`;
            }
        }
    }

    // ЗАПОЛНЕНИЕ ФИЛЬТРА ПО ГОДАМ
    fillYearFilter() {
        const yearFilter = document.getElementById('yearFilter');
        if (!yearFilter) return;

        const currentYear = new Date().getFullYear();
        yearFilter.innerHTML = '<option value="all">Все</option>';
        
        for (let year = currentYear; year >= 1990; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        }
    }

    // ГЕНЕРАЦИЯ ТОП-10 СЛАЙДЕРА
    generateTop10Slider() {
        const top10Slider = document.getElementById('top10Slider');
        if (!top10Slider) return;

        const topMovies = this.getMoviesData()
            .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
            .slice(0, 12);

        top10Slider.innerHTML = topMovies.map((movie) => `
            <div class="movie-card" 
                 data-category="${movie.category}" 
                 data-year="${movie.year}" 
                 data-genre="${this.getGenreType(movie.genre)}" 
                 data-rating="${movie.rating}"
                 data-title="${movie.title}">
                <div class="movie-card-image">
                    <img src="${movie.image}" 
                         alt="${movie.title}"
                         onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop'"
                         loading="lazy">
                </div>
                <div class="rating">${movie.rating}</div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.genre}</p>
                    <p>${movie.year} • ${movie.ageRating}</p>
                </div>
                <div class="button-container">
                    <button class="like-btn">Добавить в избранное</button>
                    ${movie.link ? `<button class="details-btn" data-href="${movie.link}">Подробнее</button>` : ''}
                </div>
            </div>
        `).join('');

        this.initTop10SliderButtons();
        this.updateFavoritesUI();
        this.initTop10SliderAutoScroll();
    }

    // АВТОПРОКРУТКА СЛАЙДЕРА ТОП-10
    initTop10SliderAutoScroll() {
        const slider = document.getElementById('top10Slider');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        if (!slider) return;

        // Получаем все карточки
        const cards = Array.from(slider.querySelectorAll('.movie-card'));
        if (cards.length === 0) return;

        const cardWidth = 280;
        const gap = 30;
        let scrollPosition = 0;
        let animationId = null;
        let isPaused = false;
        
        // Начинаем анимацию
        const startAnimation = () => {
            if (animationId) return;
            
            const animate = () => {
                if (isPaused) {
                    animationId = requestAnimationFrame(animate);
                    return;
                }
                
                scrollPosition += 0.5;
                
                const totalWidth = cards.length * (cardWidth + gap);
                if (scrollPosition >= totalWidth) {
                    scrollPosition = 0;
                }
                
                slider.scrollLeft = scrollPosition;
                animationId = requestAnimationFrame(animate);
            };
            
            animate();
        };

        // Останавливаем анимацию
        const stopAnimation = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };

        // Ручная прокрутка
        const manualScroll = (direction) => {
            isPaused = true;
            stopAnimation();
            
            const scrollAmount = (cardWidth + gap) * 3;
            const currentScroll = slider.scrollLeft;
            let targetScroll;
            
            if (direction === 'next') {
                targetScroll = currentScroll + scrollAmount;
            } else {
                targetScroll = currentScroll - scrollAmount;
                if (targetScroll < 0) targetScroll = 0;
            }
            
            const start = currentScroll;
            const change = targetScroll - start;
            const duration = 500;
            const startTime = performance.now();
            
            const easeInOutQuad = (t) => {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            };
            
            const animateManualScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = easeInOutQuad(progress);
                
                slider.scrollLeft = start + change * easeProgress;
                
                if (progress < 1) {
                    requestAnimationFrame(animateManualScroll);
                } else {
                    setTimeout(() => {
                        isPaused = false;
                        startAnimation();
                    }, 1000);
                }
            };
            
            requestAnimationFrame(animateManualScroll);
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                manualScroll('prev');
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                manualScroll('next');
            });
        }

        slider.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        slider.addEventListener('mouseleave', () => {
            if (!isPaused) return;
            setTimeout(() => {
                isPaused = false;
            }, 1000);
        });

        setTimeout(() => {
            startAnimation();
        }, 1500);

        setTimeout(() => {
            this.initTop10SliderButtons();
        }, 100);
    }

    // КНОПКИ В СЛАЙДЕРЕ ТОП-10
    initTop10SliderButtons() {
        document.querySelectorAll('#top10Slider .details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('data-href');
                if (href) {
                    window.location.href = href;
                }
            });
        });

        document.querySelectorAll('#top10Slider .like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFavorite(btn);
            });
        });
    }

    // НОВИНКИ
    generateNewReleases() {
        const newReleasesGrid = document.getElementById('newReleasesGrid');
        if (!newReleasesGrid) return;

        const currentYear = new Date().getFullYear();
        const newMovies = this.getMoviesData()
            .filter(movie => parseInt(movie.year) >= currentYear - 1)
            .slice(0, 8);

        newReleasesGrid.innerHTML = newMovies.map(movie => this.createMovieCardHTML(movie)).join('');
        this.initHomeCardButtons('#newReleasesGrid');
    }

    // РЕКОМЕНДАЦИИ
    generateRecommended() {
        const recommendedGrid = document.getElementById('recommendedGrid');
        if (!recommendedGrid) return;

        const recommended = this.getMoviesData()
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);

        recommendedGrid.innerHTML = recommended.map(movie => this.createMovieCardHTML(movie)).join('');
        this.initHomeCardButtons('#recommendedGrid');
    }

    // HTML КАРТОЧКИ ФИЛЬМА
    createMovieCardHTML(movie) {
        return `
            <div class="movie-card" 
                 data-category="${movie.category}" 
                 data-year="${movie.year}" 
                 data-genre="${this.getGenreType(movie.genre)}" 
                 data-rating="${movie.rating}"
                 data-title="${movie.title}">
                <div class="movie-card-image">
                    <img src="${movie.image}" 
                         alt="${movie.title}"
                         onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop'"
                         loading="lazy">
                </div>
                <div class="rating">${movie.rating}</div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.genre}</p>
                    <p>${movie.year} • ${movie.ageRating}</p>
                </div>
                <div class="button-container">
                    <button class="like-btn">Добавить в избранное</button>
                    ${movie.link ? `<button class="details-btn" data-href="${movie.link}">Подробнее</button>` : ''}
                </div>
            </div>
        `;
    }

    // КНОПКИ НА КАРТОЧКАХ ГЛАВНОЙ
    initHomeCardButtons(selector) {
        document.querySelectorAll(`${selector} .details-btn`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('data-href');
                if (href) {
                    window.location.href = href;
                }
            });
        });

        document.querySelectorAll(`${selector} .like-btn`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFavorite(btn);
            });
        });
    }

    // ДАННЫЕ ФИЛЬМОВ С РЕАЛЬНЫМИ ПОСТЕРАМИ
    getMoviesData() {
        return [
            {
                title: "Большая мышь",
                genre: "Драма, Триллер",
                year: "2022",
                rating: "8.5",
                ageRating: "16+",
                image: "images/posters/w1500_55425765.png",
                category: "series",
                link: "../big-mouth/index.html"
            },
            {
                title: "Оппенгеймер",
                genre: "Биография, Драма",
                year: "2023",
                rating: "8.3",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Интерстеллар",
                genre: "Фантастика, Драма",
                year: "2014",
                rating: "8.6",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Начало",
                genre: "Боевик, Фантастика",
                year: "2010",
                rating: "8.8",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Побег из Шоушенка",
                genre: "Драма",
                year: "1994",
                rating: "9.3",
                ageRating: "16+",
                image: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Криминальное чтиво",
                genre: "Криминал, Драма",
                year: "1994",
                rating: "8.9",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Форрест Гамп",
                genre: "Драма, Романтика",
                year: "1994",
                rating: "8.8",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Зеленая миля",
                genre: "Драма, Фэнтези",
                year: "1999",
                rating: "8.6",
                ageRating: "16+",
                image: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Король Лев",
                genre: "Мультфильм, Драма",
                year: "1994",
                rating: "8.5",
                ageRating: "0+",
                image: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_FMjpg_UX1000_.jpg",
                category: "cartoons"
            },
            {
                title: "Титаник",
                genre: "Драма, Романтика",
                year: "1997",
                rating: "7.9",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Игра престолов",
                genre: "Драма, Фэнтези",
                year: "2011",
                rating: "9.2",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Во все тяжкие",
                genre: "Криминал, Драма",
                year: "2008",
                rating: "9.5",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BMTJiMzgwZTktYzZhZC00YzhhLWEzZDUtMGM2NTE4MzQ4NGFmXkEyXkFqcGdeQWpybA@@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Черное зеркало",
                genre: "Драма, Фантастика",
                year: "2011",
                rating: "8.8",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BYTM3YWVhMDMtNjczMy00NGEyLWJhZDctYjNhMTRkNDE0ZTI1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Аватар: Путь воды",
                genre: "Фантастика, Приключения",
                year: "2022",
                rating: "7.6",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Мстители: Финал",
                genre: "Боевик, Фантастика",
                year: "2019",
                rating: "8.4",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg",
                category: "movies"
            },
            {
                title: "Человек-паук: Паутина вселенных",
                genre: "Мультфильм, Боевик",
                year: "2023",
                rating: "8.6",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg",
                category: "cartoons"
            },
            {
                title: "Очень странные дела",
                genre: "Драма, Фантастика",
                year: "2016",
                rating: "8.7",
                ageRating: "16+",
                image: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Ведьмак",
                genre: "Фэнтези, Драма",
                year: "2019",
                rating: "8.2",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLTlkOGEtOTgwZmEwMzAxMzA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Ходячие мертвецы",
                genre: "Ужасы, Драма",
                year: "2010",
                rating: "8.2",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BZmU5NTcwNjktODIwMi00ZmZkLTk4ZWUtYzVjZWQ5ZTZjN2RlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Рик и Морти",
                genre: "Мультфильм, Комедия",
                year: "2013",
                rating: "9.1",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_FMjpg_UX1000_.jpg",
                category: "cartoons"
            },
            {
                title: "Симпсоны",
                genre: "Мультфильм, Комедия",
                year: "1989",
                rating: "8.7",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BYjFkMTlkYWUtZWFhNy00M2FmLThiOTYtYTRiYjVlZWYxNmJkXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_FMjpg_UX1000_.jpg",
                category: "cartoons"
            },
            {
                title: "Гравити Фолз",
                genre: "Мультфильм, Комедия",
                year: "2012",
                rating: "8.9",
                ageRating: "7+",
                image: "https://m.media-amazon.com/images/M/MV5BMTEzNDc3MDQ2NzNeQTJeQWpwZ15BbWU4MDYzMzUwMDIx._V1_FMjpg_UX1000_.jpg",
                category: "cartoons"
            },
            {
                title: "Доктор Кто",
                genre: "Фантастика, Приключения",
                year: "2005",
                rating: "8.6",
                ageRating: "12+",
                image: "https://m.media-amazon.com/images/M/MV5BZWJhYjFmZDEtNTVlYy00NGExLWJhZWItNTAxODY5YTc3MDFmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Шерлок",
                genre: "Детектив, Драма",
                year: "2010",
                rating: "9.1",
                ageRating: "16+",
                image: "https://m.media-amazon.com/images/M/MV5BMWY3NTljMjEtYzRiMi00NWM2LTkzNjItZTVmZjE0MTdjMjJhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTQ4NTc5OTU@._V1_FMjpg_UX1000_.jpg",
                category: "series"
            },
            {
                title: "Дом дракона",
                genre: "Фэнтези, Драма",
                year: "2022",
                rating: "8.5",
                ageRating: "18+",
                image: "https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktMGRkYTNhNTExY2I2XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1000_.jpg",
                category: "series"
            }
        ];
    }

    // СИСТЕМА ПОИСКА
    initSearch() {
        const searchInputs = document.querySelectorAll('#navSearchInput');
        
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(input.value.trim());
                }
            });

            input.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query);
                } else if (query.length === 0) {
                    this.clearSearch();
                }
            });
        });
    }

    // ВЫПОЛНЕНИЕ ПОИСКА
    performSearch(query) {
        if (!query) {
            this.clearSearch();
            return;
        }

        const movieCards = document.querySelectorAll('.movie-card');
        let found = false;

        movieCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const genre = card.querySelector('p')?.textContent.toLowerCase() || '';

            if (title.includes(query.toLowerCase()) || genre.includes(query.toLowerCase())) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (found) {
            this.showNotification(`Найдено по запросу: "${query}"`, 'success');
        } else {
            this.showNotification(`Ничего не найдено: "${query}"`, 'error');
        }
    }

    // ОЧИСТКА ПОИСКА
    clearSearch() {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.style.display = 'block';
        });
    }

    // ФИЛЬТРЫ КАТАЛОГА
    initFilters() {
        const filters = ['categoryFilter', 'yearFilter', 'genreFilter', 'ratingFilter'];
        
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });

        this.handleUrlParams();
    }

    // ОБРАБОТКА ПАРАМЕТРОВ URL
    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && document.getElementById('categoryFilter')) {
            document.getElementById('categoryFilter').value = category;
            setTimeout(() => {
                this.applyFilters();
            }, 100);
        }
    }

    // ПРИМЕНЕНИЕ ФИЛЬТРОВ
    applyFilters() {
        const category = document.getElementById('categoryFilter')?.value || 'all';
        const year = document.getElementById('yearFilter')?.value || 'all';
        const genre = document.getElementById('genreFilter')?.value || 'all';
        const rating = document.getElementById('ratingFilter')?.value || 'all';

        const movieCards = document.querySelectorAll('.movie-card');
        let visibleCount = 0;

        movieCards.forEach(card => {
            const cardCategory = card.dataset.category || '';
            const cardYear = card.dataset.year || '';
            const cardGenre = card.dataset.genre || '';
            const cardRating = parseFloat(card.dataset.rating) || 0;

            const showCard =
                (category === 'all' || cardCategory === category) &&
                (year === 'all' || cardYear === year) &&
                (genre === 'all' || cardGenre === genre) &&
                (rating === 'all' || cardRating >= parseFloat(rating));

            card.style.display = showCard ? 'block' : 'none';
            if (showCard) visibleCount++;
        });

        if (visibleCount === 0) {
            this.showNotification('Ничего не найдено по выбранным фильтрам', 'info');
        }
    }

    // СИСТЕМА ИЗБРАННОГО
    initFavorites() {
        // Инициализация обработчиков для всех кнопок избранного
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('like-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFavorite(e.target);
            }
        });

        this.updateFavoritesUI();
    }

    // ПЕРЕКЛЮЧЕНИЕ ИЗБРАННОГО
    toggleFavorite(button) {
        // Проверяем авторизацию
        const currentUser = JSON.parse(localStorage.getItem('kinosite-current-user'));
        if (!currentUser) {
            this.showNotification('Для добавления в избранное необходимо войти в систему', 'error');
            this.showLoginModal();
            return;
        }

        const card = button.closest('.movie-card');
        if (!card) return;
        
        const title = card.dataset.title || card.querySelector('h3').textContent;
        const cardId = card.dataset.title || title;

        // Получаем данные пользователя
        const users = JSON.parse(localStorage.getItem('kinosite-users')) || [];
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        
        if (userIndex === -1) {
            this.showNotification('Ошибка пользователя', 'error');
            return;
        }

        let favorites = users[userIndex].favorites || [];

        if (favorites.includes(cardId)) {
            // Удаляем из избранного
            favorites = favorites.filter(item => item !== cardId);
            button.classList.remove('liked');
            button.textContent = 'Добавить в избранное';
            this.showNotification(`Удалено из избранного: ${title}`, 'info');
            
            // Если находимся на странице избранного, удаляем карточку
            if (window.location.pathname.includes('favorite.html')) {
                card.style.opacity = '0.5';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.remove();
                    this.displayFavoritesPage(); // Обновляем отображение
                }, 300);
            }
        } else {
            // Добавляем в избранное
            favorites.push(cardId);
            button.classList.add('liked');
            button.textContent = 'В избранном';
            this.showNotification(`Добавлено в избранное: ${title}`, 'success');
        }

        // Обновляем данные пользователя
        users[userIndex].favorites = favorites;
        localStorage.setItem('kinosite-users', JSON.stringify(users));
        this.updateFavoritesUI();
    }

    // ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ИЗБРАННОГО
    updateFavoritesUI() {
        const currentUser = JSON.parse(localStorage.getItem('kinosite-current-user'));
        let favorites = [];

        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('kinosite-users')) || [];
            const user = users.find(user => user.id === currentUser.id);
            favorites = user ? user.favorites || [] : [];
        }

        // Обновляем все карточки на странице
        document.querySelectorAll('.movie-card').forEach(card => {
            const title = card.dataset.title || card.querySelector('h3').textContent;
            const button = card.querySelector('.like-btn');

            if (button && favorites.includes(title)) {
                button.classList.add('liked');
                button.textContent = 'В избранном';
            } else if (button) {
                button.classList.remove('liked');
                button.textContent = 'Добавить в избранное';
            }
        });

        // Если находимся на странице избранного, обновляем её
        if (window.location.pathname.includes('favorite.html')) {
            this.displayFavoritesPage();
        }
    }

    // ПОКАЗ СТРАНИЦЫ ИЗБРАННОГО
    displayFavoritesPage() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const emptyFavorites = document.getElementById('emptyFavorites');
        const currentUser = JSON.parse(localStorage.getItem('kinosite-current-user'));

        if (!favoritesGrid) return;

        if (!currentUser) {
            // Если пользователь не авторизован, показываем сообщение
            favoritesGrid.style.display = 'none';
            if (emptyFavorites) {
                emptyFavorites.style.display = 'block';
                emptyFavorites.innerHTML = `
                    <div class="empty-state">
                        <h3>Войдите в систему</h3>
                        <p>Для просмотра избранного необходимо войти в систему</p>
                        <button class="auth-btn" id="loginFromFavorites">Войти</button>
                    </div>
                `;
                
                // Добавляем обработчик для кнопки входа
                document.getElementById('loginFromFavorites')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLoginModal();
                });
            }
            return;
        }

        const users = JSON.parse(localStorage.getItem('kinosite-users')) || [];
        const user = users.find(user => user.id === currentUser.id);
        const favorites = user ? user.favorites || [] : [];

        if (favorites.length === 0) {
            favoritesGrid.style.display = 'none';
            if (emptyFavorites) {
                emptyFavorites.style.display = 'block';
                emptyFavorites.innerHTML = `
                    <div class="empty-state">
                        <h3>Избранное пусто</h3>
                        <p>Добавьте фильмы или сериалы в избранное, чтобы они появились здесь</p>
                        <button class="auth-btn" onclick="location.href='catalog.html'">Перейти в каталог</button>
                    </div>
                `;
            }
        } else {
            favoritesGrid.style.display = 'grid';
            if (emptyFavorites) emptyFavorites.style.display = 'none';
            favoritesGrid.innerHTML = '';

            const allMovies = this.getMoviesData();
            
            favorites.forEach(title => {
                const movieData = allMovies.find(movie => movie.title === title);
                if (movieData) {
                    const card = this.createFavoriteCard(movieData);
                    favoritesGrid.appendChild(card);
                }
            });
            
            setTimeout(() => this.optimizeMoviePosters(), 300);
        }
    }

    // СОЗДАНИЕ КАРТОЧКИ ИЗБРАННОГО
    createFavoriteCard(movieData) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.title = movieData.title;
        
        card.innerHTML = `
            <div class="movie-card-image">
                <img src="${movieData.image}" 
                     alt="${movieData.title}"
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop'"
                     loading="lazy">
            </div>
            <div class="rating">${movieData.rating}</div>
            <div class="movie-info">
                <h3>${movieData.title}</h3>
                <p>${movieData.genre}</p>
                <p>${movieData.year} • ${movieData.ageRating}</p>
            </div>
            <div class="button-container">
                <button class="like-btn liked">Удалить из избранного</button>
                ${movieData.link ? `<button class="details-btn" data-href="${movieData.link}">Подробнее</button>` : ''}
            </div>
        `;

        const likeBtn = card.querySelector('.like-btn');
        const detailsBtn = card.querySelector('.details-btn');

        likeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleFavorite(likeBtn);
        });

        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = detailsBtn.getAttribute('data-href');
            });
        }

        return card;
    }

    // СИСТЕМА СОРТИРОВКИ
    initSorting() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.sortMovies(e.target.dataset.sort);
            });
        });
    }

    // СОРТИРОВКА ФИЛЬМОВ
    sortMovies(sortType) {
        const grid = document.getElementById('catalogGrid');
        if (!grid) return;

        const cards = Array.from(grid.querySelectorAll('.movie-card'));

        cards.sort((a, b) => {
            switch(sortType) {
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'year':
                    return parseInt(b.dataset.year) - parseInt(a.dataset.year);
                case 'new':
                    return parseInt(b.dataset.year) - parseInt(a.dataset.year);
                case 'popular':
                default:
                    return 0;
            }
        });

        grid.innerHTML = '';
        cards.forEach(card => grid.appendChild(card));
        this.updateFavoritesUI(); // Обновляем состояние кнопок после сортировки
    }

    // ГЕНЕРАЦИЯ КАТАЛОГА
    generateCatalog() {
        const catalogGrid = document.getElementById('catalogGrid');
        if (!catalogGrid) return;

        const movies = this.getMoviesData();
        
        catalogGrid.innerHTML = movies.map(movie => `
            <div class="movie-card" 
                 data-category="${movie.category}" 
                 data-year="${movie.year}" 
                 data-genre="${this.getGenreType(movie.genre)}" 
                 data-rating="${movie.rating}"
                 data-title="${movie.title}">
                <div class="movie-card-image">
                    <img src="${movie.image}" 
                         alt="${movie.title}"
                         onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop'"
                         loading="lazy">
                </div>
                <div class="rating">${movie.rating}</div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.genre}</p>
                    <p>${movie.year} • ${movie.ageRating}</p>
                </div>
                <div class="button-container">
                    <button class="like-btn">Добавить в избранное</button>
                    ${movie.link ? `<button class="details-btn" data-href="${movie.link}">Подробнее</button>` : ''}
                </div>
            </div>
        `).join('');

        this.initCatalogButtons();
        this.updateFavoritesUI();
    }

    // КНОПКИ В КАТАЛОГЕ
    initCatalogButtons() {
        document.querySelectorAll('#catalogGrid .details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('data-href');
                if (href) {
                    window.location.href = href;
                }
            });
        });

        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showNotification(`Переход на страницу ${btn.textContent}`, 'info');
            });
        });

        document.querySelector('.next-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showNotification('Загрузка следующей страницы...', 'info');
        });
    }

    // ПОЛУЧЕНИЕ ТИПА ЖАНРА ДЛЯ ФИЛЬТРА
    getGenreType(genre) {
        if (genre.toLowerCase().includes('драма')) return 'drama';
        if (genre.toLowerCase().includes('комедия')) return 'comedy';
        if (genre.toLowerCase().includes('фантастика') || genre.toLowerCase().includes('фэнтези')) return 'fantasy';
        if (genre.toLowerCase().includes('боевик')) return 'action';
        if (genre.toLowerCase().includes('триллер')) return 'thriller';
        if (genre.toLowerCase().includes('романтика')) return 'romance';
        if (genre.toLowerCase().includes('ужасы')) return 'horror';
        if (genre.toLowerCase().includes('детектив')) return 'detective';
        if (genre.toLowerCase().includes('криминал')) return 'crime';
        if (genre.toLowerCase().includes('приключения')) return 'adventure';
        if (genre.toLowerCase().includes('аниме') || genre.toLowerCase().includes('мультфильм')) return 'cartoons';
        if (genre.toLowerCase().includes('семейный')) return 'family';
        if (genre.toLowerCase().includes('биография')) return 'biography';
        if (genre.toLowerCase().includes('мюзикл')) return 'musical';
        return 'drama';
    }

    // СИСТЕМА УВЕДОМЛЕНИЙ
    showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span>${message}</span>`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ==================== ЗАПУСК ПРИЛОЖЕНИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    window.kinosite = new Kinosite();
});
/**
 * ДотКит.ме - Многофункциональный сайт для пожилых людей
 * Основной JavaScript файл с функциональностью
 * Версия 2.0 - с надежной обработкой ошибок и защитой от зависаний
 */

// --------------------------------
// КОНСТАНТЫ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// --------------------------------
// API ключ для OpenWeatherMap (бесплатный тариф)
const OPENWEATHER_API_KEY = '6a73686dc1863a1701641d2fd9f963a5';

// Константы для таймаутов и повторов
const PRELOADER_TIMEOUT = 5000; // 5 секунд максимум для прелоадера
const API_TIMEOUT = 10000; // 10 секунд максимум для API запросов
const MAX_RETRIES = 2; // Максимальное количество повторных запросов к API

// YouTube API будет инициализирован автоматически (YouTube iframe API)
let youtubePlayer;

// Переменные для игр
let memoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    timer: null,
    seconds: 0
};

// Объект для хранения истории просмотров
let viewHistory = {
    movies: [],
    recipes: [],
    games: []
};

// Объект для хранения статистики
let stats = {
    moviesWatched: 0,
    weatherChecks: 0,
    recipesViewed: 0,
    gamesPlayed: 0
};

// Текущее местоположение пользователя
let userLocation = {
    city: null,
    country: null,
    coords: {
        latitude: null,
        longitude: null
    }
};

// Данные о погоде (для кэширования)
let weatherCache = {
    current: null,
    forecast: null,
    hourly: null,
    timestamp: null,
    // Время жизни кэша - 30 минут
    expirationTime: 30 * 60 * 1000
};

// Таймер для прелоадера
let preloaderTimer = null;

// --------------------------------
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// --------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('ДотКит.ме загружается...');
    
    // Устанавливаем таймер безопасности для прелоадера
    preloaderTimer = setTimeout(() => {
        hidePreloader();
        showNotification('Данные о погоде могут быть недоступны или устарели', 'warning');
    }, PRELOADER_TIMEOUT);
    
    try {
        // Проверяем, первый ли это визит пользователя
        checkFirstVisit();
        
        // Загружаем данные пользователя из localStorage
        loadUserData();
        
        // Получаем местоположение пользователя
        getUserLocation();
        
        // Обновляем текущее время
        updateTime();
        setInterval(updateTime, 60000); // Обновляем каждую минуту
        
        // Заполняем контент для всех разделов
        populateMovies();
        populateRecipes();
        
        // Устанавливаем обработчики событий для фильтрации
        setupEventListeners();
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
        // Скрываем прелоадер даже при ошибке
        hidePreloader();
        showNotification('Произошла ошибка при загрузке сайта', 'error');
    }
});

/**
 * Скрывает прелоадер с анимацией исчезновения
 */
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // Очищаем таймер безопасности, если он есть
    if (preloaderTimer) {
        clearTimeout(preloaderTimer);
        preloaderTimer = null;
    }
    
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        // Показываем панель состояния, если она существует
        const statusBar = document.getElementById('status-bar');
        if (statusBar) statusBar.classList.remove('hidden');
    }, 500);
}

// --------------------------------
// ФУНКЦИИ УПРАВЛЕНИЯ ИНТЕРФЕЙСОМ
// --------------------------------

/**
 * Переключение между разделами сайта
 * @param {string} sectionId - ID раздела, который нужно показать
 */
function showSection(sectionId) {
    try {
        // Проверяем, существует ли целевой раздел
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`Раздел с ID ${sectionId} не найден`);
            return;
        }
        
        // Скрываем все разделы
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем нужный раздел
        targetSection.classList.add('active');
        
        // Обновляем данные для определенных разделов
        if (sectionId === 'weather-section') {
            // Показываем прелоадер для раздела погоды
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.remove('hidden', 'fade-out');
                document.getElementById('preloader').querySelector('.loading-detail').textContent = 'Обновление данных о погоде';
                
                // Устанавливаем таймер безопасности
                preloaderTimer = setTimeout(() => {
                    hidePreloader();
                    showNotification('Не удалось обновить данные о погоде', 'warning');
                }, PRELOADER_TIMEOUT);
            }
            
            // Проверяем, нужно ли обновлять данные о погоде
            const needUpdate = !weatherCache.timestamp || 
                (Date.now() - weatherCache.timestamp > weatherCache.expirationTime);
            
            if (needUpdate) {
                getWeatherData();
            } else {
                // Используем закешированные данные
                if (weatherCache.current) updateUIWithWeatherData();
                hidePreloader();
            }
            
            stats.weatherChecks++;
            saveStats();
        } else if (sectionId === 'admin-section') {
            updateAdminPanel();
        }
        
        // Прокручиваем страницу вверх
        window.scrollTo(0, 0);
        
        // Добавляем в историю
        addToViewHistory(sectionId);
    } catch (error) {
        console.error('Ошибка при переключении раздела:', error);
        showNotification('Ошибка при переключении раздела', 'error');
    }
}

/**
 * Проверяет, первый ли это визит пользователя
 */
function checkFirstVisit() {
    try {
        const visited = localStorage.getItem('visited');
        
        if (!visited) {
            // Если первый визит - показываем модальное окно для ввода имени
            setTimeout(() => {
                showModal('name-modal');
            }, 3000);
            
            localStorage.setItem('visited', 'true');
        }
    } catch (error) {
        console.error('Ошибка при проверке первого визита:', error);
        // Не критичная ошибка, можно продолжить работу
    }
}

/**
 * Показывает модальное окно
 * @param {string} modalId - ID модального окна
 */
function showModal(modalId) {
    try {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    } catch (error) {
        console.error('Ошибка при показе модального окна:', error);
    }
}

/**
 * Закрывает модальное окно
 */
function closeModal() {
    try {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    } catch (error) {
        console.error('Ошибка при закрытии модального окна:', error);
    }
}

/**
 * Сохраняет имя пользователя
 */
function saveName() {
    try {
        const nameInput = document.getElementById('user-name-input');
        if (!nameInput) return;
        
        let userName = nameInput.value.trim();
        
        if (userName === '') {
            userName = 'Гость';
        }
        
        // Сохраняем имя в localStorage
        localStorage.setItem('userName', userName);
        
        // Обновляем интерфейс
        const userDisplayName = document.getElementById('user-display-name');
        if (userDisplayName) userDisplayName.textContent = userName;
        
        const navUserName = document.getElementById('nav-user-name');
        if (navUserName) navUserName.textContent = userName;
        
        // Показываем уведомление
        showNotification(`Здравствуйте, ${userName}!`);
        
        // Закрываем модальное окно
        closeModal();
    } catch (error) {
        console.error('Ошибка при сохранении имени:', error);
        showNotification('Не удалось сохранить имя', 'error');
    }
}

/**
 * Показывает уведомление
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления ('info', 'success', 'warning', 'error')
 * @param {number} duration - Длительность показа в миллисекундах (по умолчанию 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    try {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const notificationIcon = document.getElementById('notification-icon');
        const notificationTitle = document.getElementById('notification-title');
        
        if (!notification || !notificationMessage) return;
        
        // Установка иконки и заголовка в зависимости от типа
        if (notificationIcon && notificationTitle) {
            switch (type) {
                case 'error':
                    notificationIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                    notificationTitle.textContent = 'Ошибка';
                    notification.className = 'notification error active';
                    break;
                case 'warning':
                    notificationIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                    notificationTitle.textContent = 'Предупреждение';
                    notification.className = 'notification warning active';
                    break;
                case 'success':
                    notificationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                    notificationTitle.textContent = 'Успешно';
                    notification.className = 'notification success active';
                    break;
                default:
                    notificationIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
                    notificationTitle.textContent = 'Информация';
                    notification.className = 'notification info active';
            }
        } else {
            notification.classList.add('active');
        }
        
        notificationMessage.textContent = message;
        
        // Автоматически скрываем уведомление через указанное время
        setTimeout(() => {
            notification.classList.remove('active');
        }, duration);
    } catch (error) {
        console.error('Ошибка при показе уведомления:', error);
    }
}

/**
 * Закрывает уведомление
 */
function closeNotification() {
    try {
        const notification = document.getElementById('notification');
        if (notification) notification.classList.remove('active');
    } catch (error) {
        console.error('Ошибка при закрытии уведомления:', error);
    }
}

/**
 * Обновляет текущее время на странице
 */
function updateTime() {
    try {
        const timeDisplay = document.getElementById('current-time');
        if (!timeDisplay) return;
        
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit' };
        
        timeDisplay.textContent = now.toLocaleTimeString('ru-RU', options);
    } catch (error) {
        console.error('Ошибка при обновлении времени:', error);
    }
}

/**
 * Устанавливает обработчики событий
 */
function setupEventListeners() {
    try {
        // Обработчик для фильтрации рецептов по категории
        const categoryButtons = document.querySelectorAll('.category-btn, .category-tab');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок того же типа
                document.querySelectorAll(button.classList.contains('category-btn') ? '.category-btn' : '.category-tab')
                    .forEach(btn => btn.classList.remove('active'));
                
                // Добавляем активный класс выбранной кнопке
                button.classList.add('active');
                
                // Фильтруем рецепты
                const category = button.dataset.category;
                filterRecipesByCategory(category);
            });
        });
        
        // Обработчик для кнопок карусели "Недавно просмотренные"
        const prevBtn = document.getElementById('recent-prev');
        const nextBtn = document.getElementById('recent-next');
        const recentList = document.getElementById('recently-viewed-list');
        
        if (prevBtn && recentList) {
            prevBtn.addEventListener('click', () => {
                recentList.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }
        
        if (nextBtn && recentList) {
            nextBtn.addEventListener('click', () => {
                recentList.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
        
    } catch (error) {
        console.error('Ошибка при настройке обработчиков событий:', error);
    }
}

// --------------------------------
// ФУНКЦИИ РАБОТЫ С ДАННЫМИ ПОЛЬЗОВАТЕЛЯ
// --------------------------------

/**
 * Загружает данные пользователя из localStorage
 */
function loadUserData() {
    try {
        // Загружаем имя пользователя
        const userName = localStorage.getItem('userName') || 'Гость';
        
        // Обновляем имя в разных частях интерфейса
        const userDisplayName = document.getElementById('user-display-name');
        if (userDisplayName) userDisplayName.textContent = userName;
        
        const navUserName = document.getElementById('nav-user-name');
        if (navUserName) navUserName.textContent = userName;
        
        const welcomeName = document.getElementById('user-name');
        if (welcomeName) welcomeName.textContent = userName;
        
        // Устанавливаем приветственное сообщение в зависимости от времени суток
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            const hour = new Date().getHours();
            let greeting;
            
            if (hour >= 5 && hour < 12) {
                greeting = 'Доброе утро! Что бы вы хотели сделать сегодня?';
            } else if (hour >= 12 && hour < 18) {
                greeting = 'Добрый день! Чем могу помочь сегодня?';
            } else if (hour >= 18 && hour < 23) {
                greeting = 'Добрый вечер! Выберите любой раздел ниже.';
            } else {
                greeting = 'Доброй ночи! Что бы вы хотели посмотреть?';
            }
            
            welcomeMessage.textContent = greeting;
        }
        
        // Загружаем историю просмотров
        const savedHistory = localStorage.getItem('viewHistory');
        if (savedHistory) {
            viewHistory = JSON.parse(savedHistory);
        }
        
        // Загружаем статистику
        const savedStats = localStorage.getItem('userStats');
        if (savedStats) {
            stats = JSON.parse(savedStats);
            updateStatsDisplay();
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
    }
}

/**
 * Сохраняет статистику пользователя
 */
function saveStats() {
    try {
        localStorage.setItem('userStats', JSON.stringify(stats));
        updateStatsDisplay();
    } catch (error) {
        console.error('Ошибка при сохранении статистики:', error);
    }
}

/**
 * Обновляет отображение статистики
 */
function updateStatsDisplay() {
    try {
        // Обновляем счетчики статистики, если они существуют
        const elements = {
            'movies-watched': stats.moviesWatched,
            'weather-checks': stats.weatherChecks,
            'recipes-viewed': stats.recipesViewed,
            'games-played': stats.gamesPlayed
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        }
    } catch (error) {
        console.error('Ошибка при обновлении отображения статистики:', error);
    }
}

/**
 * Добавляет запись в историю просмотров
 * @param {string} sectionId - ID просмотренного раздела
 */
function addToViewHistory(sectionId) {
    try {
        // Игнорируем админ-панель
        if (sectionId === 'admin-section') return;
        
        const now = new Date();
        const historyItem = {
            timestamp: now.getTime(),
            date: now.toLocaleString('ru-RU'),
            section: sectionId
        };
        
        // Добавляем в соответствующий раздел истории
        if (sectionId === 'movies-section') {
            viewHistory.movies.push(historyItem);
        } else if (sectionId === 'weather-section') {
            viewHistory.weather = historyItem; // Храним только последнюю проверку погоды
        } else if (sectionId === 'recipes-section') {
            viewHistory.recipes.push(historyItem);
        } else if (sectionId === 'games-section') {
            viewHistory.games.push(historyItem);
        }
        
        // Обрезаем историю до последних 10 записей для каждого типа
        if (viewHistory.movies.length > 10) {
            viewHistory.movies = viewHistory.movies.slice(-10);
        }
        if (viewHistory.recipes.length > 10) {
            viewHistory.recipes = viewHistory.recipes.slice(-10);
        }
        if (viewHistory.games.length > 10) {
            viewHistory.games = viewHistory.games.slice(-10);
        }
        
        // Сохраняем историю в localStorage
        localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
        
        // Обновляем историю просмотров в админ-панели
        updateHistoryList();
    } catch (error) {
        console.error('Ошибка при добавлении записи в историю:', error);
    }
}

/**
 * Обновляет список истории просмотров
 */
function updateHistoryList() {
    try {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
        // Очищаем список
        historyList.innerHTML = '';
        
        // Создаем массив всех записей истории
        let allHistory = [
            ...viewHistory.movies.map(item => ({ ...item, type: 'movie', icon: '🎬' })),
            ...viewHistory.recipes.map(item => ({ ...item, type: 'recipe', icon: '🍳' })),
            ...viewHistory.games.map(item => ({ ...item, type: 'game', icon: '🎮' }))
        ];
        
        // Добавляем последнюю проверку погоды, если есть
        if (viewHistory.weather) {
            allHistory.push({ ...viewHistory.weather, type: 'weather', icon: '☁️' });
        }
        
        // Сортируем по времени (от новых к старым)
        allHistory.sort((a, b) => b.timestamp - a.timestamp);
        
        // Ограничиваем до 15 последних записей
        allHistory = allHistory.slice(0, 15);
        
        // Если история пуста
        if (allHistory.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-history');
            emptyMessage.textContent = 'История просмотров пуста';
            historyList.appendChild(emptyMessage);
            return;
        }
        
        // Добавляем записи в список
        allHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            
            // Определяем название раздела
            let sectionName = '';
            switch (item.section) {
                case 'movies-section':
                    sectionName = 'Фильмы';
                    break;
                case 'weather-section':
                    sectionName = 'Погода';
                    break;
                case 'recipes-section':
                    sectionName = 'Рецепты';
                    break;
                case 'games-section':
                    sectionName = 'Игры';
                    break;
                default:
                    sectionName = 'Главная';
            }
            
            historyItem.innerHTML = `
                <div class="history-content">
                    <div class="history-icon">${item.icon}</div>
                    <div>
                        <div class="history-title">Просмотр раздела "${sectionName}"</div>
                        <div class="history-time">${item.date}</div>
                    </div>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
    } catch (error) {
        console.error('Ошибка при обновлении списка истории:', error);
    }
}

/**
 * Очищает историю просмотров
 */
function clearHistory() {
    try {
        // Сбрасываем историю
        viewHistory = {
            movies: [],
            recipes: [],
            games: []
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
        
        // Обновляем отображение
        updateHistoryList();
        
        // Показываем уведомление
        showNotification('История просмотров очищена', 'success');
    } catch (error) {
        console.error('Ошибка при очистке истории:', error);
        showNotification('Не удалось очистить историю', 'error');
    }
}

/**
 * Обновляет информацию в админ-панели
 */
function updateAdminPanel() {
    try {
        // Обновляем статистику
        updateStatsDisplay();
        
        // Обновляем историю просмотров
        updateHistoryList();
        
        // Получаем IP пользователя с таймаутом
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        fetch('https://api.ipify.org?format=json', { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error('Ошибка при получении IP');
                }
                return response.json();
            })
            .then(data => {
                const userIp = document.getElementById('user-ip');
                if (userIp) userIp.textContent = `IP: ${data.ip}`;
            })
            .catch(error => {
                console.error('Ошибка при получении IP:', error);
                const userIp = document.getElementById('user-ip');
                if (userIp) userIp.textContent = 'IP: недоступен';
            });
    } catch (error) {
        console.error('Ошибка при обновлении админ-панели:', error);
    }
}

// --------------------------------
// ФУНКЦИИ ПОЛУЧЕНИЯ МЕСТОПОЛОЖЕНИЯ
// --------------------------------

/**
 * Получает местоположение пользователя
 */
function getUserLocation() {
    try {
        // Проверяем, сохранено ли местоположение
        const savedLocation = localStorage.getItem('userLocation');
        
        if (savedLocation) {
            userLocation = JSON.parse(savedLocation);
            getWeatherData();
            return;
        }
        
        // Пытаемся получить местоположение через Geolocation API с таймаутом
        if (navigator.geolocation) {
            const locationTimeout = setTimeout(() => {
                console.log('Таймаут определения местоположения, используем IP');
                getLocationFromIP();
            }, API_TIMEOUT);
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    clearTimeout(locationTimeout);
                    userLocation.coords.latitude = position.coords.latitude;
                    userLocation.coords.longitude = position.coords.longitude;
                    
                    // Получаем название города по координатам
                    getCityFromCoords();
                },
                error => {
                    clearTimeout(locationTimeout);
                    console.error('Ошибка Geolocation:', error);
                    // Используем IP для определения местоположения
                    getLocationFromIP();
                },
                { timeout: API_TIMEOUT - 1000 }
            );
        } else {
            console.error('Geolocation не поддерживается в этом браузере');
            // Используем IP для определения местоположения
            getLocationFromIP();
        }
    } catch (error) {
        console.error('Ошибка при получении местоположения:', error);
        // Используем данные по умолчанию
        setDefaultLocation();
    }
}

/**
 * Получает название города по координатам
 */
function getCityFromCoords() {
    try {
        const { latitude, longitude } = userLocation.coords;
        if (!latitude || !longitude) {
            throw new Error('Координаты не определены');
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`, 
              { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`Ошибка при получении города: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    userLocation.city = data[0].name || 'Неизвестный город';
                    userLocation.country = data[0].country || 'Неизвестная страна';
                    
                    // Сохраняем местоположение
                    localStorage.setItem('userLocation', JSON.stringify(userLocation));
                    
                    // Обновляем отображение местоположения
                    updateLocationDisplay();
                    
                    // Получаем данные о погоде
                    getWeatherData();
                } else {
                    throw new Error('Пустой ответ API местоположения');
                }
            })
            .catch(error => {
                console.error('Ошибка при получении города:', error);
                getLocationFromIP();
            });
    } catch (error) {
        console.error('Ошибка в getCityFromCoords:', error);
        getLocationFromIP();
    }
}

/**
 * Получает местоположение по IP
 */
function getLocationFromIP() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        fetch('https://ipapi.co/json/', { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`Ошибка при получении местоположения по IP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                userLocation.city = data.city || 'Неизвестный город';
                userLocation.country = data.country_name || 'Неизвестная страна';
                userLocation.coords.latitude = data.latitude || 55.7558; // Москва по умолчанию
                userLocation.coords.longitude = data.longitude || 37.6173;
                
                // Сохраняем местоположение
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
                
                // Обновляем отображение местоположения
                updateLocationDisplay();
                
                // Получаем данные о погоде
                getWeatherData();
            })
            .catch(error => {
                console.error('Ошибка при получении местоположения по IP:', error);
                setDefaultLocation();
            });
    } catch (error) {
        console.error('Ошибка в getLocationFromIP:', error);
        setDefaultLocation();
    }
}

/**
 * Устанавливает местоположение по умолчанию (Москва)
 */
function setDefaultLocation() {
    try {
        userLocation.city = 'Москва';
        userLocation.country = 'Россия';
        userLocation.coords.latitude = 55.7558;
        userLocation.coords.longitude = 37.6173;
        
        // Сохраняем местоположение
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
        
        // Обновляем отображение местоположения
        updateLocationDisplay();
        
        // Получаем данные о погоде
        getWeatherData();
        
        showNotification('Использовано местоположение по умолчанию: Москва', 'info');
    } catch (error) {
        console.error('Ошибка при установке местоположения по умолчанию:', error);
        hidePreloader(); // В любом случае скрываем прелоадер
    }
}

/**
 * Обновляет отображение местоположения на странице
 */
function updateLocationDisplay() {
    try {
        const locationElement = document.getElementById('current-location');
        if (locationElement) {
            locationElement.textContent = userLocation.city;
        }
        
        // Если есть другие элементы с информацией о местоположении, обновляем их здесь
    } catch (error) {
        console.error('Ошибка при обновлении отображения местоположения:', error);
    }
}

// --------------------------------
// ФУНКЦИИ РАБОТЫ С ПОГОДОЙ
// --------------------------------

/**
 * Получает данные о погоде
 * @param {number} retryCount - Счетчик повторных попыток
 */
function getWeatherData(retryCount = 0) {
    try {
        if (!userLocation.coords.latitude || !userLocation.coords.longitude) {
            console.error('Координаты не определены');
            hidePreloader();
            showNotification('Невозможно определить местоположение', 'error');
            return;
        }
        
        const { latitude, longitude } = userLocation.coords;
        
        // Запускаем получение данных параллельно
        Promise.all([
            getCurrentWeather(latitude, longitude, retryCount),
            getWeatherForecast(latitude, longitude, retryCount),
            getHourlyForecast(latitude, longitude, retryCount)
        ])
        .then(() => {
            // Обновляем временную метку кэша
            weatherCache.timestamp = Date.now();
            
            // Скрываем прелоадер
            hidePreloader();
        })
        .catch(error => {
            console.error('Ошибка при получении данных о погоде:', error);
            
            // Если у нас есть кэш, используем его
            if (weatherCache.current) {
                updateUIWithWeatherData();
                showNotification('Используются сохраненные данные о погоде', 'warning');
            } else {
                showNotification('Не удалось получить данные о погоде', 'error');
            }
            
            hidePreloader();
        });
    } catch (error) {
        console.error('Ошибка в getWeatherData:', error);
        hidePreloader();
        showNotification('Ошибка при получении данных о погоде', 'error');
    }
}

/**
 * Обновляет все элементы интерфейса закешированными данными о погоде
 */
function updateUIWithWeatherData() {
    try {
        if (weatherCache.current) {
            updateMainWeatherWidget(weatherCache.current);
            updateDetailedWeather(weatherCache.current);
            updateStatusBar(weatherCache.current);
            updateWeatherRecommendations(weatherCache.current);
        }
        
        if (weatherCache.forecast) {
            updateForecast(weatherCache.forecast);
        }
        
        if (weatherCache.hourly) {
            updateHourlyForecast(weatherCache.hourly);
        }
    } catch (error) {
        console.error('Ошибка при обновлении интерфейса сохраненными данными:', error);
    }
}

/**
 * Получает текущую погоду
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 * @param {number} retryCount - Счетчик повторных попыток
 * @returns {Promise} - Promise с результатом запроса
 */
function getCurrentWeather(lat, lon, retryCount = 0) {
    return new Promise((resolve, reject) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
            
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${OPENWEATHER_API_KEY}`, 
                  { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Текущая погода:', data);
                    
                    // Кэшируем данные
                    weatherCache.current = data;
                    
                    // Обновляем виджет погоды на главной странице
                    updateMainWeatherWidget(data);
                    
                    // Обновляем детальную информацию о погоде
                    updateDetailedWeather(data);
                    
                    // Обновляем строку состояния
                    updateStatusBar(data);
                    
                    // Обновляем рекомендации по погоде
                    updateWeatherRecommendations(data);
                    
                    resolve(data);
                })
                .catch(error => {
                    console.error('Ошибка при получении текущей погоды:', error);
                    
                    // Пытаемся повторить запрос при ошибке
                    if (retryCount < MAX_RETRIES) {
                        console.log(`Повторная попытка ${retryCount + 1}/${MAX_RETRIES}...`);
                        setTimeout(() => {
                            getCurrentWeather(lat, lon, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 1000);
                    } else {
                        reject(error);
                    }
                });
        } catch (error) {
            console.error('Ошибка в getCurrentWeather:', error);
            reject(error);
        }
    });
}

/**
 * Получает прогноз погоды на 5 дней
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 * @param {number} retryCount - Счетчик повторных попыток
 * @returns {Promise} - Promise с результатом запроса
 */
function getWeatherForecast(lat, lon, retryCount = 0) {
    return new Promise((resolve, reject) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
            
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${OPENWEATHER_API_KEY}`, 
                  { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Прогноз погоды:', data);
                    
                    // Кэшируем данные
                    weatherCache.forecast = data;
                    
                    // Обновляем прогноз на 5 дней
                    updateForecast(data);
                    
                    resolve(data);
                })
                .catch(error => {
                    console.error('Ошибка при получении прогноза погоды:', error);
                    
                    // Пытаемся повторить запрос при ошибке
                    if (retryCount < MAX_RETRIES) {
                        console.log(`Повторная попытка ${retryCount + 1}/${MAX_RETRIES}...`);
                        setTimeout(() => {
                            getWeatherForecast(lat, lon, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 1000);
                    } else {
                        reject(error);
                    }
                });
        } catch (error) {
            console.error('Ошибка в getWeatherForecast:', error);
            reject(error);
        }
    });
}

/**
 * Получает почасовой прогноз погоды
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 * @param {number} retryCount - Счетчик повторных попыток
 * @returns {Promise} - Promise с результатом запроса
 */
function getHourlyForecast(lat, lon, retryCount = 0) {
    return new Promise((resolve, reject) => {
        try {
            // Если у нас уже есть данные о прогнозе, используем их для почасового прогноза
            if (weatherCache.forecast) {
                updateHourlyForecast(weatherCache.forecast);
                weatherCache.hourly = weatherCache.forecast;
                resolve(weatherCache.forecast);
                return;
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
            
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${OPENWEATHER_API_KEY}`, 
                  { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Кэшируем данные
                    weatherCache.hourly = data;
                    
                    // Обновляем почасовой прогноз
                    updateHourlyForecast(data);
                    
                    resolve(data);
                })
                .catch(error => {
                    console.error('Ошибка при получении почасового прогноза:', error);
                    
                    // Пытаемся повторить запрос при ошибке
                    if (retryCount < MAX_RETRIES) {
                        console.log(`Повторная попытка ${retryCount + 1}/${MAX_RETRIES}...`);
                        setTimeout(() => {
                            getHourlyForecast(lat, lon, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 1000);
                    } else {
                        reject(error);
                    }
                });
        } catch (error) {
            console.error('Ошибка в getHourlyForecast:', error);
            reject(error);
        }
    });
}

/**
 * Обновляет виджет погоды на главной странице
 * @param {Object} data - Данные о погоде
 */
function updateMainWeatherWidget(data) {
    try {
        const mainWeatherWidget = document.getElementById('main-weather-widget');
        if (!mainWeatherWidget) return;
        
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = getWeatherIcon(data.weather[0].icon);
        
        // Обновляем основной виджет погоды
        if (mainWeatherWidget.classList.contains('weather-widget')) {
            mainWeatherWidget.innerHTML = `
                <div class="weather-icon-large">${icon}</div>
                <div class="weather-temp">${temp > 0 ? '+' : ''}${temp}°C</div>
                <div class="weather-condition">${description}</div>
                <div class="weather-location">${userLocation.city}</div>
            `;
        } else {
            // Для нового дизайна
            const mainTempElement = document.getElementById('main-temp');
            const mainConditionElement = document.getElementById('main-condition');
            const mainWeatherDetailsElement = document.getElementById('main-weather-details');
            const weatherScene = document.getElementById('weather-scene');
            
            if (mainTempElement) {
                mainTempElement.textContent = `${temp > 0 ? '+' : ''}${temp}°C`;
            }
            
            if (mainConditionElement) {
                mainConditionElement.textContent = description;
            }
            
            if (mainWeatherDetailsElement) {
                mainWeatherDetailsElement.innerHTML = `
                    <div class="weather-data-item">
                        <i class="fas fa-wind"></i>
                        <span id="main-wind">${Math.round(data.wind.speed)} м/с</span>
                    </div>
                    <div class="weather-data-item">
                        <i class="fas fa-tint"></i>
                        <span id="main-humidity">${data.main.humidity}%</span>
                    </div>
                `;
            }
            
            // Обновляем анимацию погоды, если есть
            if (weatherScene) {
                updateWeatherAnimation(weatherScene, data.weather[0].id, data.weather[0].icon);
            }
        }
    } catch (error) {
        console.error('Ошибка при обновлении виджета погоды:', error);
    }
}

/**
 * Обновляет детальную информацию о погоде
 * @param {Object} data - Данные о погоде
 */
function updateDetailedWeather(data) {
    try {
        // Основная информация
        const weatherIconLarge = document.getElementById('weather-icon-large');
        if (weatherIconLarge) {
            weatherIconLarge.textContent = getWeatherIcon(data.weather[0].icon);
        }
        
        const temp = Math.round(data.main.temp);
        
        const weatherTempLarge = document.getElementById('weather-temp-large');
        if (weatherTempLarge) {
            weatherTempLarge.textContent = `${temp > 0 ? '+' : ''}${temp}°C`;
        }
        
        const weatherCondition = document.getElementById('weather-condition');
        if (weatherCondition) {
            weatherCondition.textContent = data.weather[0].description;
        }
        
        // Для нового дизайна
        const weatherTempLargeNew = document.getElementById('temp-display-large');
        if (weatherTempLargeNew) {
            weatherTempLargeNew.textContent = `${temp > 0 ? '+' : ''}${temp}°C`;
        }
        
        const weatherConditionLarge = document.getElementById('weather-condition-large');
        if (weatherConditionLarge) {
            weatherConditionLarge.textContent = data.weather[0].description;
        }
        
        // Обновляем анимацию погоды для большого виджета
        const weatherAnimationLarge = document.getElementById('weather-animation-large');
        if (weatherAnimationLarge) {
            updateWeatherAnimation(weatherAnimationLarge, data.weather[0].id, data.weather[0].icon);
        }
        
        // Детальная информация
        const weatherHumidity = document.getElementById('weather-humidity');
        if (weatherHumidity) {
            weatherHumidity.textContent = `${data.main.humidity}%`;
        }
        
        const weatherPressure = document.getElementById('weather-pressure');
        if (weatherPressure) {
            weatherPressure.textContent = `${Math.round(data.main.pressure * 0.750062)} мм рт.ст.`;
        }
        
        const weatherWind = document.getElementById('weather-wind');
        if (weatherWind) {
            weatherWind.textContent = `${Math.round(data.wind.speed)} м/с`;
        }
        
        // Дополнительная информация для нового дизайна
        const weatherVisibility = document.getElementById('weather-visibility');
        if (weatherVisibility && data.visibility) {
            const visibilityKm = Math.round(data.visibility / 100) / 10; // Переводим метры в километры
            weatherVisibility.textContent = `${visibilityKm} км`;
        }
    } catch (error) {
        console.error('Ошибка при обновлении детальной информации о погоде:', error);
    }
}

/**
 * Обновляет анимацию погоды в зависимости от погодных условий
 * @param {HTMLElement} container - Контейнер для анимации
 * @param {number} weatherCode - Код погоды
 * @param {string} iconCode - Код иконки погоды
 */
function updateWeatherAnimation(container, weatherCode, iconCode) {
    try {
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Определяем время суток из иконки
        const isDay = iconCode.includes('d');
        
        // Создаем базовый фон в зависимости от времени суток
        const backgroundDiv = document.createElement('div');
        backgroundDiv.className = isDay ? 'weather-background day' : 'weather-background night';
        container.appendChild(backgroundDiv);
        
        // Добавляем анимации в зависимости от погоды
        if (weatherCode >= 200 && weatherCode < 300) {
            // Гроза
            addThunderstorm(container);
        } else if (weatherCode >= 300 && weatherCode < 400) {
            // Морось
            addDrizzle(container);
        } else if (weatherCode >= 500 && weatherCode < 600) {
            // Дождь
            addRain(container, weatherCode >= 520); // Сильный дождь если >= 520
        } else if (weatherCode >= 600 && weatherCode < 700) {
            // Снег
            addSnow(container);
        } else if (weatherCode >= 700 && weatherCode < 800) {
            // Туман, пыль и т.д.
            addFog(container);
        } else if (weatherCode === 800) {
            // Чистое небо
            if (isDay) {
                addSun(container);
            } else {
                addMoon(container);
                addStars(container);
            }
        } else if (weatherCode > 800 && weatherCode < 900) {
            // Облачность
            addClouds(container, weatherCode - 800); // Количество облаков зависит от кода
            if (isDay && weatherCode <= 802) {
                addSun(container, true); // С облаками
            } else if (!isDay && weatherCode <= 802) {
                addMoon(container, true); // С облаками
                addStars(container, true); // Меньше звезд из-за облаков
            }
        }
    } catch (error) {
        console.error('Ошибка при обновлении анимации погоды:', error);
    }
}

/**
 * Добавляет анимацию солнца
 * @param {HTMLElement} container - Контейнер для анимации
 * @param {boolean} withClouds - Солнце с облаками
 */
function addSun(container, withClouds = false) {
    const sun = document.createElement('div');
    sun.className = withClouds ? 'sun with-clouds' : 'sun';
    container.appendChild(sun);
    
    // Добавляем лучи солнца
    const rays = document.createElement('div');
    rays.className = 'sun-rays';
    sun.appendChild(rays);
}

/**
 * Добавляет анимацию луны
 * @param {HTMLElement} container - Контейнер для анимации
 * @param {boolean} withClouds - Луна с облаками
 */
function addMoon(container, withClouds = false) {
    const moon = document.createElement('div');
    moon.className = withClouds ? 'moon with-clouds' : 'moon';
    container.appendChild(moon);
}

/**
 * Добавляет анимацию звезд
 * @param {HTMLElement} container - Контейнер для анимации
 * @param {boolean} lessDense - Меньшая плотность звезд
 */
function addStars(container, lessDense = false) {
    const stars = document.createElement('div');
    stars.className = lessDense ? 'stars less-dense' : 'stars';
    container.appendChild(stars);
    
    // Добавляем несколько звезд
    const starCount = lessDense ? 15 : 30;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        stars.appendChild(star);
    }
}

/**
 * Добавляет анимацию облаков
 * @param {HTMLElement} container - Контейнер для анимации
 * @param {number} cloudiness - Уровень облачности (1-4)
 */
function addClouds(container, cloudiness) {
    const clouds = document.createElement('div');
    clouds.className = 'clouds';
    container.appendChild(clouds);
    
    // Определяем количество облаков в зависимости от уровня облачности
    const cloudCount = Math.min(Math.max(cloudiness, 1), 4) + 1;
    
    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = `cloud cloud-${i+1}`;
        clouds.appendChild(cloud);
    }
}

/**
 * Добавляет анимацию дождя
 * @param {HTMLElement} container - Контейнер для анимации
 * @param {boolean} heavy - Сильный дождь
 */
function addRain(container, heavy = false) {
    // Сначала добавляем облака
    addClouds(container, heavy ? 4 : 2);
    
    const rain = document.createElement('div');
    rain.className = heavy ? 'rain heavy' : 'rain';
    container.appendChild(rain);
    
    // Добавляем капли
    const dropCount = heavy ? 80 : 40;
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random()}s`;
        drop.style.animationDelay = `${Math.random()}s`;
        rain.appendChild(drop);
    }
}

/**
 * Добавляет анимацию мороси
 * @param {HTMLElement} container - Контейнер для анимации
 */
function addDrizzle(container) {
    // Морось - это легкий дождь с более мелкими каплями
    addClouds(container, 2);
    
    const drizzle = document.createElement('div');
    drizzle.className = 'drizzle';
    container.appendChild(drizzle);
    
    const dropCount = 60;
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'drizzle-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random()}s`;
        drop.style.animationDelay = `${Math.random()}s`;
        drizzle.appendChild(drop);
    }
}

/**
 * Добавляет анимацию снега
 * @param {HTMLElement} container - Контейнер для анимации
 */
function addSnow(container) {
    // Сначала добавляем облака
    addClouds(container, 3);
    
    const snow = document.createElement('div');
    snow.className = 'snow';
    container.appendChild(snow);
    
    // Добавляем снежинки
    const flakeCount = 50;
    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDuration = `${3 + Math.random() * 7}s`;
        flake.style.animationDelay = `${Math.random()}s`;
        snow.appendChild(flake);
    }
}

/**
 * Добавляет анимацию тумана
 * @param {HTMLElement} container - Контейнер для анимации
 */
function addFog(container) {
    const fog = document.createElement('div');
    fog.className = 'fog';
    container.appendChild(fog);
    
    // Добавляем слои тумана
    for (let i = 0; i < 3; i++) {
        const fogLayer = document.createElement('div');
        fogLayer.className = `fog-layer fog-layer-${i+1}`;
        fog.appendChild(fogLayer);
    }
}

/**
 * Добавляет анимацию грозы
 * @param {HTMLElement} container - Контейнер для анимации
 */
function addThunderstorm(container) {
    // Сначала добавляем облака и дождь
    addRain(container, true);
    
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    container.appendChild(lightning);
    
    // Добавляем молнии
    for (let i = 0; i < 2; i++) {
        const bolt = document.createElement('div');
        bolt.className = `lightning-bolt bolt-${i+1}`;
        lightning.appendChild(bolt);
    }
}

/**
 * Обновляет прогноз погоды на 5 дней
 * @param {Object} data - Данные о прогнозе погоды
 */
function updateForecast(data) {
    try {
        const forecastContainer = document.getElementById('forecast-container');
        if (!forecastContainer) return;
        
        // Очищаем прогноз
        forecastContainer.innerHTML = '';
        
        // Получаем уникальные дни (без времени)
        const days = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toISOString().split('T')[0];
            
            if (!days[dayKey]) {
                days[dayKey] = {
                    date,
                    temps: [],
                    icons: [],
                    descriptions: []
                };
            }
            
            days[dayKey].temps.push(item.main.temp);
            days[dayKey].icons.push(item.weather[0].icon);
            days[dayKey].descriptions.push(item.weather[0].description);
        });
        
        // Конвертируем объект в массив и берем только первые 5 дней
        const forecastDays = Object.values(days).slice(0, 5);
        
        // Создаем элементы прогноза
        forecastDays.forEach(day => {
            // Находим максимальную и минимальную температуру
            const maxTemp = Math.round(Math.max(...day.temps));
            const minTemp = Math.round(Math.min(...day.temps));
            
            // Находим наиболее часто встречающуюся иконку
            const iconCounts = {};
            day.icons.forEach(icon => {
                iconCounts[icon] = (iconCounts[icon] || 0) + 1;
            });
            let mostFrequentIcon = day.icons[0];
            let maxCount = 0;
            
            for (const icon in iconCounts) {
                if (iconCounts[icon] > maxCount) {
                    maxCount = iconCounts[icon];
                    mostFrequentIcon = icon;
                }
            }
            
            // Форматируем дату
            const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
            const formattedDate = day.date.toLocaleDateString('ru-RU', dateOptions);
            
            // Создаем элемент прогноза
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');
            forecastDay.innerHTML = `
                <div class="forecast-date">${formattedDate}</div>
                <div class="forecast-icon">${getWeatherIcon

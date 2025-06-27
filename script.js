/**
 * ДотКит.ме - Многофункциональный сайт для пожилых людей
 * Основной JavaScript файл с функциональностью
 */

// --------------------------------
// КОНСТАНТЫ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// --------------------------------
// API ключ для OpenWeatherMap (бесплатный тариф)
const OPENWEATHER_API_KEY = '6a73686dc1863a1701641d2fd9f963a5';

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

// --------------------------------
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// --------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('ДотКит.ме загружается...');
    
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
    
    // Скрываем прелоадер после загрузки
    setTimeout(() => {
        document.getElementById('preloader').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('preloader').classList.add('hidden');
            
            // Показываем панель состояния
            document.getElementById('status-bar').classList.remove('hidden');
        }, 500);
    }, 2000);
});

// --------------------------------
// ФУНКЦИИ УПРАВЛЕНИЯ ИНТЕРФЕЙСОМ
// --------------------------------

/**
 * Переключение между разделами сайта
 * @param {string} sectionId - ID раздела, который нужно показать
 */
function showSection(sectionId) {
    // Скрываем все разделы
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем нужный раздел
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');
    
    // Обновляем данные для определенных разделов
    if (sectionId === 'weather-section') {
        getWeatherData();
        stats.weatherChecks++;
        saveStats();
    } else if (sectionId === 'admin-section') {
        updateAdminPanel();
    }
    
    // Прокручиваем страницу вверх
    window.scrollTo(0, 0);
    
    // Добавляем в историю
    addToViewHistory(sectionId);
}

/**
 * Проверяет, первый ли это визит пользователя
 */
function checkFirstVisit() {
    const visited = localStorage.getItem('visited');
    
    if (!visited) {
        // Если первый визит - показываем модальное окно для ввода имени
        setTimeout(() => {
            showModal('name-modal');
        }, 3000);
        
        localStorage.setItem('visited', 'true');
    }
}

/**
 * Показывает модальное окно
 * @param {string} modalId - ID модального окна
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

/**
 * Закрывает модальное окно
 */
function closeModal() {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

/**
 * Сохраняет имя пользователя
 */
function saveName() {
    const nameInput = document.getElementById('user-name-input');
    let userName = nameInput.value.trim();
    
    if (userName === '') {
        userName = 'Гость';
    }
    
    // Сохраняем имя в localStorage
    localStorage.setItem('userName', userName);
    
    // Обновляем интерфейс
    document.getElementById('user-display-name').textContent = userName;
    
    // Показываем уведомление
    showNotification(`Здравствуйте, ${userName}!`);
    
    // Закрываем модальное окно
    closeModal();
}

/**
 * Показывает уведомление
 * @param {string} message - Текст уведомления
 * @param {number} duration - Длительность показа в миллисекундах (по умолчанию 3000)
 */
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = message;
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, duration);
}

/**
 * Обновляет текущее время на странице
 */
function updateTime() {
    const now = new Date();
    const timeDisplay = document.getElementById('current-time');
    const options = { hour: '2-digit', minute: '2-digit' };
    
    timeDisplay.textContent = now.toLocaleTimeString('ru-RU', options);
}

/**
 * Устанавливает обработчики событий
 */
function setupEventListeners() {
    // Обработчик для фильтрации рецептов по категории
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс выбранной кнопке
            button.classList.add('active');
            
            // Фильтруем рецепты
            const category = button.dataset.category;
            filterRecipesByCategory(category);
        });
    });
}

// --------------------------------
// ФУНКЦИИ РАБОТЫ С ДАННЫМИ ПОЛЬЗОВАТЕЛЯ
// --------------------------------

/**
 * Загружает данные пользователя из localStorage
 */
function loadUserData() {
    // Загружаем имя пользователя
    const userName = localStorage.getItem('userName') || 'Гость';
    document.getElementById('user-display-name').textContent = userName;
    
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
}

/**
 * Сохраняет статистику пользователя
 */
function saveStats() {
    localStorage.setItem('userStats', JSON.stringify(stats));
    updateStatsDisplay();
}

/**
 * Обновляет отображение статистики
 */
function updateStatsDisplay() {
    document.getElementById('movies-watched').textContent = stats.moviesWatched;
    document.getElementById('weather-checks').textContent = stats.weatherChecks;
    document.getElementById('recipes-viewed').textContent = stats.recipesViewed;
    document.getElementById('games-played').textContent = stats.gamesPlayed;
}

/**
 * Добавляет запись в историю просмотров
 * @param {string} sectionId - ID просмотренного раздела
 */
function addToViewHistory(sectionId) {
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
}

/**
 * Обновляет список истории просмотров
 */
function updateHistoryList() {
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
}

/**
 * Очищает историю просмотров
 */
function clearHistory() {
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
    showNotification('История просмотров очищена');
}

/**
 * Обновляет информацию в админ-панели
 */
function updateAdminPanel() {
    // Обновляем статистику
    updateStatsDisplay();
    
    // Обновляем историю просмотров
    updateHistoryList();
    
    // Получаем IP пользователя
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-ip').textContent = `IP: ${data.ip}`;
        })
        .catch(error => {
            console.error('Ошибка при получении IP:', error);
            document.getElementById('user-ip').textContent = 'IP: недоступен';
        });
}

// --------------------------------
// ФУНКЦИИ ПОЛУЧЕНИЯ МЕСТОПОЛОЖЕНИЯ
// --------------------------------

/**
 * Получает местоположение пользователя
 */
function getUserLocation() {
    // Проверяем, сохранено ли местоположение
    const savedLocation = localStorage.getItem('userLocation');
    
    if (savedLocation) {
        userLocation = JSON.parse(savedLocation);
        getWeatherData();
        return;
    }
    
    // Пытаемся получить местоположение через Geolocation API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation.coords.latitude = position.coords.latitude;
                userLocation.coords.longitude = position.coords.longitude;
                
                // Получаем название города по координатам
                getCityFromCoords();
            },
            error => {
                console.error('Ошибка Geolocation:', error);
                // Используем IP для определения местоположения
                getLocationFromIP();
            }
        );
    } else {
        console.error('Geolocation не поддерживается в этом браузере');
        // Используем IP для определения местоположения
        getLocationFromIP();
    }
}

/**
 * Получает название города по координатам
 */
function getCityFromCoords() {
    const { latitude, longitude } = userLocation.coords;
    
    fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                userLocation.city = data[0].name;
                userLocation.country = data[0].country;
                
                // Сохраняем местоположение
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
                
                // Получаем данные о погоде
                getWeatherData();
            }
        })
        .catch(error => {
            console.error('Ошибка при получении города:', error);
            getLocationFromIP();
        });
}

/**
 * Получает местоположение по IP
 */
function getLocationFromIP() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            userLocation.city = data.city;
            userLocation.country = data.country_name;
            userLocation.coords.latitude = data.latitude;
            userLocation.coords.longitude = data.longitude;
            
            // Сохраняем местоположение
            localStorage.setItem('userLocation', JSON.stringify(userLocation));
            
            // Получаем данные о погоде
            getWeatherData();
        })
        .catch(error => {
            console.error('Ошибка при получении местоположения по IP:', error);
            // Используем Москву как местоположение по умолчанию
            userLocation.city = 'Москва';
            userLocation.country = 'Россия';
            userLocation.coords.latitude = 55.7558;
            userLocation.coords.longitude = 37.6173;
            
            // Сохраняем местоположение
            localStorage.setItem('userLocation', JSON.stringify(userLocation));
            
            // Получаем данные о погоде
            getWeatherData();
        });
}

// --------------------------------
// ФУНКЦИИ РАБОТЫ С ПОГОДОЙ
// --------------------------------

/**
 * Получает данные о погоде
 */
function getWeatherData() {
    if (!userLocation.coords.latitude || !userLocation.coords.longitude) {
        console.error('Координаты не определены');
        return;
    }
    
    const { latitude, longitude } = userLocation.coords;
    
    // Получаем текущую погоду
    getCurrentWeather(latitude, longitude);
    
    // Получаем прогноз на 5 дней
    getWeatherForecast(latitude, longitude);
    
    // Получаем почасовой прогноз
    getHourlyForecast(latitude, longitude);
}

/**
 * Получает текущую погоду
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 */
function getCurrentWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${OPENWEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            console.log('Текущая погода:', data);
            
            // Обновляем виджет погоды на главной странице
            updateMainWeatherWidget(data);
            
            // Обновляем детальную информацию о погоде
            updateDetailedWeather(data);
            
            // Обновляем строку состояния
            updateStatusBar(data);
            
            // Обновляем рекомендации по погоде
            updateWeatherRecommendations(data);
        })
        .catch(error => {
            console.error('Ошибка при получении погоды:', error);
        });
}

/**
 * Получает прогноз погоды на 5 дней
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 */
function getWeatherForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${OPENWEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            console.log('Прогноз погоды:', data);
            
            // Обновляем прогноз на 5 дней
            updateForecast(data);
        })
        .catch(error => {
            console.error('Ошибка при получении прогноза погоды:', error);
        });
}

/**
 * Получает почасовой прогноз погоды
 * @param {number} lat - Широта
 * @param {number} lon - Долгота
 */
function getHourlyForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${OPENWEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            // Обновляем почасовой прогноз
            updateHourlyForecast(data);
        })
        .catch(error => {
            console.error('Ошибка при получении почасового прогноза:', error);
        });
}

/**
 * Обновляет виджет погоды на главной странице
 * @param {Object} data - Данные о погоде
 */
function updateMainWeatherWidget(data) {
    const mainWeatherWidget = document.getElementById('main-weather-widget');
    
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = getWeatherIcon(data.weather[0].icon);
    
    mainWeatherWidget.innerHTML = `
        <div class="weather-icon-large">${icon}</div>
        <div class="weather-temp">${temp > 0 ? '+' : ''}${temp}°C</div>
        <div class="weather-condition">${description}</div>
        <div class="weather-location">${userLocation.city}</div>
    `;
}

/**
 * Обновляет детальную информацию о погоде
 * @param {Object} data - Данные о погоде
 */
function updateDetailedWeather(data) {
    // Основная информация
    document.getElementById('weather-icon-large').textContent = getWeatherIcon(data.weather[0].icon);
    
    const temp = Math.round(data.main.temp);
    document.getElementById('weather-temp-large').textContent = `${temp > 0 ? '+' : ''}${temp}°C`;
    
    document.getElementById('weather-condition').textContent = data.weather[0].description;
    
    // Детальная информация
    document.getElementById('weather-humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('weather-pressure').textContent = `${Math.round(data.main.pressure * 0.750062)} мм рт.ст.`;
    document.getElementById('weather-wind').textContent = `${Math.round(data.wind.speed)} м/с`;
}

/**
 * Обновляет прогноз погоды на 5 дней
 * @param {Object} data - Данные о прогнозе погоды
 */
function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
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
            <div class="forecast-icon">${getWeatherIcon(mostFrequentIcon)}</div>
            <div class="forecast-temp-max">${maxTemp > 0 ? '+' : ''}${maxTemp}°</div>
            <div class="forecast-temp-min">${minTemp > 0 ? '+' : ''}${minTemp}°</div>
        `;
        
        forecastContainer.appendChild(forecastDay);
    });
}

/**
 * Обновляет почасовой прогноз погоды
 * @param {Object} data - Данные о прогнозе погоды
 */
function updateHourlyForecast(data) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = '';
    
    // Берем только первые 24 часа (8 записей по 3 часа)
    const hourlyData = data.list.slice(0, 8);
    
    hourlyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const hours = date.getHours();
        const formattedTime = `${hours}:00`;
        const temp = Math.round(item.main.temp);
        
        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');
        hourlyItem.innerHTML = `
            <div class="hourly-time">${formattedTime}</div>
            <div class="hourly-icon">${getWeatherIcon(item.weather[0].icon)}</div>
            <div class="hourly-temp">${temp > 0 ? '+' : ''}${temp}°</div>
        `;
        
        hourlyForecast.appendChild(hourlyItem);
    });
}

/**
 * Обновляет рекомендации по погоде
 * @param {Object} data - Данные о погоде
 */
function updateWeatherRecommendations(data) {
    const recommendations = document.getElementById('weather-recommendations');
    const recommendationElement = document.getElementById('clothing-recommendation');
    
    const temp = Math.round(data.main.temp);
    const windSpeed = Math.round(data.wind.speed);
    const weatherCode = data.weather[0].id;
    
    // Определяем рекомендации по одежде
    let clothingRecommendation = '';
    let recommendationIcon = '';
    
    if (temp <= -20) {
        clothingRecommendation = 'Экстремально холодно! Наденьте очень теплую одежду, несколько слоев, теплый шарф, шапку и перчатки.';
        recommendationIcon = '🧥❄️';
    } else if (temp <= -10) {
        clothingRecommendation = 'Очень холодно. Наденьте теплую куртку, шапку, перчатки и шарф.';
        recommendationIcon = '🧥';
    } else if (temp <= 0) {
        clothingRecommendation = 'Холодно. Наденьте куртку, шапку и перчатки.';
        recommendationIcon = '🧥';
    } else if (temp <= 10) {
        clothingRecommendation = 'Прохладно. Возьмите куртку или свитер.';
        recommendationIcon = '🧥';
    } else if (temp <= 20) {
        clothingRecommendation = 'Комфортная погода. Легкая куртка или кофта будет достаточно.';
        recommendationIcon = '🧶';
    } else {
        clothingRecommendation = 'Тепло. Можно надеть легкую одежду.';
        recommendationIcon = '👕';
    }
    
    // Дополнительные рекомендации в зависимости от погоды
    if (weatherCode >= 200 && weatherCode < 300) {
        clothingRecommendation += ' Возьмите зонт, ожидается гроза.';
        recommendationIcon = '🌩️';
    } else if (weatherCode >= 300 && weatherCode < 600) {
        clothingRecommendation += ' Не забудьте взять зонт, ожидаются осадки.';
        recommendationIcon = '☔';
    } else if (weatherCode >= 600 && weatherCode < 700) {
        clothingRecommendation += ' Ожидается снег, наденьте непромокаемую обувь.';
        recommendationIcon = '❄️';
    } else if (weatherCode >= 700 && weatherCode < 800) {
        clothingRecommendation += ' Будьте осторожны, ожидается туман или пыль.';
        recommendationIcon = '🌫️';
    }
    
    if (windSpeed > 10) {
        clothingRecommendation += ' Сильный ветер, наденьте ветрозащитную одежду.';
        recommendationIcon = '💨';
    }
    
    recommendationElement.innerHTML = `
        <div class="recommendation-icon">${recommendationIcon}</div>
        <div class="recommendation-text">${clothingRecommendation}</div>
    `;
}

/**
 * Обновляет строку состояния с погодой и временем
 * @param {Object} data - Данные о погоде
 */
function updateStatusBar(data) {
    const temp = Math.round(data.main.temp);
    document.getElementById('current-temp').textContent = `${temp > 0 ? '+' : ''}${temp}°C`;
    
    const weatherIcon = document.getElementById('status-icon');
    weatherIcon.textContent = getWeatherIcon(data.weather[0].icon);
    
    document.getElementById('status-text').textContent = data.weather[0].description;
}

/**
 * Возвращает эмодзи иконку в зависимости от кода иконки погоды
 * @param {string} iconCode - Код иконки погоды от API
 * @returns {string} - Эмодзи иконка
 */
function getWeatherIcon(iconCode) {
    const icons = {
        '01d': '☀️', // ясно (день)
        '01n': '🌙', // ясно (ночь)
        '02d': '🌤️', // малооблачно (день)
        '02n': '🌙☁️', // малооблачно (ночь)
        '03d': '⛅', // облачно с прояснениями
        '03n': '⛅',
        '04d': '☁️', // облачно
        '04n': '☁️',
        '09d': '🌧️', // дождь
        '09n': '🌧️',
        '10d': '🌦️', // дождь (день)
        '10n': '🌧️', // дождь (ночь)
        '11d': '⛈️', // гроза
        '11n': '⛈️',
        '13d': '❄️', // снег
        '13n': '❄️',
        '50d': '🌫️', // туман
        '50n': '🌫️'
    };
    
    return icons[iconCode] || '☁️';
}

// --------------------------------
// ФУНКЦИИ РАБОТЫ С ФИЛЬМАМИ
// --------------------------------

/**
 * Заполняет сетку с фильмами
 */
function populateMovies() {
    const moviesGrid = document.getElementById('movies-grid');
    if (!moviesGrid) return;
    
    // Очищаем сетку
    moviesGrid.innerHTML = '';
    
    // Добавляем фильмы в сетку
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.id = movie.id;
        movieCard.dataset.genre = movie.genre;
        movieCard.dataset.year = movie.year;
        
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.year}</span>
                    <span class="movie-genre">${movie.genre}</span>
                </div>
            </div>
        `;
        
        // Добавляем обработчик события для показа фильма
        movieCard.addEventListener('click', () => showMovie(movie.id));
        
        moviesGrid.appendChild(movieCard);
    });
    
    // Обновляем историю просмотров
    updateRecentlyViewed();
}

/**
 * Фильтрует фильмы по жанру
 */
function filterMovies() {
    const genreSelect = document.getElementById('genre-filter');
    const genre = genreSelect.value;
    
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        if (genre === 'all' || card.dataset.genre === genre) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Показывает случайный фильм
 */
function showRandomMovie() {
    const availableMovies = movies.filter(movie => {
        const genreSelect = document.getElementById('genre-filter');
        const genre = genreSelect.value;
        return genre === 'all' || movie.genre === genre;
    });
    
    if (availableMovies.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableMovies.length);
    const randomMovie = availableMovies[randomIndex];
    
    showMovie(randomMovie.id);
}

/**
 * Показывает детали фильма и плеер
 * @param {number} id - ID фильма
 */
function showMovie(id) {
    const movie = movies.find(m => m.id === parseInt(id));
    if (!movie) return;
    
    // Показываем контейнер с плеером
    const playerContainer = document.getElementById('movie-player-container');
    playerContainer.classList.remove('hidden');
    
    // Заполняем информацию о фильме
    document.getElementById('current-movie-title').textContent = movie.title;
    document.getElementById('current-movie-description').innerHTML = `
        <p><strong>Год:</strong> ${movie.year}</p>
        <p><strong>Жанр:</strong> ${movie.genre}</p>
        <p>${movie.description}</p>
    `;
    
    // Инициализируем плеер YouTube
    initYouTubePlayer(movie.youtubeId);
    
    // Увеличиваем счетчик просмотренных фильмов
    stats.moviesWatched++;
    saveStats();
    
    // Добавляем фильм в историю просмотров
    addMovieToHistory(movie);
    
    // Прокручиваем к плееру
    playerContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Инициализирует плеер YouTube
 * @param {string} videoId - ID видео на YouTube
 */
function initYouTubePlayer(videoId) {
    // Если плеер уже существует, просто загружаем новое видео
    if (youtubePlayer) {
        youtubePlayer.loadVideoById(videoId);
        return;
    }
    
    // Иначе создаем новый плеер
    youtubePlayer = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1
        }
    });
}

/**
 * Закрывает плеер фильма
 */
function closeMoviePlayer() {
    const playerContainer = document.getElementById('movie-player-container');
    playerContainer.classList.add('hidden');
    
    // Останавливаем воспроизведение
    if (youtubePlayer && typeof youtubePlayer.pauseVideo === 'function') {
        youtubePlayer.pauseVideo();
    }
}

/**
 * Добавляет фильм в историю просмотров
 * @param {Object} movie - Объект с данными о фильме
 */
function addMovieToHistory(movie) {
    // Проверяем, есть ли уже такой фильм в истории
    const existingIndex = viewHistory.movies.findIndex(item => item.movieId === movie.id);
    
    // Если есть, удаляем его
    if (existingIndex !== -1) {
        viewHistory.movies.splice(existingIndex, 1);
    }
    
    // Добавляем новую запись
    const now = new Date();
    viewHistory.movies.unshift({
        timestamp: now.getTime(),
        date: now.toLocaleString('ru-RU'),
        section: 'movies-section',
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster
    });
    
    // Обрезаем историю до последних 10 записей
    if (viewHistory.movies.length > 10) {
        viewHistory.movies = viewHistory.movies.slice(0, 10);
    }
    
    // Сохраняем историю
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
    
    // Обновляем список недавно просмотренных
    updateRecentlyViewed();
}

/**
 * Обновляет список недавно просмотренных фильмов
 */
function updateRecentlyViewed() {
    const recentList = document.getElementById('recently-viewed-list');
    if (!recentList) return;
    
    // Очищаем список
    recentList.innerHTML = '';
    
    // Если история пуста
    if (viewHistory.movies.length === 0) {
        recentList.innerHTML = '<div class="empty-history">Нет просмотренных фильмов</div>';
        return;
    }
    
    // Добавляем фильмы в список
    viewHistory.movies.forEach(item => {
        const recentMovie = document.createElement('div');
        recentMovie.classList.add('recent-movie');
        
        recentMovie.innerHTML = `
            <div class="movie-card" onclick="showMovie(${item.movieId})">
                <img src="${item.poster}" alt="${item.title}" class="movie-poster">
                <div class="movie-info">
                    <div class="movie-title">${item.title}</div>
                </div>
            </div>
        `;
        
        recentList.appendChild(recentMovie);
    });
}

// --------------------------------
// ФУНКЦИИ РАБОТЫ С РЕЦЕПТАМИ
// --------------------------------

/**
 * Заполняет сетку с рецептами
 */
function populateRecipes() {
    const recipesGrid = document.getElementById('recipes-grid');
    if (!recipesGrid) return;
    
    // Очищаем сетку
    recipesGrid.innerHTML = '';
    
    // Добавляем рецепты в сетку
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.dataset.id = recipe.id;
        recipeCard.dataset.category = recipe.category;
        
        recipeCard.innerHTML = `
            <div class="recipe-image-container">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                <div class="recipe-time">⏱️ ${recipe.time}</div>
            </div>
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-description">${recipe.description}</div>
                <div class="recipe-meta">
                    <span class="recipe-difficulty">Сложность: ${recipe.difficulty}</span>
                    <span class="recipe-servings">Порций: ${recipe.servings}</span>
                </div>
            </div>
        `;
        
        // Добавляем обработчик события для показа рецепта
        recipeCard.addEventListener('click', () => showRecipe(recipe.id));
        
        recipesGrid.appendChild(recipeCard);
    });
}

/**
 * Фильтрует рецепты по категории
 * @param {string} category - Категория рецептов
 */
function filterRecipesByCategory(category) {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Выполняет поиск рецептов
 */
function searchRecipes() {
    const searchInput = document.getElementById('recipe-search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query === '') {
        // Если поисковый запрос пуст, показываем все рецепты
        populateRecipes();
        return;
    }
    
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        const title = card.querySelector('.recipe-title').textContent.toLowerCase();
        const description = card.querySelector('.recipe-description').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Показывает детальную информацию о рецепте
 * @param {number} id - ID рецепта
 */
function showRecipe(id) {
    const recipe = recipes.find(r => r.id === parseInt(id));
    if (!recipe) return;
    
    // Заполняем информацию о рецепте
    document.getElementById('recipe-detail-title').textContent = recipe.title;
    document.getElementById('recipe-detail-image').src = recipe.image;
    document.getElementById('recipe-detail-image').alt = recipe.title;
    document.getElementById('recipe-detail-time').textContent = recipe.time;
    document.getElementById('recipe-detail-servings').textContent = `${recipe.servings} порций`;
    document.getElementById('recipe-detail-difficulty').textContent = `Сложность: ${recipe.difficulty}`;
    
    // Ингредиенты
    const ingredientsList = document.getElementById('recipe-detail-ingredients');
    ingredientsList.innerHTML = '';
    
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    
    // Шаги приготовления
    const stepsList = document.getElementById('recipe-detail-steps');
    stepsList.innerHTML = '';
    
    recipe.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });
    
    // Показываем детали рецепта
    document.getElementById('recipe-details').classList.remove('hidden');
    
    // Увеличиваем счетчик просмотренных рецептов
    stats.recipesViewed++;
    saveStats();
    
    // Добавляем рецепт в историю просмотров
    addRecipeToHistory(recipe);
}

/**
 * Закрывает детали рецепта
 */
function closeRecipeDetails() {
    document.getElementById('recipe-details').classList.add('hidden');
}

/**
 * Печатает рецепт
 */
function printRecipe() {
    const title = document.getElementById('recipe-detail-title').textContent;
    const ingredients = Array.from(document.getElementById('recipe-detail-ingredients').children)
        .map(li => li.textContent)
        .join('\n• ');
    const steps = Array.from(document.getElementById('recipe-detail-steps').children)
        .map((li, index) => `${index + 1}. ${li.textContent}`)
        .join('\n');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Рецепт: ${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                h2 {
                    margin-top: 30px;
                }
                ul, ol {
                    margin-bottom: 30px;
                }
                li {
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <h2>Ингредиенты:</h2>
            <ul>
                <li>• ${ingredients}</li>
            </ul>
            <h2>Приготовление:</h2>
            <div>${steps}</div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Добавляет/удаляет рецепт из избранного
 */
function toggleFavoriteRecipe() {
    const titleElement = document.getElementById('recipe-detail-title');
    if (!titleElement) return;
    
    const title = titleElement.textContent;
    
    // Получаем список избранных рецептов из localStorage
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    
    // Проверяем, есть ли рецепт в избранном
    const index = favorites.findIndex(fav => fav.title === title);
    
    if (index === -1) {
        // Добавляем в избранное
        const recipe = recipes.find(r => r.title === title);
        if (recipe) {
            favorites.push({
                id: recipe.id,
                title: recipe.title
            });
            showNotification('Рецепт добавлен в избранное');
        }
    } else {
        // Удаляем из избранного
        favorites.splice(index, 1);
        showNotification('Рецепт удален из избранного');
    }
    
    // Сохраняем список избранного в localStorage
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
}

/**
 * Добавляет рецепт в историю просмотров
 * @param {Object} recipe - Объект с данными о рецепте
 */
function addRecipeToHistory(recipe) {
    // Проверяем, есть ли уже такой рецепт в истории
    const existingIndex = viewHistory.recipes.findIndex(item => item.recipeId === recipe.id);
    
    // Если есть, удаляем его
    if (existingIndex !== -1) {
        viewHistory.recipes.splice(existingIndex, 1);
    }
    
    // Добавляем новую запись
    const now = new Date();
    viewHistory.recipes.unshift({
        timestamp: now.getTime(),
        date: now.toLocaleString('ru-RU'),
        section: 'recipes-section',
        recipeId: recipe.id,
        title: recipe.title
    });
    
    // Обрезаем историю до последних 10 записей
    if (viewHistory.recipes.length > 10) {
        viewHistory.recipes = viewHistory.recipes.slice(0, 10);
    }
    
    // Сохраняем историю
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
}

// --------------------------------
// ФУНКЦИИ ДЛЯ ИГР
// --------------------------------

/**
 * Запускает игру "Найди пару"
 */
function startMemoryGame() {
    // Показываем контейнер игры
    const gameContainer = document.getElementById('memory-game-container');
    gameContainer.classList.remove('hidden');
    
    // Сбрасываем игру
    restartMemoryGame();
    
    // Увеличиваем счетчик игр
    stats.gamesPlayed++;
    saveStats();
    
    // Прокручиваем к игре
    gameContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Закрывает игру "Найди пару"
 */
function closeMemoryGame() {
    document.getElementById('memory-game-container').classList.add('hidden');
    
    // Останавливаем таймер
    clearInterval(memoryGame.timer);
}

/**
 * Перезапускает игру "Найди пару"
 */
function restartMemoryGame() {
    // Сбрасываем переменные игры
    memoryGame = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        timer: null,
        seconds: 0
    };
    
    // Сбрасываем отображение ходов и времени
    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-timer').textContent = '00:00';
    
    // Генерируем карточки
    const memoryBoard = document.getElementById('memory-board');
    memoryBoard.innerHTML = '';
    
    // Создаем массив эмоджи (8 пар)
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const cardEmojis = [...emojis, ...emojis];
    
    // Перемешиваем массив
    for (let i = cardEmojis.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardEmojis[i], cardEmojis[j]] = [cardEmojis[j], cardEmojis[i]];
    }
    
    // Создаем карточки
    cardEmojis.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = emoji;
        card.dataset.index = index;
        
        card.addEventListener('click', () => flipCard(card));
        
        memoryBoard.appendChild(card);
        memoryGame.cards.push(card);
    });
    
    // Запускаем таймер
    clearInterval(memoryGame.timer);
    memoryGame.timer = setInterval(updateMemoryTimer, 1000);
}

/**
 * Переворачивает карту в игре "Найди пару"
 * @param {HTMLElement} card - Элемент карточки
 */
function flipCard(card) {
    // Игнорируем клик, если:
    // 1. Карта уже перевернута или найдена
    // 2. Уже перевернуты две карты
    if (
        card.classList.contains('flipped') ||
        card.classList.contains('matched') ||
        memoryGame.flippedCards.length >= 2
    ) {
        return;
    }
    
    // Переворачиваем карту
    card.classList.add('flipped');
    card.textContent = card.dataset.value;
    
    // Добавляем карту в массив перевернутых
    memoryGame.flippedCards.push(card);
    
    // Если перевернуты две карты, проверяем совпадение
    if (memoryGame.flippedCards.length === 2) {
        // Увеличиваем счетчик ходов
        memoryGame.moves++;
        document.getElementById('memory-moves').textContent = memoryGame.moves;
        
        const [card1, card2] = memoryGame.flippedCards;
        
        // Проверяем совпадение
        if (card1.dataset.value === card2.dataset.value) {
            // Совпадение найдено
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                memoryGame.flippedCards = [];
                memoryGame.matchedPairs++;
                
                // Проверяем победу
                if (memoryGame.matchedPairs === 8) {
                    clearInterval(memoryGame.timer);
                    setTimeout(() => {
                        alert(`Поздравляем! Вы нашли все пары за ${memoryGame.moves} ходов за время ${document.getElementById('memory-timer').textContent}`);
                    }, 500);
                }
            }, 500);
        } else {
            // Нет совпадения, переворачиваем обратно
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
                memoryGame.flippedCards = [];
            }, 1000);
        }
    }
}

/**
 * Обновляет таймер в игре "Найди пару"
 */
function updateMemoryTimer() {
    memoryGame.seconds++;
    
    const minutes = Math.floor(memoryGame.seconds / 60);
    const seconds = memoryGame.seconds % 60;
    
    document.getElementById('memory-timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
/**
 * Запускает игру "Пазл"
 */
function startPuzzleGame() {
    // Заглушка для будущей реализации
    showNotification('Игра "Пазл" будет доступна в следующем обновлении!');
}

/**
 * Запускает игру "Слова"
 */
function startWordGame() {
    // Заглушка для будущей реализации
    showNotification('Игра "Слова" будет доступна в следующем обновлении!');
}

// --------------------------------
// ФУНКЦИИ ДЛЯ РАБОТЫ С YOUTUBE API
// --------------------------------

/**
 * Функция вызывается автоматически после загрузки YouTube IFrame API
 */
function onYouTubeIframeAPIReady() {
    console.log('YouTube API готов');
    // Плеер будет инициализирован при первом просмотре фильма
}

// --------------------------------
// ДАННЫЕ О ФИЛЬМАХ И РЕЦЕПТАХ
// --------------------------------

// Массив с данными о фильмах будет загружен из файла data.js
// Массив с данными о рецептах будет загружен из файла data.js

/**
 * IP-based authentication system for dotkit.me
 * Система аутентификации на основе IP-адреса
 */

class IPAuth {
    constructor() {
        this.currentUser = null;
        this.sessionData = this.getSessionData();
        this.init();
    }

    async init() {
        // Получаем IP пользователя
        const userIP = await this.getUserIP();
        
        // Проверяем, есть ли пользователь в базе
        const user = await this.checkUserExists(userIP);
        
        if (user) {
            // Пользователь найден - загружаем его данные
            this.currentUser = user;
            this.updateWelcomeMessage();
            this.loadUserPreferences();
            this.updateLastVisit(userIP);
        } else {
            // Новый пользователь - создаем запись
            await this.createNewUser(userIP);
        }
    }

    async getUserIP() {
        try {
            // Используем бесплатный сервис для получения IP
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.warn('Не удалось получить IP, используем локальный:', error);
            // Fallback для локальной разработки
            return '127.0.0.1';
        }
    }

    async checkUserExists(ip) {
        // В реальном проекте это будет запрос к серверу
        // Сейчас используем localStorage для демонстрации
        const users = this.getStoredUsers();
        return users.find(user => 
            user.currentIP === ip || 
            user.previousIPs.includes(ip)
        );
    }

    async createNewUser(ip) {
        const newUser = {
            id: this.generateUserId(),
            name: 'Гость',
            currentIP: ip,
            previousIPs: [],
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            permissions: {
                movies: true,
                recipes: true,
                adult: false
            },
            history: [],
            preferences: {
                theme: 'dark',
                language: 'uk'
            }
        };

        // Сохраняем в localStorage (в реальном проекте - на сервер)
        const users = this.getStoredUsers();
        users.push(newUser);
        localStorage.setItem('dotkit_users', JSON.stringify(users));
        
        this.currentUser = newUser;
        
        // Уведомляем админа о новом пользователе
        this.notifyAdminNewUser(newUser);
    }

    async updateLastVisit(ip) {
        if (!this.currentUser) return;
        
        // Обновляем IP если изменился
        if (this.currentUser.currentIP !== ip) {
            this.currentUser.previousIPs.push(this.currentUser.currentIP);
            this.currentUser.currentIP = ip;
        }
        
        this.currentUser.lastVisit = new Date().toISOString();
        this.saveCurrentUser();
    }

    updateWelcomeMessage() {
        const nameElement = document.getElementById('user-name');
        if (nameElement && this.currentUser) {
            nameElement.textContent = this.currentUser.name;
        }
    }

    loadUserPreferences() {
        if (!this.currentUser) return;
        
        // Показываем кнопку для взрослых если есть доступ
        const adultBtn = document.getElementById('adult-btn');
        if (adultBtn && this.currentUser.permissions.adult) {
            adultBtn.style.display = 'block';
        }
        
        // Загружаем историю просмотров
        this.loadHistory();
    }

    loadHistory() {
        const historyGrid = document.getElementById('history-grid');
        if (!historyGrid || !this.currentUser) return;
        
        const history = this.currentUser.history.slice(-6); // Последние 6
        
        if (history.length === 0) {
            historyGrid.innerHTML = '<p class="no-history">История просмотров пуста</p>';
            return;
        }
        
        historyGrid.innerHTML = history.map(item => `
            <div class="history-item" onclick="this.openContent('${item.url}')">
                <div class="history-poster">
                    <img src="${item.poster || '../assets/images/placeholder.jpg'}" alt="${item.title}">
                </div>
                <div class="history-info">
                    <h4>${item.title}</h4>
                    <p>${this.formatDate(item.watchedAt)}</p>
                </div>
            </div>
        `).join('');
    }

    addToHistory(title, url, poster = null) {
        if (!this.currentUser) return;
        
        const historyItem = {
            title,
            url,
            poster,
            watchedAt: new Date().toISOString()
        };
        
        // Удаляем дубликаты
        this.currentUser.history = this.currentUser.history.filter(item => item.url !== url);
        
        // Добавляем в начало
        this.currentUser.history.unshift(historyItem);
        
        // Ограничиваем размер истории
        if (this.currentUser.history.length > 50) {
            this.currentUser.history = this.currentUser.history.slice(0, 50);
        }
        
        this.saveCurrentUser();
    }

    // Утилиты
    getStoredUsers() {
        const stored = localStorage.getItem('dotkit_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveCurrentUser() {
        const users = this.getStoredUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem('dotkit_users', JSON.stringify(users));
        }
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getSessionData() {
        const stored = sessionStorage.getItem('dotkit_session');
        return stored ? JSON.parse(stored) : {};
    }

    notifyAdminNewUser(user) {
        // В реальном проекте это может быть WebSocket или уведомление
        console.log('Новый пользователь:', user.currentIP);
    }

    openContent(url) {
        window.location.href = url;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.ipAuth = new IPAuth();
    
    // Обновляем время каждую секунду
    setInterval(() => {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }, 1000);
});

/**
 * Основной JavaScript для dotkit.me (с учётом Google Sheets логирования IP)
 */

document.addEventListener('DOMContentLoaded', function() {
    initAdminAccess();
    initTextAnimations();
    initParallaxEffects();
    initCurrentTime();
    recordVisitorIP();

    // --- Новая логика для входа в админ-панель ---
    function initAdminAccess() {
        const adminAccess = document.getElementById('admin-access');
        if (!adminAccess) return;

        adminAccess.addEventListener('click', async function() {
            // 1. Проверяем IP (теперь по Google Sheets, не по локальному массиву)
            const userIP = await getUserIP();
            let isAdmin = false;
            try {
                await window.googleSheetsManager.init();
                const adminIPs = await window.googleSheetsManager.fetchAdmins();
                isAdmin = adminIPs.includes(userIP);
            } catch (e) {
                // fallback - разрешаем только локальные если что-то не так
                isAdmin = ['37.55.15.59', '127.0.0.1', '::1'].includes(userIP);
            }

            if (!isAdmin) {
                alert(`❌ ДОСТУП ЗАПРЕЩЕН\n\nВаш IP: ${userIP}\nНе авторизован для доступа к админ-панели`);
                logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS', {
                    ip: userIP,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
                return;
            }

            // 2. Получаем текущее время и погоду
            const now = new Date();
            const currentTime = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
            let weather = await getWeather();

            // 3. Показываем модальное окно для PIN
            showPinModal(currentTime, weather, async (pin) => {
                if (validateTimePin(pin)) {
                    logSecurityEvent('ADMIN_LOGIN_SUCCESS', {
                        ip: userIP,
                        timestamp: new Date().toISOString()
                    });
                    window.location.href = 'admin/panel.html';
                } else {
                    showPinModal(currentTime, weather, null, true); // Показать ошибку
                    logSecurityEvent('ADMIN_LOGIN_FAILED', {
                        ip: userIP,
                        enteredPin: pin,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });
    }

    // --- Модальное окно для PIN ---
    function showPinModal(time, weather, onSubmit, isError = false) {
        let modal = document.getElementById('pin-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pin-modal';
            modal.innerHTML = `
                <div class="pin-modal-overlay"></div>
                <div class="pin-modal-content">
                    <h2>Вход в админ-панель</h2>
                    <div class="pin-meta">
                        <div>⏰ Текущее время: <span id="pin-modal-time">${time}</span></div>
                        <div>🌤️ Погода: <span id="pin-modal-weather">${weather}</span></div>
                    </div>
                    <form id="pin-form">
                        <input type="text" pattern="\\d*" inputmode="numeric" id="pin-input" placeholder="PIN-код (время, напр. 1343)" autocomplete="off" required>
                        <button type="submit">Войти</button>
                    </form>
                    <div class="pin-error" id="pin-error" style="display: ${isError ? 'block' : 'none'};">
                        ❌ Неверный PIN-код! Попробуйте ещё раз.
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Стили для модального окна (можно вынести в CSS)
            const style = document.createElement('style');
            style.textContent = `
#pin-modal {
    position: fixed; z-index: 9999; left: 0; top: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;
}
.pin-modal-overlay {
    position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6);
}
.pin-modal-content {
    position: relative; z-index: 2; background: #161b22; color: #f0f6fc; padding: 2rem 2.5rem 1.5rem 2.5rem; border-radius: 1rem; box-shadow: 0 8px 32px #000a;
    min-width: 320px; max-width: 96vw;
}
.pin-modal-content h2 { margin: 0 0 1.5rem 0; text-align: center; }
.pin-meta { margin-bottom: 1rem; font-size: 1rem; }
#pin-form { display: flex; flex-direction: column; gap: 1rem; }
#pin-input { padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #30363d; background: #010409; color: #f0f6fc; font-size: 1.2rem; }
#pin-input:focus { outline: none; border-color: #58a6ff; }
#pin-form button { padding: 0.75rem 0; border-radius: 0.5rem; border: none; background: #58a6ff; color: #fff; font-weight: 600; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }
#pin-form button:hover { background: #bc8cff; }
.pin-error { color: #ff5c5c; margin-top: 0.5rem; text-align: center; font-weight: 500; }
            `;
            document.head.appendChild(style);
        } else {
            // Обновляем время, погоду, ошибку
            document.getElementById('pin-modal-time').textContent = time;
            document.getElementById('pin-modal-weather').textContent = weather;
            document.getElementById('pin-error').style.display = isError ? 'block' : 'none';
            document.getElementById('pin-input').value = '';
        }

        // Показываем окно
        modal.style.display = 'flex';

        // Фокус на поле
        setTimeout(() => {
            document.getElementById('pin-input').focus();
        }, 50);

        // Обработка формы
        const form = document.getElementById('pin-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            const pin = document.getElementById('pin-input').value.trim();
            if (onSubmit) {
                modal.style.display = 'none';
                onSubmit(pin);
            }
            return false;
        };
    }

    // --- Погода (пример: Киев, open-meteo.com) ---
    async function getWeather() {
        // Демо: Kyiv, UA (можно поменять координаты)
        const lat = 50.4501, lon = 30.5234;
        try {
            const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await resp.json();
            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                const wcode = data.current_weather.weathercode;
                // Примитивная расшифровка
                let desc = 'Ясно';
                if (wcode >= 2 && wcode <= 3) desc = 'Облачно';
                if (wcode >= 45 && wcode <= 48) desc = 'Туман';
                if (wcode >= 51 && wcode <= 67) desc = 'Дождь';
                if (wcode >= 71 && wcode <= 77) desc = 'Снег';
                if (wcode >= 80 && wcode <= 82) desc = 'Ливень';
                if (wcode >= 95) desc = 'Гроза';
                return `+${temp}°C, ${desc}`;
            }
        } catch(e) {}
        return 'нет данных';
    }

    // --- PIN-код: время без двоеточия, допускаем ±2 минуты ---
    function validateTimePin(pin) {
        const pins = [];
        for (let i = -2; i <= 2; i++) {
            const time = new Date(Date.now() + i * 60000);
            const p = time.getHours().toString().padStart(2, '0') + time.getMinutes().toString().padStart(2, '0');
            pins.push(p);
        }
        return pins.includes(pin);
    }

    // --- IP определение ---
    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                return data.ip;
            } catch (error2) {
                return '127.0.0.1';
            }
        }
    }

    // --- Логирование событий ---
    function logSecurityEvent(eventType, data) {
        const securityLog = getSecurityLog();
        const logEntry = {
            id: generateLogId(),
            type: eventType,
            timestamp: new Date().toISOString(),
            data: data
        };
        securityLog.push(logEntry);
        if (securityLog.length > 100) {
            securityLog.splice(0, securityLog.length - 100);
        }
        localStorage.setItem('dotkit_security_log', JSON.stringify(securityLog));
        // Можно отправить на сервер, если нужно
    }

    function getSecurityLog() {
        const stored = localStorage.getItem('dotkit_security_log');
        return stored ? JSON.parse(stored) : [];
    }

    function generateLogId() {
        return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // --- Логирование IP посетителей в Google Sheets ---
    async function recordVisitorIP() {
        try {
            const ip = await getUserIP();
            const lastIp = localStorage.getItem('last_ip');
            const lastTime = localStorage.getItem('last_ip_time');
            const now = Date.now();
            if (lastIp !== ip || !lastTime || now - +lastTime > 24*3600*1000) {
                if (window.googleSheetsManager && typeof window.googleSheetsManager.appendIP === 'function') {
                    await window.googleSheetsManager.appendIP(ip);
                }
                localStorage.setItem('last_ip', ip);
                localStorage.setItem('last_ip_time', now);
            }
        } catch (e) {}
    }

    // --- Остальные функции сайта ---
    function initTextAnimations() {/* ... */}
    function initParallaxEffects() {/* ... */}
    function initCurrentTime() {/* ... */}
});

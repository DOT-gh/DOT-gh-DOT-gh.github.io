/**
 * Admin panel for dotkit.me — версия для работы с Google Sheets
 * Админ-панель подключения к Google таблице (users/admins)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Кнопка загрузки пользователей и контейнер для вывода
    const loadBtn = document.getElementById('load-users-btn');
    if (loadBtn) loadBtn.onclick = loadIpList;
    // Можно сразу загружать по умолчанию, если нужно:
    // loadIpList();
});

async function loadIpList() {
    const listDiv = document.getElementById('ip-list-admin');
    listDiv.innerHTML = 'Загрузка...';
    try {
        // Получаем пользователей и админов из Google Sheets
        const users = await window.googleSheetsManager.fetchUsers();
        const admins = await window.googleSheetsManager.fetchAdmins();
        let html = '<table><tr><th>IP</th><th>Время</th><th>Имя</th><th>Действия</th></tr>';
        users.forEach(u => {
            html += `<tr>
                <td>${u.ip}${admins.includes(u.ip) ? ' <b>(admin)</b>' : ''}</td>
                <td>${u.datetime}</td>
                <td>${u.name || ''}</td>
                <td>
                    <button onclick="editUserName('${u.ip}', '${u.name ? u.name.replace(/'/g, "\\'") : ''}')">✏️ Подписать</button>
                    ${
                        admins.includes(u.ip) ? '' :
                        `<button onclick="makeAdmin('${u.ip}')">👑 Сделать админом</button>`
                    }
                </td>
            </tr>`;
        });
        html += '</table>';
        listDiv.innerHTML = html;
    } catch (e) {
        listDiv.innerHTML = 'Ошибка загрузки: ' + e;
    }
}

// Функции для подписывания и назначения админа
window.editUserName = async function(ip, oldName) {
    const name = prompt('Введите имя для этого IP', oldName || '');
    if (name !== null) {
        await window.googleSheetsManager.setUserName(ip, name);
        loadIpList();
    }
}

window.makeAdmin = async function(ip) {
    await window.googleSheetsManager.addAdminIP(ip);
    loadIpList();
}

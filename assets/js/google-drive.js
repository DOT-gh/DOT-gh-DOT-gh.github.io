// Google Sheets integration for dotkit.me (твоя таблица)

class GoogleSheetsManager {
    constructor() {
        this.clientId = '115487993351-ds8hl1mguldejp0qa5q6tfem27ik7r8o.apps.googleusercontent.com';
        this.apiKey = 'AIzaSyCvCEIIpya6Kzp3WLYRpHCJoODj3LfIfdM';
        this.sheetId = '1HMHOZyGivUuMzvVjeX_ctIpBOSlZrv7qpT5La_RGm9k';
        this.discoveryDocs = [
            "https://sheets.googleapis.com/$discovery/rest?version=v4"
        ];
        this.scope = "https://www.googleapis.com/auth/spreadsheets";
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        await this.loadGoogleAPI();
        await this.initGoogleClient();
        this.isInitialized = true;
    }

    async loadGoogleAPI() {
        return new Promise((resolve) => {
            if (window.gapi) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    async initGoogleClient() {
        await new Promise((resolve) => {
            gapi.load('client:auth2', resolve);
        });
        await gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            discoveryDocs: this.discoveryDocs,
            scope: this.scope
        });
    }

    async authorize() {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
            return authInstance.currentUser.get();
        }
        return await authInstance.signIn();
    }

    // Записать IP в таблицу users
    async appendIP(ip) {
        await this.init();
        await this.authorize();
        const now = new Date().toISOString();
        return gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: this.sheetId,
            range: "users!A:C",
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: [[ip, now, ""]]
            }
        });
    }

    // Получить всех пользователей
    async fetchUsers() {
        await this.init();
        await this.authorize();
        const resp = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range: "users!A:C"
        });
        // [{ip, datetime, name}]
        return (resp.result.values || []).map(row => ({
            ip: row[0] || '',
            datetime: row[1] || '',
            name: row[2] || ''
        })).filter(u => u.ip !== 'ip'); // убрать строку заголовков
    }

    // Обновить имя пользователя по IP
    async setUserName(ip, name) {
        await this.init();
        await this.authorize();
        // Сначала читаем все строки, ищем нужную
        const resp = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range: "users!A:C"
        });
        const rows = resp.result.values || [];
        let rowIndex = rows.findIndex(row => row[0] === ip);
        if (rowIndex < 0) return false;
        // Обновляем имя (столбец C)
        return gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: this.sheetId,
            range: `users!C${rowIndex+1}`,
            valueInputOption: "USER_ENTERED",
            resource: { values: [[name]] }
        });
    }

    // Получить список айпи админов
    async fetchAdmins() {
        await this.init();
        await this.authorize();
        const resp = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: this.sheetId,
            range: "admins!A:A"
        });
        return (resp.result.values || []).map(row => row[0]).filter(ip => ip !== 'ip'); // убрать заголовок
    }

    // Добавить айпи в список админов
    async addAdminIP(ip) {
        await this.init();
        await this.authorize();
        return gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: this.sheetId,
            range: "admins!A:A",
            valueInputOption: "USER_ENTERED",
            resource: { values: [[ip]] }
        });
    }
}

window.googleSheetsManager = new GoogleSheetsManager();

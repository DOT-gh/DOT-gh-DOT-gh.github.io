// Set up current time and date
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const yearElement = document.getElementById('current-year');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    if (yearElement) {
        yearElement.textContent = now.getFullYear();
    }
}

// Initialize the app
function initApp() {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute
    
    // Load user's viewing history from localStorage
    loadViewingHistory();
}

// Load and display user's viewing history
function loadViewingHistory() {
    const historyContainer = document.getElementById('history-items');
    if (!historyContainer) return;
    
    const history = JSON.parse(localStorage.getItem('viewingHistory')) || [];
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p class="empty-history">Здесь будет отображаться история просмотров</p>';
        return;
    }
    
    // Display last 6 items
    historyContainer.innerHTML = '';
    const recentItems = history.slice(0, 6);
    
    recentItems.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <a href="${item.url}">
                <div class="history-item-thumbnail" style="background-image: url('${item.thumbnail}')"></div>
                <p>${item.title}</p>
            </a>
        `;
        historyContainer.appendChild(historyItem);
    });
}

// Initialize once DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
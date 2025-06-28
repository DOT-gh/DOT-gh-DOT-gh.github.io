// User recognition based on IP address
const STORAGE_KEY_USER = 'user_data';

// Check if user exists in localStorage
function getUserData() {
    const userData = localStorage.getItem(STORAGE_KEY_USER);
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

// Get user's IP address
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to get IP address:', error);
        return null;
    }
}

// Initialize user data
async function initUserData() {
    const userNameElement = document.getElementById('user-name');
    if (!userNameElement) return;
    
    // Check if we have user data stored locally
    const existingUserData = getUserData();
    
    if (existingUserData) {
        userNameElement.textContent = existingUserData.name;
        return;
    }
    
    // Get user IP for new users
    const userIP = await getUserIP();
    if (!userIP) {
        userNameElement.textContent = 'Гость';
        return;
    }
    
    // Store new user with default name
    const newUserData = {
        ip: userIP,
        name: 'Гость', // Default name
        firstVisit: new Date().toISOString(),
        preferences: {
            movieCategories: [],
            recipeCategories: []
        }
    };
    
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUserData));
    userNameElement.textContent = newUserData.name;
}

// For admin functionality: update user name
function updateUserName(name) {
    const userData = getUserData();
    if (!userData) return false;
    
    userData.name = name;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = name;
    }
    
    return true;
}

// Initialize once DOM is loaded
document.addEventListener('DOMContentLoaded', initUserData);

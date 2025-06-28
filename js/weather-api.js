// Weather API integration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // You'll need to get this from OpenWeatherMap

// Get user's location from browser
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }),
                err => {
                    console.error('Geolocation error:', err);
                    resolve(getDefaultLocation()); // Fallback to default location
                }
            );
        } else {
            console.warn('Geolocation not supported');
            resolve(getDefaultLocation()); // Fallback to default location
        }
    });
}

// Default location (can be customized)
function getDefaultLocation() {
    return { lat: 50.45, lon: 30.52 }; // Kyiv, Ukraine
}

// Fetch weather data
async function fetchWeatherData() {
    try {
        const location = await getUserLocation();
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&lang=ru&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        displayWeatherError();
    }
}

// Update weather UI elements
function updateWeatherUI(data) {
    const tempDisplay = document.getElementById('current-temp');
    const conditionDisplay = document.getElementById('weather-condition');
    
    if (tempDisplay) {
        tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
    }
    
    if (conditionDisplay) {
        const condition = data.weather[0].description;
        conditionDisplay.textContent = condition.charAt(0).toUpperCase() + condition.slice(1);
        
        // Update weather icon based on condition code
        updateWeatherIcon(data.weather[0].id);
    }
}

// Update weather icon based on condition code
function updateWeatherIcon(conditionCode) {
    const iconElement = conditionDisplay.previousElementSibling;
    
    if (conditionCode >= 200 && conditionCode < 300) {
        iconElement.className = 'icon-thunderstorm';
    } else if (conditionCode >= 300 && conditionCode < 600) {
        iconElement.className = 'icon-rain';
    } else if (conditionCode >= 600 && conditionCode < 700) {
        iconElement.className = 'icon-snow';
    } else if (conditionCode >= 700 && conditionCode < 800) {
        iconElement.className = 'icon-mist';
    } else if (conditionCode === 800) {
        iconElement.className = 'icon-sun';
    } else {
        iconElement.className = 'icon-cloud';
    }
}

// Display weather error
function displayWeatherError() {
    const tempDisplay = document.getElementById('current-temp');
    const conditionDisplay = document.getElementById('weather-condition');
    
    if (tempDisplay) {
        tempDisplay.textContent = '--°C';
    }
    
    if (conditionDisplay) {
        conditionDisplay.textContent = 'Недоступно';
    }
}

// Fetch weather on page load
document.addEventListener('DOMContentLoaded', fetchWeatherData);

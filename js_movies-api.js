// Movies API integration using TheMovieDB API
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // You'll need to register at themoviedb.org

// Categories mapping
const CATEGORIES = {
    recommended: '',  // Will be personalized
    drama: 18,
    comedy: 35,
    detective: 9648,
    action: 28,
    animation: 16
};

let currentCategory = 'recommended';

// Fetch movies by category
async function fetchMovies(category) {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.innerHTML = '<div class="loading">Загрузка фильмов...</div>';
    
    try {
        let endpoint;
        
        if (category === 'recommended') {
            endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ru&sort_by=popularity.desc&vote_average.gte=7`;
        } else {
            const genreId = CATEGORIES[category];
            endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ru&with_genres=${genreId}`;
        }
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`Movie API error: ${response.status}`);
        }
        
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Failed to fetch movies:', error);
        moviesGrid.innerHTML = '<div class="error">Не удалось загрузить фильмы. Попробуйте позже.</div>';
    }
}

// Display movies in the grid
function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');
    
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<div class="no-results">Фильмы не найдены</div>';
        return;
    }
    
    moviesGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-card';
        
        // Create poster image with fallback
        const posterPath = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '../assets/no-poster.jpg';
        
        movieElement.innerHTML = `
            <div class="movie-poster" style="background-image: url('${posterPath}')"></div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                    <span class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</span>
                </div>
                <p class="movie-description">${movie.overview ? movie.overview.substring(0, 100) + '...' : 'Описание отсутствует'}</p>
                <button class="watch-button" data-id="${movie.id}">Смотреть</button>
            </div>
        `;
        
        moviesGrid.appendChild(movieElement);
    });
    
    // Add event listeners to watch buttons
    document.querySelectorAll('.watch-button').forEach(button => {
        button.addEventListener('click', () => openMoviePlayer(button.dataset.id));
    });
}

// Open movie player
function openMoviePlayer(movieId) {
    // In a real implementation, you might redirect to a player page
    // For GitHub Pages, we'll use a simple approach with YouTube integration
    
    // First, get movie details to find the title for YouTube search
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ru&append_to_response=videos`)
        .then(response => response.json())
        .then(movie => {
            if (movie.videos && movie.videos.results.length > 0) {
                // If the movie has official videos, use the first one
                const videoKey = movie.videos.results[0].key;
                window.open(`https://www.youtube.com/watch?v=${videoKey}`, '_blank');
            } else {
                // Otherwise search YouTube for the movie title
                const searchQuery = `${movie.title} ${movie.release_date.substring(0, 4)} фильм трейлер`;
                window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
            }
            
            // Add to viewing history
            addToViewingHistory({
                id: movie.id,
                title: movie.title,
                url: `./movie.html?id=${movie.id}`,
                thumbnail: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '../assets/no-poster.jpg',
                timestamp: new Date().toISOString()
            });
        })
        .catch(error => {
            console.error('Error opening movie:', error);
            alert('Не удалось открыть фильм. Попробуйте позже.');
        });
}

// Get a random movie
function getRandomMovie() {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ru&sort_by=popularity.desc&page=${Math.floor(Math.random() * 10) + 1}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                const randomMovie = data.results[randomIndex];
                openMoviePlayer(randomMovie.id);
            }
        })
        .catch(error => console.error('Error getting random movie:', error));
}

// Add movie to viewing history
function addToViewingHistory(movie) {
    let history = JSON.parse(localStorage.getItem('viewingHistory')) || [];
    
    // Remove duplicates
    history = history.filter(item => item.id !== movie.id);
    
    // Add to the beginning
    history.unshift(movie);
    
    // Keep only last 20 items
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    
    localStorage.setItem('viewingHistory', JSON.stringify(history));
}

// Initialize movies page
function initMoviesPage() {
    // Fetch initial movies
    fetchMovies(currentCategory);
    
    // Add event listeners to category buttons
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            fetchMovies(currentCategory);
        });
    });
    
    // Add event listener to random movie button
    const randomButton = document.querySelector('.random-movie-button');
    if (randomButton) {
        randomButton.addEventListener('click', getRandomMovie);
    }
}

// Initialize once DOM is loaded
document.addEventListener('DOMContentLoaded', initMoviesPage);
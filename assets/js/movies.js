/**
 * Movie management system for dotkit.me
 * Система управления фильмами
 */

class MovieManager {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.currentPage = 1;
        this.moviesPerPage = 12;
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadMovies();
        this.renderMovies();
    }

    async loadMovies() {
        // В реальном проекте здесь будет API для получения фильмов
        // Сейчас используем статический список для демонстрации
        this.movies = [
            {
                id: 1,
                title: "Зелена миля",
                originalTitle: "The Green Mile",
                year: 1999,
                genre: "drama",
                rating: 9.3,
                duration: "189 хв",
                poster: "https://via.placeholder.com/300x450/1e1e1e/ffffff?text=Зелена+миля",
                description: "Драма про тюремного наглядача та чоловіка з надприродними здібностями.",
                videoUrl: "https://example.com/movie1", // Здесь будет реальная ссылка
                trailer: "https://www.youtube.com/embed/Ki4haFrqSrw"
            },
            {
                id: 2,
                title: "Хто я?",
                originalTitle: "Who Am I?",
                year: 1998,
                genre: "action",
                rating: 6.8,
                duration: "108 хв",
                poster: "https://via.placeholder.com/300x450/1e1e1e/ffffff?text=Хто+я",
                description: "Бойовик з Джекі Чаном про втрату пам'яті та пошук себе.",
                videoUrl: "https://example.com/movie2",
                trailer: "https://www.youtube.com/embed/QWKav1UibQE"
            },
            {
                id: 3,
                title: "Маска",
                originalTitle: "The Mask",
                year: 1994,
                genre: "comedy",
                rating: 6.9,
                duration: "101 хв",
                poster: "https://via.placeholder.com/300x450/1e1e1e/ffffff?text=Маска",
                description: "Комедія про звичайного банківського службовця, який знаходить магічну маску.",
                videoUrl: "https://example.com/movie3",
                trailer: "https://www.youtube.com/embed/LZl69yk5lEY"
            }
            // Добавьте больше фильмов...
        ];

        this.filteredMovies = [...this.movies];
    }

    renderMovies() {
        const grid = document.getElementById('movies-grid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.moviesPerPage;
        const endIndex = startIndex + this.moviesPerPage;
        const moviesToShow = this.filteredMovies.slice(startIndex, endIndex);

        if (moviesToShow.length === 0) {
            grid.innerHTML = '<div class="no-movies">Фільми не знайдено</div>';
            return;
        }

        grid.innerHTML = moviesToShow.map(movie => `
            <div class="movie-card" onclick="movieManager.openMovie(${movie.id})">
                <div class="movie-poster">
                    <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                    <div class="movie-overlay">
                        <div class="play-btn">▶</div>
                        <div class="movie-rating">⭐ ${movie.rating}</div>
                    </div>
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p class="movie-year">${movie.year} • ${movie.duration}</p>
                    <p class="movie-description">${movie.description.substring(0, 80)}...</p>
                </div>
            </div>
        `).join('');

        this.renderPagination();
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredMovies.length / this.moviesPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Предыдущая страница
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="movieManager.goToPage(${this.currentPage - 1})">←</button>`;
        }

        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            const active = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="${active}" onclick="movieManager.goToPage(${i})">${i}</button>`;
        }

        // Следующая страница
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="movieManager.goToPage(${this.currentPage + 1})">→</button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    filterMovies(genre) {
        this.currentFilter = genre;
        this.currentPage = 1;

        if (genre === 'all') {
            this.filteredMovies = [...this.movies];
        } else {
            this.filteredMovies = this.movies.filter(movie => movie.genre === genre);
        }

        this.updateActiveTab(genre);
        this.renderMovies();
    }

    updateActiveTab(activeGenre) {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.textContent.toLowerCase().includes(activeGenre) || 
                (activeGenre === 'all' && tab.textContent === 'Всі')) {
                tab.classList.add('active');
            }
        });
    }

    searchMovies() {
        const searchInput = document.getElementById('movie-search');
        const query = searchInput.value.toLowerCase().trim();

        if (!query) {
            this.filteredMovies = [...this.movies];
        } else {
            this.filteredMovies = this.movies.filter(movie =>
                movie.title.toLowerCase().includes(query) ||
                movie.originalTitle.toLowerCase().includes(query) ||
                movie.description.toLowerCase().includes(query)
            );
        }

        this.currentPage = 1;
        this.renderMovies();
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderMovies();
        
        // Прокручиваем к началу списка фильмов
        document.querySelector('.movies-grid').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    openMovie(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (!movie) return;

        // Добавляем в историю просмотров
        if (window.ipAuth) {
            window.ipAuth.addToHistory(movie.title, `player.html?id=${movieId}`, movie.poster);
        }

        // Переходим к проигрывателю
        window.location.href = `player.html?id=${movieId}`;
    }

    // Методы для получения фильмов из различных источников
    async getMovieFromAPI(query) {
        // Здесь можно интегрировать различные API для получения фильмов
        // Например: TMDB API, OMDb API и другие
        
        try {
            // Пример с TMDB API (нужен API ключ)
            const apiKey = 'YOUR_TMDB_API_KEY';
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=uk-UA`
            );
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.warn('Ошибка получения фильмов из API:', error);
            return [];
        }
    }

    async getMovieStreamLinks(movieTitle, year) {
        // Здесь реализуется поиск ссылок на фильмы
        // ВНИМАНИЕ: Убедитесь, что используете только легальные источники!
        
        // Пример источников бесплатных фильмов:
        const sources = [
            'https://archive.org/details/movies', // Internet Archive
            'https://www.youtube.com/results?search_query=' + encodeURIComponent(movieTitle + ' ' + year + ' full movie'),
            // Добавьте другие легальные источники
        ];

        return sources;
    }
}

// Глобальные функции для использования в HTML
function filterMovies(genre) {
    if (window.movieManager) {
        window.movieManager.filterMovies(genre);
    }
}

function searchMovies() {
    if (window.movieManager) {
        window.movieManager.searchMovies();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.movieManager = new MovieManager();
    
    // Обработчик поиска по Enter
    const searchInput = document.getElementById('movie-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchMovies();
            }
        });
    }
});

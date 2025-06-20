// === Функціонал для динамічного завантаження новин ===

// Об'єкт з конфігурацією джерел новин
const newsConfig = {
    world: {
        title: 'Світові новини кібербезпеки',
        sources: [
            'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews',
            'https://api.rss2json.com/v1/api.json?rss_url=https://www.darkreading.com/rss_simple.asp',
            'https://api.rss2json.com/v1/api.json?rss_url=https://krebsonsecurity.com/feed/',
            'https://api.rss2json.com/v1/api.json?rss_url=https://www.bleepingcomputer.com/feed/'
        ],
        fallback: [
            {
                title: "Нова хвиля фішингових атак через електронну пошту",
                description: "Експерти попереджають про зростання кількості шахрайських листів, що імітують повідомлення від банків.",
                link: "phishing.html",
                source: "CyberSecure Аналітика"
            },
            {
                title: "Оновлення безпеки для смартфонів: будьте уважні",
                description: "Виробники випускають важливі оновлення. Не відкладайте їх встановлення для захисту мобільних пристроїв.",
                link: "#",
                source: "CyberSecure Поради"
            },
            {
                title: "Як створити надійну резервну копію важливих даних",
                description: "Покроковий посібник зі створення бекапів для захисту від вірусів-шифрувальників.",
                link: "#",
                source: "CyberSecure Інструкції"
            }
        ]
    },
    ukraine: {
        title: 'Українські новини кібербезпеки',
        sources: [
            'https://api.rss2json.com/v1/api.json?rss_url=https://detector.media/rss',
            'https://api.rss2json.com/v1/api.json?rss_url=https://cyber.kyiv.ua/feed/',
            'https://api.rss2json.com/v1/api.json?rss_url=https://cybersecurity.org.ua/feed/',
            'https://api.rss2json.com/v1/api.json?rss_url=https://ua.112.ua/rss/cybersecurity/'
        ],
        fallback: [
            {
                title: "Кіберзахист критичної інфраструктури України",
                description: "Огляд сучасних методів захисту енергетичних та транспортних систем від кібератак.",
                link: "#",
                source: "CyberSecurity Ukraine"
            },
            {
                title: "Новий закон про кібербезпеку в Україні",
                description: "Розбір ключових положень оновленого законодавства у сфері інформаційної безпеки.",
                link: "#",
                source: "Cyber Policy UA"
            },
            {
                title: "Тренінги з кібербезпеки для українських підприємств",
                description: "Безкоштовні курси від державних установ для підвищення рівня цифрової грамотності.",
                link: "#",
                source: "Digital Education UA"
            }
        ]
    }
};

// Поточний режим новин (за замовчуванням - світові)
let currentNewsMode = 'world';

// Функція для створення кнопок перемикання
function createNewsToggleButtons() {
    const newsSection = document.querySelector('.news-section');
    if (!newsSection) return;

    // Перевіряємо, чи кнопки вже створені
    if (newsSection.querySelector('.news-toggle-container')) return;

    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'news-toggle-container';
    toggleContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 15px 0;
        justify-content: center;
        flex-wrap: wrap;
    `;

    const worldBtn = document.createElement('button');
    worldBtn.className = 'news-toggle-btn active';
    worldBtn.textContent = '🌍 Світові новини';
    worldBtn.dataset.mode = 'world';

    const ukraineBtn = document.createElement('button');
    ukraineBtn.className = 'news-toggle-btn';
    ukraineBtn.textContent = '🇺🇦 Українські новини';
    ukraineBtn.dataset.mode = 'ukraine';

    // Стилі для кнопок
    const buttonStyle = `
        padding: 10px 20px;
        border: 2px solid #007bff;
        background: transparent;
        color: #007bff;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: 14px;
    `;

    const activeButtonStyle = `
        background: #007bff;
        color: white;
    `;

    worldBtn.style.cssText = buttonStyle + (currentNewsMode === 'world' ? activeButtonStyle : '');
    ukraineBtn.style.cssText = buttonStyle + (currentNewsMode === 'ukraine' ? activeButtonStyle : '');

    // Обробники кліків
    worldBtn.addEventListener('click', () => switchNewsMode('world'));
    ukraineBtn.addEventListener('click', () => switchNewsMode('ukraine'));

    // Hover ефекти
    [worldBtn, ukraineBtn].forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.background = '#e3f2fd';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'transparent';
            }
        });
    });

    toggleContainer.appendChild(worldBtn);
    toggleContainer.appendChild(ukraineBtn);

    // Вставляємо кнопки після заголовка
    const newsTitle = newsSection.querySelector('h2');
    if (newsTitle) {
        newsTitle.insertAdjacentElement('afterend', toggleContainer);
    }
}

// Функція перемикання режиму новин
function switchNewsMode(mode) {
    if (currentNewsMode === mode) return;

    currentNewsMode = mode;
    
    // Оновлюємо активну кнопку
    const buttons = document.querySelectorAll('.news-toggle-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = '#007bff';
        
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
            btn.style.background = '#007bff';
            btn.style.color = 'white';
        }
    });

    // Оновлюємо заголовок
    const newsTitle = document.querySelector('.news-section h2');
    if (newsTitle) {
        newsTitle.textContent = newsConfig[mode].title;
    }

    // Завантажуємо новини для обраного режиму
    loadCyberSecurityNews();
}

// Оновлена функція для отримання новин
async function loadCyberSecurityNews() {
    const newsContainer = document.querySelector('.news-grid');
    if (!newsContainer) {
        console.error('Елемент .news-grid не знайдено для новин.');
        return;
    }

    // Створюємо кнопки перемикання, якщо їх ще немає
    createNewsToggleButtons();

    // Показуємо індикатор завантаження
    newsContainer.innerHTML = '<div class="news-loading">Завантаження новин...</div>';

    try {
        const currentConfig = newsConfig[currentNewsMode];
        const allNews = [];
        
        // Отримуємо новини з джерел поточного режиму
        for (const url of currentConfig.sources) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.warn(`Помилка HTTP ${response.status} при завантаженні з ${url}`);
                    continue;
                }
                const data = await response.json();
                
                if (data.status === 'ok' && data.items) {
                    // Фільтруємо новини за ключовими словами кібербезпеки
                    const filteredItems = data.items.filter(item => 
                        isRelevantToSecurity(item.title + ' ' + item.description)
                    );
                    
                    const newsItems = filteredItems.slice(0, 2).map(item => ({
                        title: item.title,
                        description: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'Опис недоступний.',
                        link: item.link,
                        pubDate: new Date(item.pubDate),
                        source: data.feed.title || new URL(item.link).hostname
                    }));
                    allNews.push(...newsItems);
                }
            } catch (error) {
                console.warn(`Помилка завантаження з ${url}:`, error);
            }
        }
        
        if (allNews.length === 0) {
            console.warn('Не вдалося завантажити новини з RSS. Показуємо резервні.');
            showFallbackNews(newsContainer, currentConfig.fallback);
            updateLastRefreshTime(false);
            return;
        }

        // Сортуємо по даті
        allNews.sort((a, b) => b.pubDate - a.pubDate);
        const latestNews = allNews.slice(0, 3);
        
        // Відображаємо новини
        newsContainer.innerHTML = '';
        if (latestNews.length > 0) {
            latestNews.forEach(news => {
                const newsCard = createNewsCard(news);
                newsContainer.appendChild(newsCard);
            });
        } else {
            showFallbackNews(newsContainer, currentConfig.fallback);
        }
        
        updateLastRefreshTime(true);
        
    } catch (error) {
        console.error('Загальна помилка завантаження новин:', error);
        showFallbackNews(newsContainer, newsConfig[currentNewsMode].fallback);
        updateLastRefreshTime(false);
    }
}

// Функція перевірки релевантності новини до кібербезпеки
function isRelevantToSecurity(text) {
    const securityKeywords = [
        'cyber', 'security', 'hack', 'malware', 'phishing', 'ransomware', 
        'breach', 'vulnerability', 'attack', 'кібер', 'безпек', 'хак', 
        'вірус', 'фішинг', 'атак', 'захист', 'кіберзахист', 'інформаційна безпека'
    ];
    
    const lowerText = text.toLowerCase();
    return securityKeywords.some(keyword => lowerText.includes(keyword));
}

// Функція створення картки новини
function createNewsCard(news) {
    const article = document.createElement('article');
    article.className = 'news-card';
    
    const formattedDate = formatDate(news.pubDate);
    
    article.innerHTML = `
        <div class="news-date">${formattedDate}</div>
        <h3>${news.title || 'Без назви'}</h3>
        <p>${news.description || 'Опис відсутній.'}</p>
        ${news.source ? `<div class="news-source">Джерело: ${news.source}</div>` : ''}
        <a href="${news.link || '#'}" target="_blank" rel="noopener noreferrer" class="read-more">Читати далі →</a>
    `;
    
    return article;
}

// Функція форматування дати
function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Невідома дата';
    }
    const months = [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Оновлена функція резервних новин
function showFallbackNews(container, fallbackData) {
    const newsContainer = container || document.querySelector('.news-grid');
    if (!newsContainer) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const fallbackNews = fallbackData.map((news, index) => ({
        ...news,
        pubDate: index === 0 ? today : index === 1 ? yesterday : twoDaysAgo
    }));
    
    newsContainer.innerHTML = '';
    fallbackNews.forEach(news => {
        const newsCard = createNewsCard(news);
        newsContainer.appendChild(newsCard);
    });
}

// Функція оновлення часу останнього оновлення
function updateLastRefreshTime(success = true) {
    const newsSection = document.querySelector('.news-section');
    if (!newsSection) return;

    let refreshInfo = newsSection.querySelector('.news-refresh-info');
    if (!refreshInfo) {
        refreshInfo = document.createElement('div');
        refreshInfo.className = 'news-refresh-info';
        refreshInfo.style.cssText = `
            text-align: center;
            margin: 10px 0;
            font-size: 14px;
            color: #666;
        `;
        
        const toggleContainer = newsSection.querySelector('.news-toggle-container');
        if (toggleContainer) {
            toggleContainer.insertAdjacentElement('afterend', refreshInfo);
        } else {
            const newsTitle = newsSection.querySelector('h2');
            if (newsTitle) {
                newsTitle.insertAdjacentElement('afterend', refreshInfo);
            }
        }
    }
    
    const now = new Date();
    const statusMessage = success ? 
        `Останнє оновлення: ${formatDate(now)} о ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}` :
        `<span style="color: #ff6b68;">Не вдалося оновити. Показано резервні новини.</span>`;

    refreshInfo.innerHTML = `
        <p>
            ${statusMessage}
            <button onclick="loadCyberSecurityNews()" style="
                margin-left: 10px;
                padding: 5px 10px;
                border: 1px solid #007bff;
                background: transparent;
                color: #007bff;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
            " title="Оновити новини зараз">🔄 Оновити</button>
        </p>
    `;
}

// Завантажуємо новини при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadCyberSecurityNews, 500);
});

// Автоматичне оновлення кожні 30 хвилин
setInterval(loadCyberSecurityNews, 30 * 60 * 1000);

// === Решта існуючого коду залишається без змін ===

// Меню для мобільних пристроїв
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      nav.classList.toggle('show');
    });

    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        menuToggle.classList.remove('open');
        nav.classList.remove('show');
      }
    });
}

// Показ/приховування деталей
const learnMoreBtn = document.getElementById('learnMoreBtn');
const detailsSection = document.getElementById('detailsSection');
const closeDetailsBtn = document.getElementById('closeDetails');

if (learnMoreBtn && detailsSection && closeDetailsBtn) {
    learnMoreBtn.addEventListener('click', () => {
      detailsSection.classList.add('show');
      detailsSection.style.display = 'block'; 
      detailsSection.scrollIntoView({ behavior: 'smooth' });
    });

    closeDetailsBtn.addEventListener('click', () => {
      detailsSection.classList.remove('show');
      setTimeout(() => {
        if (!detailsSection.classList.contains('show')) {
            detailsSection.style.display = 'none';
        }
      }, 600); 
    });
}

// Тест безпеки
const questions = [
  {
    question: "Який з цих паролів є найбезпечнішим?",
    answers: [
      "123456",
      "password123",
      "P@ssw0rd!2025#Secure",
      "qwerty"
    ],
    correct: 2,
    explanation: "Безпечний пароль повинен містити великі та малі літери, цифри, спеціальні символи та бути достатньо довгим."
  },
  {
    question: "Що таке фішинг?",
    answers: [
      "Вид спорту",
      "Спроба отримати конфіденційну інформацію шляхом обману",
      "Вид комп'ютерної гри",
      "Програма для захисту від вірусів"
    ],
    correct: 1,
    explanation: "Фішинг - це спроба шахраїв отримати ваші персональні дані, паролі або фінансову інформацію шляхом обману."
  },
  {
    question: "Чи безпечно використовувати громадський Wi-Fi для онлайн-банкінгу?",
    answers: [
      "Так, завжди безпечно",
      "Ні, краще уникати",
      "Тільки вдень",
      "Тільки в кафе"
    ],
    correct: 1,
    explanation: "Громадські Wi-Fi мережі часто не захищені, тому краще уникати фінансових операцій через такі з'єднання."
  }
];

let currentQuestion = 0;
let correctAnswers = 0;

const startTestBtn = document.getElementById('startTest');
const testContainer = document.getElementById('testContainer');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const testResult = document.getElementById('testResult');
const nextQuestionBtn = document.getElementById('nextQuestion');

if (startTestBtn && testContainer && questionElement && answersElement && testResult && nextQuestionBtn) {
    startTestBtn.addEventListener('click', () => {
      startTestBtn.style.display = 'none';
      testContainer.style.display = 'block';
      loadTestQuestion();
    });

    nextQuestionBtn.addEventListener('click', () => {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        loadTestQuestion();
      } else {
        showFinalTestResult();
      }
    });
}

function loadTestQuestion() { 
  const q = questions[currentQuestion];
  const h3InQuestion = questionElement.querySelector('h3');
  if (h3InQuestion) {
    h3InQuestion.textContent = `Питання ${currentQuestion + 1}: ${q.question}`;
  }

  answersElement.innerHTML = '';
  q.answers.forEach((answer, index) => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="radio" name="answer" value="${index}">
      ${answer}
    `;
    answersElement.appendChild(label);
  });

  const radioButtons = answersElement.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', checkTestAnswer); 
  });

  testResult.style.display = 'none';
  nextQuestionBtn.style.display = 'none';
}

function checkTestAnswer(e) { 
  const selectedAnswer = parseInt(e.target.value);
  const q = questions[currentQuestion];

  const radioButtons = answersElement.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.disabled = true;
  });

  if (selectedAnswer === q.correct) {
    correctAnswers++;
    testResult.className = 'test-result correct';
    testResult.innerHTML = `
      <strong>✅ Правильно!</strong><br>
      ${q.explanation}
    `;
  } else {
    testResult.className = 'test-result incorrect';
    testResult.innerHTML = `
      <strong>❌ Неправильно!</strong><br>
      Правильна відповідь: ${q.answers[q.correct]}<br>
      ${q.explanation}
    `;
  }

  testResult.style.display = 'block';

  if (currentQuestion < questions.length - 1) {
    nextQuestionBtn.textContent = 'Наступне питання';
    nextQuestionBtn.style.display = 'inline-block';
  } else {
    nextQuestionBtn.textContent = 'Завершити тест';
    nextQuestionBtn.style.display = 'inline-block';
  }
}

function showFinalTestResult() { 
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  let message = '';
  let className = '';

  if (percentage >= 80) {
    message = 'Відмінно! Ви добре знаєте основи кібербезпеки.';
    className = 'correct';
  } else if (percentage >= 60) {
    message = 'Непогано! Рекомендуємо поглибити знання кібербезпеки.';
    className = 'correct';
  } else {
    message = 'Варто краще вивчити основи кібербезпеки для вашої безпеки.';
    className = 'incorrect';
  }

  questionElement.innerHTML = `
    <h3>Результати тесту</h3>
    <div class="test-result ${className}" style="display: block;">
      <strong>Ваш результат: ${correctAnswers} з ${questions.length} (${percentage}%)</strong><br>
      ${message}
    </div>
  `;

  answersElement.innerHTML = '';
  nextQuestionBtn.style.display = 'none';

  const retakeBtn = document.createElement('button');
  retakeBtn.className = 'btn secondary';
  retakeBtn.textContent = 'Пройти тест знову';
  retakeBtn.style.marginTop = '20px';
  retakeBtn.addEventListener('click', () => {
    currentQuestion = 0;
    correctAnswers = 0;
    testContainer.style.display = 'none';
    startTestBtn.style.display = 'inline-block';
    
    questionElement.innerHTML = `<h3>Питання завантажується...</h3><div class="answers" id="answers"></div>`;
    document.getElementById('answers').innerHTML = '';
    testResult.style.display = 'none';
  });
  
  if (questionElement) {
      questionElement.appendChild(retakeBtn);
  }
}

// Плавна прокрутка для якірних посилань
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId.length > 1 && targetId !== '#') { 
        try {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
        } catch (error) {
            console.warn(`Не вдалося знайти елемент для плавної прокрутки: ${targetId}`, error);
        }
    }
  });
});

// Анімація появи елементів при прокрутці
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

document.querySelectorAll('.news-card, .quick-link-card, .stat-item').forEach(el => {
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  }
});
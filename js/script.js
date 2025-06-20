document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  // Змінні для DOM-елементів
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  const detailsSection = document.getElementById('detailsSection');
  const closeDetailsBtn = document.getElementById('closeDetails');
  const startTestBtn = document.getElementById('startTest');
  const testContainer = document.getElementById('testContainer');
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const testResultElement = document.getElementById('testResult');
  const nextQuestionBtn = document.getElementById('nextQuestion');
  
  // Перевірка, чи є пристрій iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // Додаємо клас для iOS-пристроїв
  if (isIOS) {
    document.body.classList.add('ios-device');
  }
  
  // Додаємо клас для тач-пристроїв
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
  
  // Функція для блокування прокрутки сторінки
  function lockBodyScroll() {
    if (isIOS) {
      // Для iOS зберігаємо поточну позицію прокрутки
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Функція для розблокування прокрутки сторінки
  function unlockBodyScroll() {
    if (isIOS) {
      // Для iOS відновлюємо позицію прокрутки
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // Мобільне меню
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('open');
      nav.classList.toggle('show');
      
      if (nav.classList.contains('show')) {
        lockBodyScroll();
      } else {
        unlockBodyScroll();
      }
    });
    
    // Закриття меню при кліку на посилання
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('open');
        nav.classList.remove('show');
        unlockBodyScroll();
      });
    });
    
    // Закриття меню при кліку поза меню
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('show')) {
        menuToggle.classList.remove('open');
        nav.classList.remove('show');
        unlockBodyScroll();
      }
    });
  }
  
  // Секція з деталями
  if (learnMoreBtn && detailsSection && closeDetailsBtn) {
    learnMoreBtn.addEventListener('click', function() {
      detailsSection.classList.add('show');
      lockBodyScroll();
    });
    
    closeDetailsBtn.addEventListener('click', function() {
      detailsSection.classList.remove('show');
      unlockBodyScroll();
    });
    
    // Закриття деталей при кліку на фон
    detailsSection.addEventListener('click', function(e) {
      if (e.target === detailsSection) {
        detailsSection.classList.remove('show');
        unlockBodyScroll();
      }
    });
    
    // Закриття деталей при натисканні Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && detailsSection.classList.contains('show')) {
        detailsSection.classList.remove('show');
        unlockBodyScroll();
      }
    });
  }
  
  // Завантаження новин з кібербезпеки
  function loadNews() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    const loadingElement = document.createElement('div');
    loadingElement.className = 'news-loading';
    loadingElement.innerHTML = 'Завантаження новин... <div class="loading-spinner"></div>';
    
    newsGrid.innerHTML = '';
    newsGrid.appendChild(loadingElement);
    
    // Імітація завантаження даних з API
    setTimeout(function() {
      const newsData = [
        {
          title: 'Нова кібератака на критичну інфраструктуру',
          date: '10 червня 2025',
          description: 'Експерти виявили нову хвилю атак на системи водопостачання та електромережі в кількох країнах. Хакери використовують вразливості у застарілому програмному забезпеченні.',
          link: '#'
        },
        {
          title: 'Уряд посилює законодавство про кіберзахист',
          date: '5 червня 2025',
          description: 'Парламент ухвалив новий закон, що збільшує відповідальність за кіберзлочини та посилює захист персональних даних громадян від несанкціонованого доступу.',
          link: '#'
        },
        {
          title: 'Масштабний витік даних у популярному сервісі',
          date: '1 червня 2025',
          description: 'Більше 10 мільйонів користувачів постраждали від витоку особистої інформації через вразливість у системі безпеки. Компанія вже розпочала внутрішнє розслідування.',
          link: '#'
        }
      ];
      
      newsGrid.innerHTML = '';
      
      if (newsData.length === 0) {
        const noNewsElement = document.createElement('div');
        noNewsElement.className = 'news-error';
        noNewsElement.textContent = 'На жаль, новини відсутні. Спробуйте пізніше.';
        newsGrid.appendChild(noNewsElement);
      } else {
        newsData.forEach(news => {
          const newsCard = document.createElement('div');
          newsCard.className = 'news-card';
          
          newsCard.innerHTML = `
            <div class="news-date">${news.date}</div>
            <h3>${news.title}</h3>
            <p>${news.description}</p>
            <a href="${news.link}" class="read-more">Читати далі</a>
          `;
          
          newsGrid.appendChild(newsCard);
        });
      }
    }, 1500);
  }
  
  // Викликаємо функцію завантаження новин
  loadNews();
  
  // Тест з кібербезпеки
  if (startTestBtn && testContainer && questionElement && answersElement && testResultElement) {
    // Питання для тесту
    const questions = [
      {
        question: 'Який з наступних паролів є найбільш надійним?',
        answers: [
          { text: 'password123', correct: false },
          { text: 'P@$$w0rd2025!', correct: true },
          { text: '12345678', correct: false },
          { text: 'mybirthday1990', correct: false }
        ]
      },
      {
        question: 'Що таке фішинг?',
        answers: [
          { text: 'Вид спортивної риболовлі', correct: false },
          { text: 'Вірус, який шифрує файли на комп\'ютері', correct: false },
          { text: 'Техніка обману для отримання конфіденційної інформації', correct: true },
          { text: 'Програма для блокування реклами', correct: false }
        ]
      },
      {
        question: 'Яка з цих дій підвищує безпеку вашого облікового запису?',
        answers: [
          { text: 'Використання однакового пароля для всіх акаунтів', correct: false },
          { text: 'Зберігання пароля в текстовому документі на робочому столі', correct: false },
          { text: 'Встановлення двофакторної автентифікації', correct: true },
          { text: 'Повідомлення пароля друзям для допомоги у надзвичайних ситуаціях', correct: false }
        ]
      },
      {
        question: 'Що означає абревіатура VPN?',
        answers: [
          { text: 'Viral Protection Network', correct: false },
          { text: 'Virtual Private Network', correct: true },
          { text: 'Verified Personal Navigator', correct: false },
          { text: 'Visual Processing Node', correct: false }
        ]
      },
      {
        question: 'Як найкраще захистити свою домашню Wi-Fi мережу?',
        answers: [
          { text: 'Використовувати шифрування WEP', correct: false },
          { text: 'Залишити мережу відкритою для швидкого доступу', correct: false },
          { text: 'Використовувати шифрування WPA3 і складний пароль', correct: true },
          { text: 'Вимикати маршрутизатор, коли не користуєтесь інтернетом', correct: false }
        ]
      }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    
    // Запуск тесту
    startTestBtn.addEventListener('click', function() {
      this.style.display = 'none';
      testContainer.style.display = 'block';
      showQuestion(currentQuestionIndex);
      window.scrollTo({
        top: testContainer.offsetTop - 50,
        behavior: 'smooth'
      });
    });
    
    // Відображення питання
    function showQuestion(index) {
      const question = questions[index];
      questionElement.innerHTML = `<h3>${question.question}</h3>`;
      answersElement.innerHTML = '';
      
      question.answers.forEach((answer, i) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        
        button.addEventListener('click', function() {
          selectAnswer(answer, button);
        });
        
        answersElement.appendChild(button);
      });
      
      nextQuestionBtn.style.display = 'none';
      testResultElement.style.display = 'none';
    }
    
    // Вибір відповіді
    function selectAnswer(answer, selectedButton) {
      const answerButtons = document.querySelectorAll('.answer-btn');
      
      // Блокуємо всі кнопки
      answerButtons.forEach(button => {
        button.disabled = true;
      });
      
      // Показуємо правильну відповідь
      answerButtons.forEach(button => {
        const answerIndex = Array.from(answerButtons).indexOf(button);
        const currentAnswer = questions[currentQuestionIndex].answers[answerIndex];
        
        if (currentAnswer.correct) {
          button.classList.add('correct-answer');
        }
      });
      
      // Показуємо результат відповіді
      if (answer.correct) {
        selectedButton.classList.add('correct-answer');
        testResultElement.className = 'test-result correct';
        testResultElement.textContent = 'Правильно! Чудова робота!';
        score++;
      } else {
        selectedButton.classList.add('wrong-answer');
        testResultElement.className = 'test-result incorrect';
        testResultElement.textContent = 'На жаль, це неправильна відповідь.';
      }
      
      testResultElement.style.display = 'block';
      
      // Перевіряємо, чи є ще питання
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestionBtn.textContent = 'Наступне питання';
        nextQuestionBtn.style.display = 'inline-block';
      } else {
        nextQuestionBtn.textContent = 'Завершити тест';
        nextQuestionBtn.style.display = 'inline-block';
      }
    }
    
    // Перехід до наступного питання
    nextQuestionBtn.addEventListener('click', function() {
      currentQuestionIndex++;
      
      if (currentQuestionIndex < questions.length) {
        showQuestion(currentQuestionIndex);
      } else {
        // Показуємо фінальний результат
        questionElement.innerHTML = `<h3>Ваш результат: ${score} з ${questions.length}</h3>`;
        answersElement.innerHTML = '';
        
        const percentage = (score / questions.length) * 100;
        let message;
        
        if (percentage === 100) {
          message = 'Відмінно! Ви справжній експерт з кібербезпеки!';
          testResultElement.className = 'test-result success';
        } else if (percentage >= 70) {
          message = 'Добре! Ви маєте хороші знання з кібербезпеки.';
          testResultElement.className = 'test-result success';
        } else if (percentage >= 50) {
          message = 'Непогано, але варто дізнатися більше про кібербезпеку.';
          testResultElement.className = 'test-result success';
        } else {
          message = 'Рекомендуємо приділити більше уваги вивченню основ кібербезпеки.';
          testResultElement.className = 'test-result error';
        }
        
        testResultElement.textContent = message;
        testResultElement.style.display = 'block';
        
        // Кнопка "Спробувати ще раз"
        nextQuestionBtn.textContent = 'Спробувати ще раз';
        nextQuestionBtn.style.display = 'inline-block';
        
        // Починаємо тест заново при натисканні "Спробувати ще раз"
        nextQuestionBtn.onclick = function() {
          currentQuestionIndex = 0;
          score = 0;
          showQuestion(0);
          this.onclick = null; // Скидаємо обробник
        };
      }
      
      // Прокручуємо до верхньої частини контейнера тесту
      window.scrollTo({
        top: testContainer.offsetTop - 50,
        behavior: 'smooth'
      });
    });
  }
  
  // Плавна прокрутка для всіх внутрішніх посилань
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Закриваємо мобільне меню, якщо воно відкрите
        if (nav.classList.contains('show')) {
          menuToggle.classList.remove('open');
          nav.classList.remove('show');
          unlockBodyScroll();
        }
        
        // Прокручуємо до елемента
        window.scrollTo({
          top: targetElement.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Відстеження активного розділу при прокручуванні
  window.addEventListener('scroll', function() {
    // Реалізація за необхідності
  });
  
  // Індикатор прогресу прокрутки сторінки
  function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / totalScroll) * 100;
    scrollProgress.style.width = `${scrolled}%`;
  }
  
  window.addEventListener('scroll', updateScrollProgress);
  
  // Анімація появи елементів при прокручуванні
  function handleScrollAnimations() {
    const animElements = document.querySelectorAll('.anim-fade-in, .anim-slide-up');
    
    animElements.forEach(elem => {
      const elemTop = elem.getBoundingClientRect().top;
      const elemBottom = elem.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      if (elemTop < windowHeight * 0.9 && elemBottom > 0) {
        elem.classList.add('visible');
      } else {
        // Якщо вимкнути цей рядок, елементи будуть залишатися видимими після першої появи
        // elem.classList.remove('visible');
      }
    });
  }
  
  window.addEventListener('scroll', handleScrollAnimations);
  window.addEventListener('resize', handleScrollAnimations);
  
  // Викликаємо функцію для початкового відображення анімацій
  setTimeout(handleScrollAnimations, 100);
  
  // Обробка помилок для зображень
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.src = 'images/fallback-image.svg'; // Запасне зображення
      this.alt = 'Зображення недоступне';
    });
  });
  
  // Додамо tracker для подій аналітики
  function trackEvent(category, action, label) {
    // Тут можна підключити реальну аналітику, наприклад Google Analytics
    console.log(`Analytics event: ${category} - ${action} - ${label}`);
  }
  
  // Відстеження кліків на основних елементах
  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('click', function() {
      const label = this.textContent.trim() || this.getAttribute('aria-label') || 'Нерозпізнаний елемент';
      const category = this.closest('section') ? this.closest('section').className : 'Загальне';
      trackEvent(category, 'Клік', label);
    });
  });
});

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
    const loadingElement = document.createElement('div');
    loadingElement.className = 'news-loading';
    loadingElement.innerHTML = 'Завантаження новин... <div class="loading-spinner"></div>';
    
    if (newsGrid) {
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
          { text: 'Qwerty2023', correct: false },
          { text: 'P@ssw0rd!', correct: false },
          { text: 'k8L#7pR$2vX9!mB', correct: true }
        ]
      },
      {
        question: 'Що таке фішинг?',
        answers: [
          { text: 'Вид спорту, пов\'язаний з риболовлею', correct: false },
          { text: 'Метод шахрайства для крадіжки особистих даних', correct: true },
          { text: 'Тип комп\'ютерного вірусу', correct: false },
          { text: 'Процес відновлення видалених файлів', correct: false }
        ]
      },
      {
        question: 'Яка з наступних дій є найбезпечнішою при користуванні публічною Wi-Fi мережею?',
        answers: [
          { text: 'Вхід в інтернет-банкінг без додаткового захисту', correct: false },
          { text: 'Використання VPN для шифрування трафіку', correct: true },
          { text: 'Відправка конфіденційних документів через електронну пошту', correct: false },
          { text: 'Зберігання паролів у браузері', correct: false }
        ]
      }
    ];
    
    let currentQuestionIndex = 0;
    let score = 0;
    
    // Початок тесту
    startTestBtn.addEventListener('click', function() {
      currentQuestionIndex = 0;
      score = 0;
      testContainer.style.display = 'block';
      startTestBtn.style.display = 'none';
      showQuestion();
    });
    
    // Показати питання
    function showQuestion() {
      const question = questions[currentQuestionIndex];
      questionElement.querySelector('h3').textContent = question.question;
      answersElement.innerHTML = '';
      testResultElement.style.display = 'none';
      
      question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answersElement.appendChild(button);
      });
      
      nextQuestionBtn.style.display = 'none';
    }
    
    // Вибір відповіді
    function selectAnswer(e) {
      const selectedButton = e.target;
      const isCorrect = selectedButton.dataset.correct === 'true';
      
      // Додаємо відповідний клас до обраної відповіді
      if (isCorrect) {
        selectedButton.classList.add('correct-answer');
        testResultElement.textContent = 'Правильно! 👍';
        testResultElement.className = 'test-result correct';
        score++;
      } else {
        selectedButton.classList.add('wrong-answer');
        testResultElement.textContent = 'Неправильно! ❌';
        testResultElement.className = 'test-result incorrect';
        
        // Показуємо правильну відповідь
        document.querySelectorAll('.answer-btn').forEach(btn => {
          if (btn.dataset.correct === 'true') {
            btn.classList.add('correct-answer');
          }
        });
      }
      
      // Вимикаємо всі кнопки
      document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
        btn.removeEventListener('click', selectAnswer);
      });
      
      testResultElement.style.display = 'block';
      
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestionBtn.textContent = 'Наступне питання';
        nextQuestionBtn.style.display = 'inline-block';
      } else {
        nextQuestionBtn.textContent = 'Показати результат';
        nextQuestionBtn.style.display = 'inline-block';
      }
    }
    
    // Наступне питання або показ результатів
    nextQuestionBtn.addEventListener('click', function() {
      currentQuestionIndex++;
      
      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        showResult();
      }
    });
    
    // Показати результат тесту
    function showResult() {
      answersElement.innerHTML = '';
      questionElement.querySelector('h3').textContent = `Ваш результат: ${score} з ${questions.length}`;
      
      let resultMessage = '';
      let resultClass = '';
      
      if (score === questions.length) {
        resultMessage = 'Відмінно! Ви чудово знаєте основи кібербезпеки! 🏆';
        resultClass = 'correct';
      } else if (score >= questions.length / 2) {
        resultMessage = 'Непогано! Але є над чим попрацювати. 👍';
        resultClass = 'correct';
      } else {
        resultMessage = 'Варто більше дізнатися про кібербезпеку. Перегляньте наші ресурси! 📚';
        resultClass = 'incorrect';
      }
      
      testResultElement.textContent = resultMessage;
      testResultElement.className = `test-result ${resultClass}`;
      testResultElement.style.display = 'block';
      
      nextQuestionBtn.style.display = 'none';
      startTestBtn.textContent = 'Пройти тест ще раз';
      startTestBtn.style.display = 'inline-block';
    }
  }
  
  // Плавна прокрутка для якірних посилань
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Додаткові оптимізації для iOS
  if (isIOS) {
    // Виправлення для 100vh на iOS
    function setVhVariable() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVhVariable();
    window.addEventListener('resize', setVhVariable);
    
    // Покращення обробки дотиків для iOS
    document.querySelectorAll('button, a, .quick-link-card, .news-card').forEach(element => {
      element.addEventListener('touchstart', function() {}, {passive: true});
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Отримуємо всі кнопки вкладок та контент вкладок
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Перевіряємо, чи існують елементи на сторінці
  if (tabButtons.length === 0 || tabContents.length === 0) {
    // Якщо елементів немає, значить скрипт викликаний на неправильній сторінці
    return;
  }
  
  // Додаємо обробник подій для всіх кнопок вкладок
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Отримуємо значення атрибуту data-tab
      const targetTab = this.getAttribute('data-tab');
      
      // Видаляємо клас 'active' з усіх кнопок вкладок
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Додаємо клас 'active' для натиснутої кнопки
      this.classList.add('active');
      
      // Ховаємо всі контенти вкладок
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Показуємо потрібний контент вкладки
      const targetContent = document.getElementById(`${targetTab}-content`);
      if (targetContent) {
        targetContent.classList.add('active');
        
        // Анімація появи вмісту вкладки
        targetContent.style.opacity = '0';
        targetContent.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          targetContent.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
          targetContent.style.opacity = '1';
          targetContent.style.transform = 'translateY(0)';
        }, 10);
      }
      
      // Зберігаємо активну вкладку в локальне сховище
      localStorage.setItem('activeSocialMediaTab', targetTab);
    });
  });
  
  // Перевіряємо, чи є збережена вкладка в локальному сховищі
  const savedTab = localStorage.getItem('activeSocialMediaTab');
  if (savedTab) {
    // Знаходимо кнопку із збереженим значенням вкладки
    const savedButton = document.querySelector(`.tab-btn[data-tab="${savedTab}"]`);
    if (savedButton) {
      // Імітуємо клік на збережену вкладку
      savedButton.click();
    } else {
      // Якщо збережена вкладка не існує, клікаємо на першу вкладку
      tabButtons[0].click();
    }
  } else {
    // Якщо немає збереженої вкладки, клікаємо на першу вкладку
    tabButtons[0].click();
  }
  
  // Додаємо додаткові стилі для вкладок на мобільних пристроях
  function adjustTabsForMobile() {
    const tabsNav = document.querySelector('.tabs-nav');
    if (!tabsNav) return;
    
    if (window.innerWidth <= 768) {
      // Для мобільних пристроїв робимо прокрутку вкладок
      tabsNav.style.overflowX = 'auto';
      tabsNav.style.whiteSpace = 'nowrap';
      tabsNav.style.webkitOverflowScrolling = 'touch';
      
      // Додаємо індикатор прокрутки для користувачів
      if (!document.querySelector('.scroll-hint')) {
        const scrollHint = document.createElement('div');
        scrollHint.className = 'scroll-hint';
        scrollHint.innerHTML = '← прокрутіть →';
        scrollHint.style.textAlign = 'center';
        scrollHint.style.fontSize = '0.8rem';
        scrollHint.style.color = 'var(--color-text-dark)';
        scrollHint.style.padding = '5px 0';
        tabsNav.parentNode.insertBefore(scrollHint, tabsNav.nextSibling);
        
        // Приховуємо підказку після прокрутки
        tabsNav.addEventListener('scroll', function() {
          scrollHint.style.opacity = '0.5';
          
          // Приховуємо підказку через 2 секунди
          setTimeout(() => {
            scrollHint.style.display = 'none';
          }, 2000);
        });
      }
    } else {
      // Для десктопних пристроїв повертаємо звичайний режим
      tabsNav.style.overflowX = '';
      tabsNav.style.whiteSpace = '';
      
      // Видаляємо індикатор прокрутки, якщо він є
      const scrollHint = document.querySelector('.scroll-hint');
      if (scrollHint) {
        scrollHint.remove();
      }
    }
  }
  
  // Викликаємо функцію при завантаженні та при зміні розміру вікна
  adjustTabsForMobile();
  window.addEventListener('resize', adjustTabsForMobile);
  
  // Додаємо функціонал глобального пошуку в інструкціях
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'security-search';
  searchInput.placeholder = 'Пошук в інструкціях...';
  searchInput.style.width = '100%';
  searchInput.style.padding = '10px 15px';
  searchInput.style.marginBottom = '20px';
  searchInput.style.borderRadius = 'var(--radius-small)';
  searchInput.style.border = '1px solid rgba(255, 65, 108, 0.3)';
  searchInput.style.background = 'rgba(255, 255, 255, 0.1)';
  searchInput.style.color = 'var(--color-text)';
  searchInput.style.fontSize = '1rem';
  
  // Вставляємо поле пошуку перед табами
  const tabsContainer = document.querySelector('.sm-security-tabs');
  if (tabsContainer) {
    tabsContainer.insertBefore(searchInput, tabsContainer.firstChild);
    
    // Додаємо обробник для пошуку
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      if (searchTerm.length < 2) {
        // Якщо пошуковий запит короткий, показуємо всі кроки
        document.querySelectorAll('.step').forEach(step => {
          step.style.display = '';
          step.classList.remove('search-highlight');
        });
        return;
      }
      
      // Шукаємо в усіх вкладках
      document.querySelectorAll('.tab-content').forEach(tab => {
        // Забезпечуємо видимість вкладки для пошуку
        const wasActive = tab.classList.contains('active');
        if (!wasActive) {
          tab.style.display = 'block';
          tab.style.height = 'auto';
          tab.style.overflow = 'visible';
          tab.style.opacity = '1';
        }
        
        // Шукаємо в кроках
        let hasMatches = false;
        const steps = tab.querySelectorAll('.step');
        
        steps.forEach(step => {
          const stepContent = step.textContent.toLowerCase();
          if (stepContent.includes(searchTerm)) {
            step.style.display = '';
            step.classList.add('search-highlight');
            hasMatches = true;
          } else {
            step.style.display = 'none';
            step.classList.remove('search-highlight');
          }
        });
        
        // Показуємо вкладку, якщо є збіги
        if (hasMatches) {
          // Активуємо вкладку, якщо знайдено збіги і немає активної вкладки зі збігами
          const activeTabWithMatches = document.querySelector('.tab-content.active .search-highlight');
          if (!activeTabWithMatches) {
            // Знаходимо відповідну кнопку вкладки
            const tabId = tab.id.replace('-content', '');
            const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
            if (tabButton) {
              tabButton.click();
            }
          }
        }
        
        // Повертаємо попередній стан неактивних вкладок
        if (!wasActive && !tab.classList.contains('active')) {
          tab.style.display = '';
          tab.style.height = '';
          tab.style.overflow = '';
          tab.style.opacity = '';
        }
      });
    });
  }
  
  // Додаємо іконки для платформ у вкладках
  const platformIcons = {
    'facebook': '👤',
    'instagram': '📷',
    'twitter': '🐦',
    'telegram': '✈️'
  };
  
  tabButtons.forEach(button => {
    const platform = button.getAttribute('data-tab');
    if (platformIcons[platform]) {
      button.innerHTML = `${platformIcons[platform]} ${button.textContent}`;
    }
  });
});

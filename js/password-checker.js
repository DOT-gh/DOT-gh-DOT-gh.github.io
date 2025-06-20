document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Отримуємо необхідні DOM-елементи
  const passwordInput = document.getElementById('passwordInput');
  const togglePassword = document.getElementById('togglePassword');
  const checkPasswordBtn = document.getElementById('checkPasswordBtn');
  const passwordStrength = document.getElementById('passwordStrength');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const strengthFeedback = document.getElementById('strengthFeedback');

  // Перевіряємо, чи існують елементи на сторінці
  if (!passwordInput || !togglePassword || !checkPasswordBtn || !passwordStrength || !strengthBar || !strengthText || !strengthFeedback) {
    // Якщо елементів немає, значить скрипт викликаний на неправильній сторінці
    return;
  }

  // Переключення видимості пароля
  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  });

  // Перевірка надійності пароля
  checkPasswordBtn.addEventListener('click', checkPasswordStrength);

  // Також перевіряємо пароль при натисканні Enter
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkPasswordStrength();
    }
  });

  // Функція перевірки надійності пароля
  function checkPasswordStrength() {
    const password = passwordInput.value;
    
    if (!password) {
      alert('Будь ласка, введіть пароль для перевірки');
      return;
    }

    // Критерії перевірки
    const length = password.length;
    const hasLowercase = /[a-zа-яґєії]/.test(password);
    const hasUppercase = /[A-ZА-ЯҐЄІЇ]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const hasCommonWords = commonPasswordCheck(password);
    const hasSequence = sequenceCheck(password);
    
    // Підрахунок балів надійності (максимум 100)
    let score = 0;
    let feedbackItems = [];
    
    // Бали за довжину (до 40 балів)
    if (length >= 20) score += 40;
    else if (length >= 16) score += 35;
    else if (length >= 12) score += 25;
    else if (length >= 8) score += 15;
    else score += 5;
    
    // Бали за різні типи символів (до 40 балів)
    if (hasLowercase) score += 10;
    else feedbackItems.push('Додайте малі літери для підвищення надійності');
    
    if (hasUppercase) score += 10;
    else feedbackItems.push('Додайте великі літери для підвищення надійності');
    
    if (hasDigits) score += 10;
    else feedbackItems.push('Додайте цифри для підвищення надійності');
    
    if (hasSpecial) score += 10;
    else feedbackItems.push('Додайте спеціальні символи (@, #, $, % тощо) для підвищення надійності');
    
    // Штрафи за поширені паролі та послідовності (до -30 балів)
    if (hasCommonWords) {
      score -= 20;
      feedbackItems.push('Пароль містить поширені слова або комбінації, спробуйте уникати цього');
    }
    
    if (hasSequence) {
      score -= 10;
      feedbackItems.push('Уникайте послідовностей символів (abc, 123, qwerty тощо)');
    }
    
    // Мінімальний бал - 5
    score = Math.max(5, score);
    
    // Встановлюємо рівень надійності та відгук
    let strengthLevel = '';
    let strengthColor = '';
    
    if (score >= 80) {
      strengthLevel = 'Дуже надійний';
      strengthColor = 'var(--color-success)';
      if (feedbackItems.length === 0)
        feedbackItems.push('Чудовий пароль! Він є достатньо надійним для захисту ваших даних.');
    } else if (score >= 60) {
      strengthLevel = 'Надійний';
      strengthColor = '#4caf50';
      if (feedbackItems.length === 0)
        feedbackItems.push('Хороший пароль, але його можна ще покращити.');
    } else if (score >= 40) {
      strengthLevel = 'Середній';
      strengthColor = '#ff9800';
      if (feedbackItems.length === 0)
        feedbackItems.push('Цей пароль забезпечує базовий захист, але рекомендуємо його посилити.');
    } else if (score >= 20) {
      strengthLevel = 'Слабкий';
      strengthColor = '#ff5722';
      if (feedbackItems.length === 0)
        feedbackItems.push('Цей пароль занадто слабкий для важливих акаунтів.');
    } else {
      strengthLevel = 'Дуже слабкий';
      strengthColor = 'var(--color-error)';
      if (feedbackItems.length === 0)
        feedbackItems.push('Цей пароль можна легко підібрати. Настійно рекомендуємо створити новий.');
    }
    
    // Відображення результатів
    strengthBar.style.width = `${score}%`;
    strengthBar.style.backgroundColor = strengthColor;
    strengthText.textContent = `${strengthLevel} (${score}/100)`;
    strengthText.style.color = strengthColor;
    
    // Відображення списку рекомендацій
    strengthFeedback.innerHTML = '';
    feedbackItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      strengthFeedback.appendChild(li);
    });
    
    // Показуємо результат
    passwordStrength.style.display = 'block';
    
    // Анімація появи результатів
    passwordStrength.style.opacity = '0';
    passwordStrength.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      passwordStrength.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
      passwordStrength.style.opacity = '1';
      passwordStrength.style.transform = 'translateY(0)';
    }, 10);
  }

  // Перевірка на поширені паролі та шаблони
  function commonPasswordCheck(password) {
    const lowercasePassword = password.toLowerCase();
    
    // Список найпоширеніших паролів та шаблонів
    const commonPatterns = [
      'password', 'пароль', 'admin', 'адмін', 'qwerty', 'йцукен',
      '123456', '12345678', 'abc123', 'welcome', 'привіт', 'iloveyou',
      'letmein', 'monkey', 'sunshine', 'dragon', 'baseball', 'football',
      'master', 'login', 'shadow', 'qazwsx', 'trustno1'
    ];
    
    // Перевіряємо, чи містить пароль хоча б один із поширених шаблонів
    for (const pattern of commonPatterns) {
      if (lowercasePassword.includes(pattern)) {
        return true;
      }
    }
    
    return false;
  }

  // Перевірка на послідовності
  function sequenceCheck(password) {
    const lowercasePassword = password.toLowerCase();
    
    // Поширені послідовності символів
    const sequences = [
      'abcdefghijklm', 'nopqrstuvwxyz', 'абвгґдеєжзиіїй', 'клмнопрстуфхцч',
      '12345678901234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
      'йцукенгшщзхї', 'фівапролджє', 'ячсмитьбю'
    ];
    
    for (const seq of sequences) {
      for (let i = 0; i < seq.length - 3; i++) {
        const subSeq = seq.substring(i, i + 3);
        if (lowercasePassword.includes(subSeq)) {
          return true;
        }
      }
    }
    
    // Перевірка на повторення символів (наприклад, "aaa", "111")
    for (let i = 0; i < lowercasePassword.length - 2; i++) {
      if (lowercasePassword[i] === lowercasePassword[i+1] && lowercasePassword[i] === lowercasePassword[i+2]) {
        return true;
      }
    }
    
    return false;
  }
});

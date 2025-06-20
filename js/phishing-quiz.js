document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Отримуємо необхідні DOM-елементи
  const phishingQuiz = document.getElementById('phishingQuiz');
  
  // Перевіряємо, чи існує елемент на сторінці
  if (!phishingQuiz) {
    // Якщо елементу немає, значить скрипт викликаний на неправильній сторінці
    return;
  }

  // Додаємо обробники кліків на кнопки
  const quizButtons = phishingQuiz.querySelectorAll('.quiz-btn');
  quizButtons.forEach(button => {
    button.addEventListener('click', handleQuizAnswer);
  });

  // Обробка відповіді на питання про фішинг
  function handleQuizAnswer(event) {
    const button = event.currentTarget;
    const quizItem = button.closest('.quiz-item');
    const resultElement = quizItem.querySelector('.quiz-result');
    const allButtons = quizItem.querySelectorAll('.quiz-btn');
    const isPhishing = button.getAttribute('data-is-phishing') === 'true';
    const expectedAnswer = quizItem.querySelector('.quiz-options button[data-is-phishing="true"]').textContent === 'Фішинг';
    
    // Блокуємо всі кнопки, щоб користувач не міг змінити відповідь
    allButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('disabled');
    });
    
    // Визначаємо правильність відповіді
    const isCorrect = (isPhishing && expectedAnswer) || (!isPhishing && !expectedAnswer);
    
    // Встановлюємо класи кнопкам в залежності від відповіді
    if (isCorrect) {
      button.classList.add('correct-answer');
      resultElement.classList.add('correct');
      resultElement.innerHTML = '<span class="result-icon">✓</span> Вірно!';
    } else {
      button.classList.add('wrong-answer');
      
      // Підсвічуємо правильну відповідь
      allButtons.forEach(btn => {
        const btnIsPhishing = btn.getAttribute('data-is-phishing') === 'true';
        if ((btnIsPhishing && expectedAnswer) || (!btnIsPhishing && !expectedAnswer)) {
          btn.classList.add('correct-answer');
        }
      });
      
      resultElement.classList.add('incorrect');
      resultElement.innerHTML = '<span class="result-icon">✗</span> Невірно! Ось ознаки фішингу:';
    }
    
    // Додаємо пояснення
    const explanation = document.createElement('div');
    explanation.className = 'quiz-explanation';
    
    // Різні пояснення для різних питань
    const messageHeader = quizItem.querySelector('.message-header .sender').textContent;
    
    if (messageHeader.includes('privatbank')) {
      explanation.innerHTML = `
        <p>Це фішинговий лист. Хоча зміст здається безпечним, справжня адреса ПриватБанку - <strong>@privatbank.ua</strong>, 
        а не <strong>@privatbank.ua</strong>. Крім того, офіційні листи ПриватБанку завжди містять частину номера вашої картки або 
        ім'я та по батькові.</p>
      `;
    } else if (messageHeader.includes('g00gle')) {
      explanation.innerHTML = `
        <p>Це фішинговий лист. Зверніть увагу на:</p>
        <ul>
          <li>Неправильний домен відправника: @g00gle.services замість @google.com</li>
          <li>Створення терміновості ("УВАГА! Термінове повідомлення!")</li>
          <li>Підозріле посилання: www.google-verification.site</li>
          <li>Граматичні помилки ("взламаний" замість "зламаний")</li>
          <li>Вимога ввести пароль</li>
        </ul>
      `;
    } else if (messageHeader.includes('monobank')) {
      explanation.innerHTML = `
        <p>Це безпечний лист. Він має:</p>
        <ul>
          <li>Правильну адресу відправника: noreply@monobank.ua</li>
          <li>Посилання веде на офіційний сайт</li>
          <li>Відсутні вимоги щодо термінових дій</li>
          <li>Не вимагає вводити особисті дані</li>
          <li>Пропонує звернутися в чат підтримки в офіційному додатку</li>
        </ul>
      `;
    }
    
    resultElement.appendChild(explanation);
  }
});

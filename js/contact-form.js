document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Отримуємо форму контактів
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  // Перевіряємо, чи існує форма на сторінці
  if (!contactForm || !formSuccess) {
    // Якщо форми немає, значить скрипт викликаний на неправильній сторінці
    return;
  }
  
  // Додаємо обробник відправки форми
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Зупиняємо стандартну відправку форми
    
    // Отримуємо значення полів
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Перевіряємо, чи всі поля заповнені
    if (!name || !email || !subject || !message) {
      alert('Будь ласка, заповніть усі поля форми');
      return;
    }
    
    // Перевіряємо формат електронної пошти
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Будь ласка, введіть правильну адресу електронної пошти');
      return;
    }
    
    // Показуємо індикатор завантаження
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Надсилаємо...';
    
    // Імітуємо відправку форми (зазвичай тут був би AJAX-запит до бекенду)
    setTimeout(() => {
      // Очищуємо поля форми
      contactForm.reset();
      
      // Ховаємо форму
      contactForm.style.display = 'none';
      
      // Показуємо повідомлення про успішну відправку
      formSuccess.style.display = 'block';
      
      // Анімуємо появу повідомлення про успіх
      formSuccess.style.opacity = '0';
      formSuccess.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        formSuccess.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        formSuccess.style.opacity = '1';
        formSuccess.style.transform = 'translateY(0)';
      }, 10);
      
      // Через 5 секунд показуємо форму знову
      setTimeout(() => {
        // Повертаємо початковий стан кнопки
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // Плавно ховаємо повідомлення про успіх
        formSuccess.style.opacity = '0';
        formSuccess.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
          
          // Плавно показуємо форму
          contactForm.style.opacity = '0';
          contactForm.style.display = 'block';
          contactForm.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            contactForm.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            contactForm.style.opacity = '1';
            contactForm.style.transform = 'translateY(0)';
          }, 10);
        }, 300);
      }, 5000);
    }, 2000);
  });
  
  // Додаємо валідацію полів під час введення
  const inputFields = contactForm.querySelectorAll('input, textarea');
  inputFields.forEach(field => {
    field.addEventListener('blur', function() {
      validateField(this);
    });
    
    field.addEventListener('input', function() {
      // Якщо поле було невалідним, але користувач почав виправляти - прибираємо помилку
      if (this.classList.contains('invalid')) {
        this.classList.remove('invalid');
        const errorMessage = this.parentNode.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    });
  });
  
  // Функція для валідації окремого поля
  function validateField(field) {
    // Видаляємо попередні повідомлення про помилки
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Перевіряємо поле в залежності від його типу
    let isValid = true;
    let errorMessage = '';
    
    if (field.value.trim() === '') {
      isValid = false;
      errorMessage = 'Це поле обов\'язкове для заповнення';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
      isValid = false;
      errorMessage = 'Введіть правильну адресу електронної пошти';
    }
    
    // Відображаємо помилку, якщо поле невалідне
    if (!isValid) {
      field.classList.add('invalid');
      
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = errorMessage;
      field.parentNode.appendChild(errorElement);
    } else {
      field.classList.remove('invalid');
    }
    
    return isValid;
  }
  
  // Додаємо стилі для форми в залежності від стану полів
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .form-group {
        margin-bottom: 20px;
        position: relative;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--color-text-light);
      }
      
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 65, 108, 0.2);
        border-radius: var(--radius-small);
        color: var(--color-text);
        transition: all var(--transition-fast);
      }
      
      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 65, 108, 0.5);
        box-shadow: 0 0 0 2px rgba(255, 65, 108, 0.2);
      }
      
      .form-group input.invalid,
      .form-group textarea.invalid {
        border-color: var(--color-error);
        background: rgba(255, 61, 0, 0.05);
      }
      
      .error-message {
        color: var(--color-error);
        font-size: 0.9rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .form-success {
        text-align: center;
        padding: 30px;
        background: rgba(0, 230, 118, 0.1);
        border: 1px solid rgba(0, 230, 118, 0.3);
        border-radius: var(--radius-medium);
      }
      
      .success-icon {
        font-size: 3rem;
        margin-bottom: 20px;
      }
      
      .contact-form .btn {
        margin-top: 10px;
      }
      
      @media (max-width: 768px) {
        .contact-form-container {
          margin-top: 40px;
        }
      }
    </style>
  `);
});

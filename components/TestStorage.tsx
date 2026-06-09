'use client';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function TestStorage() {
  // Хук сам создаст ключ "my-name" в LocalStorage телефона
  const [name, setName] = useLocalStorage('my-name', 'Гость');

  return (
    <div style={{ padding: '20px', border: '1px solid #333', marginTop: '20px' }}>
      <h3>Тест памяти:</h3>
      <p>Привет, <b>{name}</b>!</p>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Введите имя"
        style={{ color: 'black', padding: '5px' }}
      />
      <p><small>Попробуй написать имя, обновить страницу или закрыть браузер. Оно сохранится!</small></p>
    </div>
  );
}
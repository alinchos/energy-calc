'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (form.password.length < 6) {
      setError('Пароль має бути не менше 6 символів');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Помилка реєстрації');
      }

      router.push('/login');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">EnergyCalc</h1>
          <p className="text-gray-500 mt-2">Створіть акаунт для обліку енергії</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <Input
          label="Ім'я користувача"
          type="text"
          placeholder="Наприклад: Андрій"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <Input
          label="Пароль"
          type="password"
          placeholder="******"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={isLoading}
        >
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
        </Button>
        
        <p className="text-center mt-6 text-sm text-gray-600">
          Вже є акаунт?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Увійти
          </Link>
        </p>
      </form>
    </div>
  );
}
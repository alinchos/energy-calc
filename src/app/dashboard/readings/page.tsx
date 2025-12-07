'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ReadingsPage() {
  const [meters, setMeters] = useState<any[]>([]);
  const [selectedMeter, setSelectedMeter] = useState('');
  const [form, setForm] = useState({ date: '', valueDay: '', valueNight: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetch('/api/meters')
      .then(res => res.json())
      .then(data => {
        setMeters(data);
        if (data.length > 0) setSelectedMeter(data[0]._id);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const res = await fetch('/api/readings', {
      method: 'POST',
      body: JSON.stringify({
        meterId: selectedMeter,
        date: form.date || new Date(),
        valueDay: Number(form.valueDay),
        valueNight: Number(form.valueNight),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ text: `Успішно! Вартість: ${data.totalCost} грн`, type: 'success' });
      setForm({ date: '', valueDay: '', valueNight: '' });
    } else {
      setMessage({ text: data.message, type: 'error' });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Внести показники</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">Оберіть Лічильник</label>
          <select 
            className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 font-medium"
            value={selectedMeter}
            onChange={(e) => setSelectedMeter(e.target.value)}
          >
            {meters.map(m => (
              <option key={m._id} value={m._id} className="text-gray-900">{m.name}</option>
            ))}
          </select>
        </div>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Дата зняття показників" 
            type="date"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Показник ДЕНЬ (кВт)" 
              type="number" 
              placeholder="0000"
              value={form.valueDay}
              onChange={(e) => setForm({...form, valueDay: e.target.value})}
              required
            />
            <Input 
              label="Показник НІЧ (кВт)" 
              type="number" 
              placeholder="0000"
              value={form.valueNight}
              onChange={(e) => setForm({...form, valueNight: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full mt-4 py-3 text-lg">Розрахувати та Зберегти</Button>
        </form>

        {message.text && (
          <div className={`mt-6 p-4 rounded-lg font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
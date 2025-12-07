'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Pencil, X } from 'lucide-react';

interface Meter {
  _id: string;
  name: string;
  type: string;
  tariffId: { _id: string; name: string; dayRate: number; nightRate: number };
}

interface Tariff {
  _id: string;
  name: string;
}

export default function MetersPage() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [name, setName] = useState('');
  const [selectedTariff, setSelectedTariff] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/meters').then((res) => res.json()).then(setMeters);
    fetch('/api/tariffs').then((res) => res.json()).then((data) => {
      setTariffs(data);
      if (data.length > 0) setSelectedTariff(data[0]._id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId ? `/api/meters/${editingId}` : '/api/meters';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tariffId: selectedTariff, type: 'dual-zone' }),
    });

    if (res.ok) {
      const savedMeter = await res.json();
      
      if (editingId) {
        setMeters(meters.map(m => m._id === editingId ? savedMeter : m));
        setEditingId(null);
      } else {
        setMeters([...meters, savedMeter]);
      }
      setName('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені? Це також видалить усю історію показників цього лічильника.')) return;

    const res = await fetch(`/api/meters/${id}`, { method: 'DELETE' });

    if (res.ok) {
      setMeters(meters.filter(m => m._id !== id));
      if (editingId === id) handleCancelEdit();
    } else {
      alert('Помилка видалення');
    }
  };

  const startEdit = (meter: Meter) => {
    setEditingId(meter._id);
    setName(meter.name);
    setSelectedTariff(meter.tariffId._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    if (tariffs.length > 0) setSelectedTariff(tariffs[0]._id);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Мої лічильники</h1>
      <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow mb-8 flex gap-4 items-end transition-colors ${editingId ? 'bg-blue-50 border border-blue-200' : 'bg-white'}`}>
        <div className="flex-1">
          <Input 
            label={editingId ? "Редагувати назву" : "Назва нового лічильника"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="flex-1 mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-1">
            Тариф
          </label>
          <select 
            className="w-full border border-gray-300 p-2 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedTariff}
            onChange={(e) => setSelectedTariff(e.target.value)}
          >
            {tariffs.map((t) => (
              <option key={t._id} value={t._id} className="text-gray-900">
                {t.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button type="submit">
            {editingId ? 'Зберегти' : 'Додати'}
          </Button>
          
          {editingId && (
            <Button type="button" variant="secondary" onClick={handleCancelEdit} title="Скасувати">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meters.map((meter) => (
          <div key={meter._id} className={`bg-white p-6 rounded-xl shadow border-l-4 ${editingId === meter._id ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-blue-500'}`}>
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{meter.name}</h3>
                <p className="text-gray-700 font-medium text-sm mt-1">
                  Тариф: <span className="text-gray-900">{meter.tariffId?.name}</span>
                </p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => startEdit(meter)} 
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Редагувати"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(meter._id)} 
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Видалити"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between text-sm border-t pt-3 mt-4">
              <span className="text-gray-700">
                День: <span className="font-bold text-gray-900">{meter.tariffId?.dayRate}</span> грн
              </span>
              <span className="text-gray-700">
                Ніч: <span className="font-bold text-gray-900">{meter.tariffId?.nightRate}</span> грн
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
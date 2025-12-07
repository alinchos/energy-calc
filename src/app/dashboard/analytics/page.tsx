'use client';

import { useState, useEffect } from 'react';
import ConsumptionChart from '@/components/charts/ConsumptionChart';

export default function AnalyticsPage() {
  const [meters, setMeters] = useState<any[]>([]);
  const [selectedMeter, setSelectedMeter] = useState('');
  const [readings, setReadings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/meters').then(res => res.json()).then(data => {
      setMeters(data);
      if (data.length > 0) setSelectedMeter(data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selectedMeter) {
      fetch(`/api/readings?meterId=${selectedMeter}`)
        .then(res => res.json())
        .then(setReadings);
    }
  }, [selectedMeter]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Аналітика витрат</h1>
        
        <select 
          className="border border-gray-300 p-2 rounded-lg text-gray-900 font-bold"
          value={selectedMeter}
          onChange={(e) => setSelectedMeter(e.target.value)}
        >
          {meters.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {readings.length > 0 ? (
            <ConsumptionChart data={readings} />
          ) : (
            <p className="text-center text-gray-500 py-10">Немає даних для відображення. Внесіть показники.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 overflow-x-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Історія транзакцій</h3>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-bold text-gray-700">Дата</th>
                <th className="p-3 font-bold text-gray-700">Спожито (День/Ніч)</th>
                <th className="p-3 font-bold text-gray-700">Вартість</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r: any) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-900">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-700">
                    {r.consumptionDay} / {r.consumptionNight} кВт
                  </td>
                  <td className="p-3 font-bold text-blue-600">
                    {r.totalCost.toFixed(2)} грн
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
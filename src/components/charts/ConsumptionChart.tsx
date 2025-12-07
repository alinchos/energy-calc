'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartProps {
  data: any[];
}

export default function ConsumptionChart({ data }: ChartProps) {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    День: item.consumptionDay,
    Ніч: item.consumptionNight,
    Вартість: item.totalCost
  })).reverse();

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4 text-gray-700">Динаміка споживання</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="День" fill="#3B82F6" />
          <Bar dataKey="Ніч" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
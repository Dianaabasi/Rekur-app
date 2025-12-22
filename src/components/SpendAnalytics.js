'use client';

import { useEffect, useRef } from 'react';
// Use Chart.js or Recharts for pie chart - install if needed: npm install recharts

import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

export default function SpendAnalytics({ subscriptions }) {
  const data = subscriptions.reduce((acc, sub) => {
    const cat = sub.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + sub.amount;
    return acc;
  }, {});

  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <h2>Spend by Category</h2>
      <PieChart width={400} height={400}>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#3498db', '#34495e', '#7f8c8d', '#ecf0f1', '#e74c3c'][index % 5]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
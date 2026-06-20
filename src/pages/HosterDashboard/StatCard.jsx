// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, isCurrency = false }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">
        {isCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()}
      </p>
    </div>
    {Icon && <Icon className={`text-4xl ${color} opacity-70`} />}
  </div>
);

export default StatCard;

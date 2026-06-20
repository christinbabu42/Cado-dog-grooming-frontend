// src/components/InfoField.jsx
import React from 'react';

const InfoField = ({ label, value, icon: Icon, color = 'text-gray-700' }) => (
  <div className="mb-2">
    <p className="text-sm font-medium text-gray-700 flex items-center">
      {Icon && <Icon className={`mr-2 ${color}`} />} {label}
    </p>
    <p className="text-lg font-medium text-gray-900">{value}</p>
  </div>
);

export default InfoField;

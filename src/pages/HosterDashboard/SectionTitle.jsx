// src/components/SectionTitle.jsx
import React from 'react';

const SectionTitle = ({ icon: Icon, title, description }) => (
  <div className="flex items-center mb-6">
    {Icon && <Icon className="text-3xl text-red-600 mr-3" />}
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    {description && <p className="ml-4 text-gray-700 italic text-sm hidden md:block">{description}</p>}
  </div>
);

export default SectionTitle;

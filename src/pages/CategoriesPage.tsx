import React from 'react';
import { category } from '../data/categoryData';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  category_name: string;
  category_image: string;
}

const bgColors = [
  'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100',
  'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-emerald-100', 'bg-orange-100'
];

const getRandomBgColor = (): string => {
  const i = Math.floor(Math.random() * bgColors.length);
  return bgColors[i];
};

const CategoriesPage: React.FC = () => {
const navigate= useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {category.map(({ id, category_name, category_image }) => {
          const bgColor = getRandomBgColor();
          return (
            <div
              key={id}
              className="flex flex-col items-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 bg-white"
              onClick={()=>navigate("/services")}
            >
              <div
                className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform duration-300 hover:scale-110`}
              >
                <img
                  src={`https://prnvservices.com/${category_image}`}
                  alt={category_name}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-700 text-center leading-tight">
                {category_name}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;

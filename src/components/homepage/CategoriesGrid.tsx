import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../api/apiMethods';
// import { getAllCategories } from '../../api/apiMethods';

interface Category {
  id: number;
  category_name: string;
  category_image: string;
  status: number;
}

interface CategoriesGridProps {
  lang: string;
}

function CategoriesGrid({ lang }: CategoriesGridProps) {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success === true && Array.isArray(response.data)) {
        setAllCategories(response.data);
        console.log(response,"==>response");
        
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch categories');
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
    
    <div className="bg-white rounded-2xl shadow p-6 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
        {lang === 'hi' ? 'श्रेणियाँ' : 'Most Popular Categories'}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {allCategories
          .filter(category => category.status === 1)
          .map((category, index) => (
            <div
              key={category.id}
              className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: 'both',
              }}
              onClick={() => navigate('/services')}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                <img
                  src={`${category.category_image}`}
                  alt={category.category_name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                {category.category_name}
              </h3>
            </div>
          ))}
      </div>

    </div>
          <div className="bg-white rounded-2xl shadow p-6 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
        {lang === 'hi' ? 'श्रेणियाँ' : 'Other Categories'}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {allCategories
          .filter(category => category.status === 0)
          .map((category, index) => (
            <div
              key={category.id}
              className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: 'both',
              }}
              onClick={() => navigate('/services')}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                <img
                  src={`${category.category_image}`}
                  alt={category.category_name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                {category.category_name}
              </h3>
            </div>
          ))}
      </div>

    </div>

    </>
  );
}

export default CategoriesGrid;

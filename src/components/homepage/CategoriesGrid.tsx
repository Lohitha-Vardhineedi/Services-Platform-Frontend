import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { categories } from '../../data/categoryData';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../api/apiMethods';

interface CategoriesGridProps {
  lang: string;
}

function CategoriesGrid({ lang }: CategoriesGridProps) {
const navigate= useNavigate()
const [allCategories,setAllCategories] = useState()
const [error,setError] = useState()

const fetchCategories = async()=>{
  try{
    const response = await getAllCategories();
    if(response.success === true){
      console.log("response",response)
      setAllCategories(response)
    }
  }catch(err){
    setError(err?.message)
  }
}
useEffect(()=>{
fetchCategories()
},[])


  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
        {lang === 'hi' ? 'श्रेणियाँ' : 'Most Popular Categories'}
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories
          .filter(c => c.status === 1) 
          .slice(0, 11)
          .map((category, index) => (
            <div
              key={index}
              className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
              onClick={() => navigate("/services")}
            >
              {/* <div
                className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-125 transition-transform duration-300`}
              > */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-125 transition-transform duration-300`}
              >
                {typeof category.icon === 'string' && category.icon.startsWith('http') ? (
                  <img src={category.icon} alt={category.name} className="w-8 h-8 object-contain" />
                ) : (
                  category.icon
                )}
              </div>
              <h3 className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                {category.name}
              </h3>
            </div>
          ))}


        {/* More card */}
        {/* <Link to="/comingsoon">
          <div className="relative rounded-xl shadow group cursor-pointer p-4 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50/60 hover:scale-105 animate-fade-in" style={{ animationDelay: `${11 * 60}ms`, animationFillMode: 'both' }}>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">
              <Menu className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
              More
            </h3>
          </div>
        </Link> */}


      </div>
    </div >
  );
}

export default CategoriesGrid; 
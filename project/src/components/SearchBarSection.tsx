import React from 'react';
import { MapPin } from 'lucide-react';

function SearchBarSection() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Hyderabad's Largest Marketplace !!
      </h1>
      <div className="text-lg md:text-xl text-blue-700 font-semibold mb-8">
        Search From Awesome Verified Professionals
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Category Dropdown */}
          <div className="relative flex-1">
            <select
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
              defaultValue=""
            >
              <option value="" disabled>Select Category</option>
              <option>Restaurants</option>
              <option>Hotels</option>
              <option>Beauty Spa</option>
              <option>Home Decor</option>
              <option>Wedding Planning</option>
              <option>Education</option>
              <option>Hospitals</option>
              <option>Contractors</option>
              <option>Pet Shops</option>
            </select>
          </div>
          {/* Pincode Dropdown */}
          <div className="relative flex-1">
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
              defaultValue=""
            >
              <option value="" disabled>Select Pincode</option>
              <option>500001</option>
              <option>500002</option>
              <option>500003</option>
              <option>500004</option>
              <option>500005</option>
            </select>
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
          {/* Area Dropdown */}
          <div className="relative flex-1">
            <select
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 appearance-none"
              defaultValue=""
            >
              <option value="" disabled>Select Area</option>
              <option>Banjara Hills</option>
              <option>Jubilee Hills</option>
              <option>Gachibowli</option>
              <option>Kukatpally</option>
              <option>Secunderabad</option>
            </select>
          </div>
          {/* Search and Reset Buttons */}
          <div className="flex flex-row gap-2 mt-4 md:mt-0">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition-colors">
              Search
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBarSection; 
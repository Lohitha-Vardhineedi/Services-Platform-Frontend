import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate()

  return (
    <>
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              <p className="text-gray-600">Contact our customer support</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                <Phone className="w-4 h-4" />
                <span>9603558369</span>
              </button>
              {/* <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              onClick={()=>navigate('/')}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      {/* <div className="fixed bottom-6 right-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
          <span className="text-xs font-bold text-center leading-tight">Free
Listing</span>
        </button>
      </div> */}
    </>
  );
}

export default Footer; 
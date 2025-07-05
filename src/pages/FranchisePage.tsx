import React, { useState, ChangeEvent, FormEvent } from 'react';
import { CheckCircle, Phone, Mail, MapPin, AlertCircle, Users, TrendingUp, Award, DollarSign, Calendar, Target, BookOpen, Briefcase, Clock, Globe, FileText, CreditCard, Shield } from 'lucide-react';
import { franchiseTerms } from '../data/FranchiseData';

interface FormData {
  name: string;
  mobile: string;
  message: string;
}

interface Term {
  id: number;
  text: string;
}

const FranchisePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobile: '',
    message: ''
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const termIcons = [
    DollarSign, CreditCard, Calendar, BookOpen, Clock, Shield,
    Award, TrendingUp, Users, Target, Globe, Briefcase,
    DollarSign, Users, FileText, MapPin, Shield, CreditCard
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Franchise Opportunity
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join PRNV Services and build your business with comprehensive support and unlimited earning potential
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Terms */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Franchise Terms & Conditions</h2>
                <p className="text-gray-600">Please read all terms carefully before applying</p>
              </div>

              <div className="space-y-4 mb-2">
                {franchiseTerms.map((term: Term, index: number) => {
                  const IconComponent = termIcons[index] || FileText;
                  return (
                    <div key={term.id} className="flex gap-4 group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                          <IconComponent size={20} className="group-hover:animate-pulse" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed text-sm">{term.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-blue-800 mb-2">Important Note:</h3>
                    <p className="text-blue-700 leading-relaxed">
                      We won't take any deposit from the Franchise. Office as well as staff is not required for the Franchise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce">
                    <Phone className="text-white" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Get Started Now</h3>
                  <p className="text-sm text-gray-600">Fill the form to apply</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Username <span className='text-red-500'>*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number <span className='text-red-500'>*</span></label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message <span className='text-red-500'>*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Tell us about your interest..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    CONTACT US
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6">
                <h4 className="font-bold text-gray-800 mb-4 text-center">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:animate-spin">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:animate-pulse">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">franchise@prnvservices.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:animate-bounce">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">GHMC Area, Hyderabad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchisePage;

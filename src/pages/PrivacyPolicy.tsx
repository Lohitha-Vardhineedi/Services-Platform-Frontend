import React from 'react';
// import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/layout/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* <Breadcrumb currentPage="Privacy Policy" /> */}
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Privacy Policy
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> February 07, 2023
            </p>
            
            <p>
              This Privacy Policy describes our policies and procedures for collecting, using, and disclosing your information when you use our services or register as a professional (technician or service provider). It also informs you of your privacy rights and the legal safeguards that apply to you.
            </p>

            <p>
              <strong>PRNV Services</strong> use your personal data to provide and improve the service from both customer and professional (technician/service provider) end. By using the service, you agree to the collection and use of information in accordance with this privacy policy.
            </p>

            <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Interpretation and Definitions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Interpretation</h3>
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear singular or plural.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Definitions</h3>
            <p className="mb-4">For the purposes of this Privacy Policy:</p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Account</strong> means an individual account created for you to access our service or to be a part of our service.</li>
                <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to PRNV Services, 6th floor, Swathi Plaza, Leelanagar, Ameerpet, Hyderabad.</li>
                <li><strong>Cookies</strong> are small files placed on your computer, mobile device, or any other device by a website, containing the details of your browsing history on that website among its many uses.</li>
                <li><strong>Device</strong> means any device that can access the service, such as a computer, a cellphone, or a digital tablet.</li>
                <li><strong>Personal Data</strong> is any information related to an identified or identifiable individual.</li>
                <li><strong>Third-party Social Media Service</strong> refers to any website or social network website through which a user or professional (technician/service provider) can log in or create an account to use the service or be a part of our service.</li>
              </ol>
            </div>

            <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Types of Data Collected</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Data</h3>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-3">For Customers:</h4>
                <p className="text-sm mb-3">We may ask You to provide Us with personally identifiable information that can be used to contact or identify You while using our service. Personally identifiable information may include, but is not limited to, the following:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Usage Data</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-3">For Professional (Technician/Service Provider):</h4>
                <p className="text-sm mb-3">The Professional who choose to use our services as a Professional (Technician/Service Provider), we will ask you for some personal information that will allow us to get in touch with you or identify you. This private information includes:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>2 Referral Mobile Number</li>
                  <li>Current Address & Permanent Address</li>
                  <li>Aadhar Card, Voter Card, or Driving License</li>
                  <li>Your Passport Size Photo for Profile</li>
                  <li>Usage Data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
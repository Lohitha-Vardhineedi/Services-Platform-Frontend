import React from 'react';
// import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/layout/Footer';

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* <Breadcrumb currentPage="Terms & Conditions" /> */}
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Terms & Conditions
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> February 07, 2023
            </p>
            
            <p>Welcome to PRNV Services!</p>
            
            <p>
              These terms and conditions outline the rules and regulations for using the PRNV Services Website, located at www.prnvservices.com. We assume that you accept these terms and conditions by accessing this website. Do not continue to use PRNV Services if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <p className="text-base">
                The following terminology applies to these Terms & Conditions and Disclaimer Notice and all Agreements: "Customer", "User", "You" and "Your" refers to you, the person who log on this Website and is compliant to the company's terms and conditions. "The Company", "Ourselves", "We" and "Our" refers to our company. "Professionals" (Technician/Service Providers) refers to all the technician's offering services.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Changes</h2>
            <p>
              The terms & conditions might change, modify, add, or remove from time to time without any notice. So, it is your responsibility to check for any changes in terms & conditions periodically to be aware of them and ensure that you follow them. By continuing to access or use our site, you agree to be bound by any such revisions and should, therefore, periodically visit this page to review the current Terms & Conditions for both customer & professional (technician/service provider).
            </p>

            <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Cookies</h2>
            <p>
              We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the choice of allowing or disallowing optional Cookies. For the proper operation of our Website, a few Cookies are required. Since they always function, these cookies don't need your permission.
            </p>

            <h2 className="text-2xl font-semibold text-blue-700 mt-8 mb-4">Terms for Customer:</h2>
            <div className="space-y-4">
              <p>
                Your name, phone number, email address, and other personal information will be collected during the Account registration process and while using the PRNV Services website. We collect your login credentials for our website when you directly register yourself as a customer using your Gmail account.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Note:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>PRNV Services is not involved in any payment between the customer and professional (technician/service provider).</li>
                  <li>Customer should make payment to the professional (technician/service provider) after work is done.</li>
                  <li>After work is done, customers should mention all the required fields, including work started, work amount paid, rating, and reviews on the service profile page.</li>
                  <li>The amount paid to a professional (technician/service provider) after work is not refundable.</li>
                  <li>Customers don't have to pay GST, as most professionals (technicians/service providers) are under the GST limit.</li>
                  <li>Customers don't have to pay commissions to the company because PRNV Services follows the principle of No Middlemen – No Commissions.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
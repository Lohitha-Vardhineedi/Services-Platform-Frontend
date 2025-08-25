import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';

const ProfessionalAgreement: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb currentPage="Professional Agreement Details" />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Professional Agreement Details
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
            <p className="text-base mb-6">
              <strong>Memorandum of Understanding (MOU)</strong> is made on ______________ by and between:
            </p>
            
            <div className="space-y-4 mb-6">
              <p>
                <strong>1)</strong> PRNV SERVICES a Proprietorship based company, Proprietor Veeksith Kolanupaka S/O K. P. Rama Rao, R/O Hyderabad, Telangana State. Registered office at #301, Sai Manor Apartments, Near Umesh Chandra Statue, SR Nagar, Hyderabad - 500038 (herein after referred to as the "Company", which expression shall be deemed to mean and include its successors and permitted assigns),
              </p>
              
              <p>
                <strong>AND</strong>
              </p>
              
              <p>
                <strong>2)</strong> _________________________________son/daughter/wife of ________________________________
                residing at __________________________ (here in after referred to as the "Professional (Technician/Service Provider)\" which expression shall be deemed to mean and include its successors and permitted assigns).
              </p>
              
              <p>
                The Company and the Service Provider may also be individually referred to as the Party or Parties.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">RECITALS</h2>
              <p className="mb-4">
                whereas the Company provides multiple services inter alia such as plumbing, electrical repair, home cleaning, appliance repairs, home beauty services, carpentry services, painting services, pest control, fitness services, laundry services, laptop repair and mobile repair and other convenience services, that is A to Z services to end customers (such customers called as the "Company Customers"). Whereas the Service Provider provides services to the customer through PRNV Services.
              </p>
              
              <p>
                5) Whereas the company has agreed to engage the services of the Service Provider and the Service Provider has agreed to provide the Services in accordance with the terms and conditions of this MOU set forth in Exhibit A.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">Required Details Document of Service Provider:</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Name/ organization</li>
                <li>Mobile Number</li>
                <li>Referral Numbers</li>
                <li>Adhar Card</li>
                <li>Pan Card / Voter Id / Driving License</li>
                <li>Permanent Address</li>
                <li>Current Address</li>
                <li>Bank details</li>
              </ol>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">EXHIBIT A</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">EFFECTIVE DATE AND TERM</h3>
              <div className="space-y-3 mb-6">
                <p><strong>1.1.</strong> The Parties hereby agree that the Effective date of the MOU shall be the date on which both parties execute this MOU.</p>
                <p><strong>1.2.</strong> This MOU shall be valid for the Term specified. This MOU may be renewed on the mutual agreement of the Parties on terms and conditions mutually agreeable to the Parties.</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2. SERVICES AND RESPONSIBILITIES OF THE SERVICE PROVIDER</h3>
              <div className="space-y-4 mb-6">
                <p><strong>2.1.</strong> The Service Provider shall provide the Services to the Company Customers.</p>
                <p><strong>2.2.</strong> The Service Provider shall provide the Services in the timelines and at the cost agreed by the Parties.</p>
                <p><strong>2.3.</strong> Whenever the Company is required to engage the services of the Service Provider, the Company shall issue a job card, which will contain project specific details, along with the concerned instrument or with details of the service required to be rendered by the Service Provider. The said job card may be issued to the Service Provider through a letter, the Company's mobile application, short messaging service (SMS), or through an email.</p>
                <p><strong>2.4.</strong> The Service Provider shall ensure that it provides the Services with due care, and with superior quality standards. The Service Provider acknowledges and assures that he/she and/or any of his/her Associates have the required qualification and experience in compliance with the best practices applied in the field of such Services and in compliance with all legal provisions and applicable standards with respect to the provision of Services.</p>
                <p><strong>2.5.</strong> Deliverables of Services shall be subject to acceptance by the Company and/or the Company Customer, as the case may be. The Service Provider shall provide a 1 week Guarantee Period immediately after the deliverable of the Services to the customers. Any complaints or issues with the services shall be addressed without additional charge by the Service Provider within the Guarantee Period.</p>
                <p><strong>2.6.</strong> The Company shall appoint a representative who will coordinate with the Service Provider with regards to the deliverable under this MOU and shall address the outstanding issues and disputes hereunder.</p>
                <p><strong>2.7.</strong> The Service Provider understands and acknowledges that it shall be the Service Provider for the Company Customers and it shall be responsible for the delivery of Service. The Service Provider shall be directly responsible for any deficiency in service, loss or damage of goods and acts, omissions or misdeeds by the Service Provider and/or the Associates. Any claims as against the Company in relation to the Services shall be a direct claim as against the Service Provider and the Company shall not be responsible to Company Customer for the acts or omissions of the Service Provider/ or the Associates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfessionalAgreement;
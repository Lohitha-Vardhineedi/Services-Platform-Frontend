import React, { useState, useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
        {
          question: "What is the toll-free number for “PRNV Services”?",
          answer: "“PRNV Services” is an advertisement portal connecting professionals (technicians/service providers) and customers. The professional (technician/service provider) and customer can contact each other through mobile phone and chat. All the problems will be sorted between professionals (technicians/service providers) and customers on their own. Because of this “PRNV Services” doesn’t require any toll-free number. So, whatever the problem is, a professional (technician/service provider) and customer can talk to each other, as we are connecting them through our platform. But in case you have any queries for us then feel free to contact us at +91 96035 58369, +91 9059789177. You can also chat with us or send us an email at prnvservices@gmail.com and we will respond right away."
        },
        {
          question: "Does “PRNV Services” provide work Guarantee for the customer?",
          answer: "Other companies are taking the amount directly from customers. In this amount, the major share will be retained by companies and the minor share to the professionals (technicians/service providers). With this huge amount, they can give a toll-free number, call center, guarantee, and special offers. Whereas in “PRNV Services”, we are connecting professionals (technicians/service providers) and customers and we won’t take anything from professionals (technicians/service providers) in work amount. Because of this “PRNV Services” doesn’t provide any toll-free number, call center, guarantee, and special offers. For security purposes, “PRNV Services” obtained an agreement with the professionals (technicians/service providers) to give a work guarantee of 1 week to customers. As professionals (technicians/service providers) and customers communicate internally and discuss & finalize the details, “PRNV Services” do not know any of the work details. So, in order to get the work guarantee from the professional (technician/service provider), the customer must include the following information work amount accepted, work amount paid, work completion, ratings, and reviews which is mandatory for the guarantee claiming process. This work guarantee is valid for one week from the date of completion of the work."
        },
        {
          question: "What ratio of commission does “PRNV Services” charge from professionals (technicians/service providers)?",
          answer: "“PRNV Services” doesn’t charge any commission from the professional (technician/service provider), as we are following the slogan “No Commission from Professionals & Customers”. We only take the subscription plan amount from the professionals (technicians/service providers). Even “PRNV Services” won’t take any commission from the customers."
        },
        {
          question: "Can I ask “PRNV Services” to send a professional (technician/service provider) directly?",
          answer: "Yes, “PRNV Services” offers “Guest Booking”, where the customer has to provide all the work details you want to book. Based on your requirements, we will provide the best professional (technician/service provider) near your location. You should make the payment directly to the professionals (technicians/service providers) because PRNV Services is not involved in the payment process. It is only involved in connecting professionals (technicians/service providers) and customers. Customers can also select the professional (technician/service provider) directly depending on the rating, reviews, and views."
        },
        {
          question: "How much can I earn for referring to a professional (technician/service provider)?",
          answer: "You won't earn money by referring a professional (technician/service provider). As this is the most helpful for customers and technicians, people will refer to it without expecting anything."
        },
        {
          question: "Can I book “Professionals at PRNV Services anywhere in India?",
          answer: "Now, you can book “PRNV Services professionals” anywhere in Hyderabad. We have covered all the pin codes available in Hyderabad, and you can find 100’s of professionals (technicians/service providers) near your location."
        },
        {
          question: "Why is my professional (technician/service provider) profile inactive?",
          answer: "Your professional (technician/service provider) profile is inactive because your subscription to the monthly plan has expired. So, subscribe to one of the plans to make your professional profile active."
        },
        {
          question: "How to activate my profile immediately after subscribing To a plan?",
          answer: "After subscribing to any of the professional plans, your profile will be activated within 24 hours. “PRNV Services” will take a few hours to verify the information you have submitted."
        },
        {
          question: "Incase of any damage, whom should I contact for the service guarantee?",
          answer: "You can contact the professional (technician/service provider) for a service guarantee, as the professional is responsible for providing the service guarantee to the customer. These professionals (technicians/service providers) have undergone an agreement with “PRNV Services” to compensate for any damage or service guarantee to the customer. If you're facing any problem in getting this service guarantee you can contact “PRNV Services”. Then we will interact with the professionals (technicians/service providers) and solve your problem."
        },
        {
          question: "How long will my subscription plan be live?",
          answer: "Your subscription plan's live status depends upon the plan details."
        },
        {
          question: "What if I don't renew my subscription plan?",
          answer: "If you don’t renew your subscription plan then your professional profile will be deactivated. The profile will not be displayed to the customers and you will lose your seniority."
        },
        {
          question: "How can I choose a subscription for 3 months, 6 months and 1 year?",
          answer: "At present, we don’t have a subscription plan for 3 months, 6 months and 1 year. But soon, we will introduce quarterly (3 months), half-yearly (6 months), and yearly (1 year) plans for the professionals (technicians/service providers)."
        },
        {
          question: "Can I change the subscription plan in the middle of the ongoing plan?",
          answer: "You can't change the subscription plan in the middle of the ongoing plan. You can change the subscription plan after the completion of the existing plan."
        },
        {
          question: "Is there any coupon code to use on professional (technician/service provider) subscription plans?",
          answer: "At present, we are not offering any coupon code to use on subscription plans, as we are offering a huge discount on our subscription plans. Soon, we will offer the coupon code to use on professional plans."
        },
        {
          question: "Can I get a discount on a professional (technician/service provider) subscription plan?",
          answer: "You can enjoy a huge discount on a professional (technician/service provider) subscription plan. Even during the festive season and on special occasions, “PRNV Services” offers special discounts on all subscription plans."
        },
        {
          question: "Does “PRNV Services” Compensate for any damage or work?",
          answer: "The professionals (technicians/service providers) have agreed with “PRNV Services” to compensate for any damage or work to the customers. So, the professional (technician/service provider) will pay for any damage or work directly to the customer. (As” PRNV Services” is not involved between the professional (technician/service provider) and customer. Also, we won’t take any commission from customers and professionals (technicians/service providers). So, “PRNV Services” will not be involved in this compensation process."
        },
        {
          question: "Why is submitting id proofs mandatory for professionals (technicians/service providers)?",
          answer: "For the safety of professionals (technicians/service providers) and even for customers, ID proofs of professionals are required. These identification documents will be kept by “PRNV Services' to ensure that we provide secure and trustworthy services to the customers."
        }
      ]
    );
//   const [loading, setLoading] = useState(true);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//       </div>
//     );
//   }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const [isOpen, setIsOpen] = useState(false);
            return (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                >
                  <span className="text-md font-medium text-gray-800">{index + 1}. {faq.question}</span>
                  <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-gray-600 border-gray-200">
                    <p className='text-sm'>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
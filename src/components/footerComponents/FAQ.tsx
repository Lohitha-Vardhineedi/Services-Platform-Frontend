import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [faqs] = useState<FAQItem[]>([
    {
      question: "What is the toll-free number for PRNV Services?",
      answer:
        '"PRNV Services" is an advertisement portal connecting professionals (technicians/service providers) and customers. The professional (technician/service provider) and customer can contact each other through mobile phone and chat. All the problems will be sorted between professionals (technicians/service providers) and customers on their own. Because of this "PRNV Services" doesn’t require any toll-free number. So, whatever the problem is, a professional (technician/service provider) and customer can talk to each other, as we are connecting them through our platform. But in case you have any queries for us then feel free to contact us at +91 96035 58369, +91 9059789177. You can also chat with us or send us an email at prnvservices@gmail.com and we will respond right away.',
    },
    {
      question: "Does PRNV Services provide work Guarantee for the customer?",
      answer:
        'Other companies are taking the amount directly from customers. In this amount, the major share will be retained by companies and the minor share to the professionals (technicians/service providers). With this huge amount, they can give a toll-free number, call center, guarantee, and special offers. Whereas in "PRNV Services", we are connecting professionals (technicians/service providers) and customers and we won’t take anything from professionals in work amount. Because of this "PRNV Services" doesn’t provide any toll-free number, call center, guarantee, and special offers. For security purposes, "PRNV Services" obtained an agreement with the professionals to give a work guarantee of 1 week to customers...',
    },
    {
      question:
        "What ratio of commission does PRNV Services charge from professionals?",
      answer:
        '"PRNV Services" doesn’t charge any commission from the professional, as we are following the slogan "No Commission from Professionals & Customers". We only take the subscription plan amount.',
    },
    {
      question:
        "Can I ask PRNV Services to send a professional directly?",
      answer:
        'Yes, "PRNV Services" offers Guest Booking, where the customer provides work details. Based on requirements, we will provide the best professional near your location. Payment is directly made to the professional as PRNV Services is not involved.',
    },
    {
      question:
        "How much can I earn for referring to a professional?",
      answer:
        "You won't earn money by referring a professional. Referrals are done for benefit of customers and technicians without expecting money.",
    },
    {
      question: "Can I book Professionals at PRNV Services anywhere in India?",
      answer:
        'Now, you can book "PRNV Services" professionals anywhere in Hyderabad. We have covered all the pin codes available.',
    },
    {
      question: "Why is my professional profile inactive?",
      answer:
        "Your professional profile is inactive because your subscription expired. Please subscribe to a plan to activate.",
    },
    {
      question:
        "How to activate my profile immediately after subscribing to a plan?",
      answer:
        'After subscribing, your profile will be activated within 24 hours. "PRNV Services" will verify your submitted info.',
    },
    {
      question:
        "In case of any damage, whom should I contact for the service guarantee?",
      answer:
        'You can contact the professional directly, as they are responsible for service guarantee. If not resolved, contact "PRNV Services" for support.',
    },
    {
      question: "How long will my subscription plan be live?",
      answer: "It depends upon the plan details you have chosen.",
    },
    {
      question: "What if I don't renew my subscription?",
      answer:
        "If you don’t renew, your profile will be deactivated and not shown to customers.",
    },
    {
      question:
        "Can I choose a subscription for 3 months, 6 months, or 1 year?",
      answer:
        "Currently, only monthly plans exist. Soon quarterly, half-yearly, and yearly plans will be introduced.",
    },
    {
      question: "Can I change subscription plan in the middle?",
      answer:
        "No, you must wait until the current plan ends to switch.",
    },
    {
      question:
        "Is there any coupon code for subscription plans?",
      answer:
        "Currently no coupon codes, but soon we will introduce them.",
    },
    {
      question:
        "Can I get a discount on subscription plans?",
      answer:
        'Yes, "PRNV Services" offers seasonal and festive discounts.',
    },
    {
      question:
        "Does PRNV Services compensate for damages?",
      answer:
        "No, compensation is handled directly between professional and customer.",
    },
    {
      question:
        "Why is submitting ID proofs mandatory?",
      answer:
        'For safety and trust, ID proofs are collected by "PRNV Services".',
    },
  ]);

  // Track open/close states
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
              >
                <span className="text-md font-medium text-gray-800">
                  {index + 1}. {faq.question}
                </span>
                <span
                  className={`transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </span>
              </button>
              {openIndex === index && (
                <div className="p-4 pt-0 text-gray-600 border-gray-200">
                  <p className="text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

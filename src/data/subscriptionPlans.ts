// import { getPlans } from "../api/apiMethods";

import { getPlans } from "../api/apiMethods";

export const plans = async () => {
  try {
    const response = await getPlans(); 
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return [];
  }
};

// export const plans = [
//   {
//     name: "Economy Plan",
//     price: 1000,
//     originalPrice: 2000,
//     discount: 50,
//     gst: 180,
//     totalPrice: 1180,
//     validity: 30,
//     validityUnit: "days",
//     maxMembers: 5,
//     maxLeads: null,
//     isPopular: false,
//     isActive: true,
//     icon: "Zap",  // Store as a string identifier for frontend mapping
//     color: "from-blue-500 to-blue-600",
//     buttonColor: "bg-blue-600 hover:bg-blue-700",
//     features: [
//       { name: "Only 5 members per pincode per plan", included: true },
//       { name: "No Commission From Technicians Or Customers", included: false },
//       { name: "No Refund", included: false },
//       { name: "No Change Of Plan", included: false },
//       { name: "Billing Facility", included: true }
//       // { text: 'Rs 500 off for first 1000 members'},
//       // { text: 'Total Discounted price Rs 590 for first 60 days.'},
//     ],
//     fullFeatures: [
//       { text: "Monthly Plan" },
//       { text: "Actual Price Rs. 2,000 + (18% GST) Rs. 360 = Rs. 2,360" },
//       { text: "OFFER PRICE Rs. 1,000 + (18% GST) Rs. 180 = Rs. 1,180" },
//       { text: "NO Minimum Business Guarantee & NO LEADS" },
//       { text: "Plan period 30 days" },
//       { text: "From next renewal subscription amount will be Rs. 1,180 only" },
//       { text: "ADD UP TO 10 WORK IMAGES. MINIMUM 3 IMAGES." },
//       { text: "ADD UP TO 3 WORK VIDEOS" },
//       { text: "SOCIAL MEDIA PROMOTION - YES" },
//       { text: "REFUND - NO" },
//       { text: "CHANGE OF PLAN - NO" },
//       { text: "BILLING FACILITY AVAILABLE - YES" },
//       { text: "NO COMMISSION FROM TECHNICIANS & CUSTOMERS" }
//       // {text: "For ``ECONOMY PLAN``   ``PROMO CODE`` is applicable for joining of ``FIRST`` 1,000 Technicians joining only"},
//       // {text: "If Technician use ``PROMO CODE`` Rs. 500 will be deducted from Subscription amount i.e., Rs. 1,000  - Rs. 500 = Rs. 500 is the amount the Technician have to pay + (Gst @18%) Rs. 90 = Rs. 590 is the total amount Technician have to pay. First time by using ``PROMO CODE`` the Plan Period will be extended for 60 days."},
//     ]
//   },
//   {
//     name: "Gold Plan",
//     price: 3000,
//     originalPrice: 6000,
//     discount: 50,
//     gst: 540,
//     totalPrice: 3540,
//     validity: 100,
//     validityUnit: "leads", // Custom value, NOT in schema enum, optional fix below
//     maxMembers: 5,
//     maxLeads: 100,
//     isPopular: true,
//     isActive: true,
//     icon: "Star",
//     color: "from-yellow-500 to-yellow-600",
//     buttonColor: "bg-yellow-600 hover:bg-yellow-700",
//     features: [
//       { name: "Only 5 members per pincode per plan", included: true },
//       { name: "Each LEAD Shared with 5 Technicians", included: true },
//       { name: "No Commission From Technicians Or Customers", included: false },
//       { name: "No Refund", included: false },
//       { name: "No Change Of Plan", included: false },
//       { name: "Billing Facility", included: true }
//       // { text: 'Rs 1000 off for first 500 members'},
//       // { text: 'Total Discounted price Rs 2360 for first 60 days.'},
//     ],
//     fullFeatures: [
//       { text: "Monthly Plan" },
//       { text: "Actual Price Rs. 6,000 + (18% GST) Rs. 1080 = Rs. 7,080" },
//       { text: "OFFER PRICE Rs. 3,000 + (18% GST) Rs. 540 = Rs. 3,540" },
//       { text: "WE WILL PROVIDE 100 LEADS" },
//       { text: "EACH LEAD WILL BE SHARED with 5 TECHNICIANS" },
//       { text: "Plan Period - Till 100 LEADS Provided" },
//       { text: "From next renewal subscription amount will be Rs. 3,540 only" },
//       { text: "ADD UP TO 10 WORK IMAGES. MINIMUM 3 IMAGES." },
//       // {text: "For ``GOLD PLAN``   ``PROMO CODE`` is applicable for joining of ``FIRST`` 500 Technicians joining only"},
//       // {text: "If Technician use ``PROMO CODE`` Rs. 1,000 will be deducted from Subscription amount. I.E.,  Rs. 3,000  - Rs. 1,000 = Rs. 2,000 is the amount the Technician have to pay + (Gst @18%) Rs. 360 = Rs. 2,360 is the total amount Technician have to pay. First time by using ``PROMO CODE`` the Plan Period will be extended till 100 leads provided."},
//       { text: "ADD UP TO 3 WORK VIDEOS" },
//       { text: "SOCIAL MEDIA PROMOTION - YES" },
//       { text: "REFUND - NO" },
//       { text: "CHANGE OF PLAN - NO" },
//       { text: "BILLING FACILITY AVAILABLE - YES" },
//       { text: "NO COMMISSION FROM TECHNICIANS & CUSTOMERS" }
//     ]
//   },
//   {
//     name: "Platinum Plan",
//     price: 10000,
//     originalPrice: 15000,
//     discount: 37.41,
//     gst: 1800,
//     totalPrice: 11800,
//     validity: 100,
//     validityUnit: "leads", // 🟡 You’ll need to extend enum to allow "leads" if not already done
//     maxMembers: 5,
//     maxLeads: 100,
//     isPopular: false,
//     isActive: true,
//     icon: "Crown",
//     color: "from-purple-500 to-purple-600",
//     buttonColor: "bg-purple-600 hover:bg-purple-700",
//     features: [
//       { name: "Only 5 members per pincode per plan", included: true },
//       { name: "Each LEAD Shared with 1 Technician", included: true },
//       { name: "No Commission From Technicians Or Customers", included: false },
//       { name: "No Refund", included: false },
//       { name: "No Change Of Plan", included: false },
//       { name: "Billing Facility", included: true }
//       // { text: 'Rs 2000 off for first 200 members'},
//       // { text: 'Total Discounted price Rs 9440 for first 60 days.'},
//     ],
//     fullFeatures: [
//       { text: "Monthly Plan" },
//       { text: "Actual Price Rs. 15,000 + (18% GST) Rs. 2,700 = Rs. 17,700" },
//       { text: "OFFER PRICE Rs. 10,000 + (18% GST) Rs. 1,800 = Rs. 11,800" },
//       { text: "WE WILL PROVIDE 100 LEADS" },
//       { text: "EACH LEAD WILL BE SHARED WITH 1 TECHNICIANS" },
//       { text: "Plan Period -  Till 100 LEADS Provided" },
//       { text: "From next renewal subscription amount will be Rs. 11,800 only" },
//       { text: "ADD UP TO 10 WORK IMAGES. MINIMUM 3 IMAGES." },
//       { text: "ADD UP TO 3 WORK VIDEOS" },
//       { text: "SOCIAL MEDIA PROMOTION - YES" },
//       { text: "REFUND - NO" },
//       { text: "CHANGE OF PLAN - NO" },
//       { text: "BILLING FACILITY AVAILABLE - YES" },
//       { text: "NO COMMISSION FROM TECHNICIANS & CUSTOMERS" }
//       // {text: "For ``PLATINUM PLAN``   ``PROMO CODE`` is applicable for joining of ``FIRST`` 200 Technicians joining only"},
//       // {text: "If Technician use ``PROMO CODE`` Rs. 2,000 will be deducted from Subscription amount. I.E.,  Rs. 10,000  - Rs. 2,000 = Rs. 8,000 is the amount the Technician have to pay + (Gst @18%) Rs. 1,440 = Rs. 9,440 is the amount Technician have to pay. First time by using ``PROMO CODE`` the Plan Period will be extended until 100 leads provided."},
//     ]
//   }

// ];
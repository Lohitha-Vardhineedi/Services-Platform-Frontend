import { Check, X, Star, Crown, Zap, Shield, BadgeIndianRupee } from 'lucide-react';

export const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '₹999',
    originalPrice: '₹1,199',
    discount: '17% OFF',
    gst: 'GST Extra',
    validity: 'Valid for 30 leads or ₹30,000 work',
    icon: Star,
    color: 'from-blue-500 to-blue-600',
    buttonColor: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    popular: false,
    features: [
      { text: 'Profile listing in search results', included: true },
      { text: 'Basic profile customization', included: true },
      { text: 'Customer contact details access', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Email support', included: true },
      { text: 'Work area selection (up to 5 pin codes)', included: true },
      { text: 'Basic analytics dashboard', included: true },
      { text: 'Standard profile visibility', included: true }
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '₹1,999',
    originalPrice: '₹2,499',
    discount: '20% OFF',
    gst: 'GST Extra',
    validity: 'Valid for 30 leads or ₹30,000 work',
    icon: Crown,
    color: 'from-purple-500 to-purple-600',
    buttonColor: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    popular: true,
    features: [
      { text: 'Priority listing in search results', included: true },
      { text: 'Enhanced profile with photo gallery', included: true },
      { text: 'Customer contact details access', included: true },
      { text: 'Mobile app with premium features', included: true },
      { text: 'Priority email & phone support', included: true },
      { text: 'Work area selection (up to 10 pin codes)', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Featured profile badge', included: true },
      { text: 'Video upload capability', included: true },
      { text: 'Social media promotion', included: true }
    ]
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: '₹2,999',
    originalPrice: '₹3,999',
    discount: '25% OFF',
    gst: 'GST Extra',
    validity: 'Valid for 30 leads or ₹30,000 work',
    icon: Zap,
    color: 'from-green-500 to-green-600',
    buttonColor: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    popular: false,
    features: [
      { text: 'Top priority listing in search results', included: true },
      { text: 'Premium profile with unlimited photos/videos', included: true },
      { text: 'Customer contact details access', included: true },
      { text: 'Full-featured mobile app access', included: true },
      { text: 'Dedicated account manager support', included: true },
      { text: 'Work area selection (unlimited pin codes)', included: true },
      { text: 'Comprehensive analytics & reporting', included: true },
      { text: 'Premium profile badge', included: true },
      { text: 'Unlimited video uploads', included: true },
      { text: 'Enhanced social media promotion', included: true },
      { text: 'Featured on homepage carousel', included: true },
      { text: 'Custom profile URL', included: true },
      { text: 'Lead notification priority', included: true }
    ]
  }
];

export const advertiserPlans = [
  {
    id: 'silver',
    name: 'Silver Plan',
    price: '₹2,999',
    gst: 'GST Extra',
    validity: '30 Days',
    icon: Shield,
    color: 'from-gray-400 to-gray-500',
    buttonColor: 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600',
    popular: false,
    features: [
      { text: 'Business listing in selected pin codes', included: true },
      { text: 'Basic business profile', included: true },
      { text: 'Contact information display', included: true },
      { text: 'Mobile app visibility', included: true },
      { text: 'Email support', included: true },
      { text: 'Up to 5 pin code areas', included: true },
      { text: 'Basic analytics', included: true }
    ]
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    price: '₹4,999',
    gst: 'GST Extra',
    validity: '30 Days',
    icon: Crown,
    color: 'from-yellow-400 to-yellow-500',
    buttonColor: 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600',
    popular: true,
    features: [
      { text: 'Priority business listing', included: true },
      { text: 'Enhanced business profile with gallery', included: true },
      { text: 'Contact information display', included: true },
      { text: 'Mobile app with premium visibility', included: true },
      { text: 'Priority email & phone support', included: true },
      { text: 'Up to 10 pin code areas', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Featured business badge', included: true },
      { text: 'Social media promotion', included: true }
    ]
  },
  {
    id: 'ruby',
    name: 'Ruby Plan',
    price: '₹7,999',
    gst: 'GST Extra',
    validity: '30 Days',
    icon: Zap,
    color: 'from-red-500 to-red-600',
    buttonColor: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    popular: false,
    features: [
      { text: 'Homepage visibility', included: true },
      { text: 'Premium business profile', included: true },
      { text: 'Contact information display', included: true },
      { text: 'Full-featured mobile app access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Unlimited pin code areas', included: true },
      { text: 'Comprehensive analytics', included: true },
      { text: 'Premium business badge', included: true },
      { text: 'Enhanced social media promotion', included: true },
      { text: 'Featured on homepage banner', included: true },
      { text: 'Custom business URL', included: true }
    ]
  }
];
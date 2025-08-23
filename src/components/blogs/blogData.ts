import { Blog } from '../types/blog';

export const blogs: Blog[] = [
  {
    id: 1,
    title: "SEO SIMPLIFIED: HOW TO GET YOUR WEBSITE RANKING ON GOOGLE",
    excerpt: "Learn the essential SEO strategies to improve your website's visibility and ranking on Google search results.",
    content: [
      {
        type: 'heading',
        text: 'Understanding SEO Fundamentals'
      },
      {
        type: 'paragraph',
        text: 'Search Engine Optimization (SEO) is crucial for online visibility. This guide covers the essential strategies to improve your website\'s ranking on Google.'
      },
      {
        type: 'heading',
        text: 'Key SEO Strategies'
      },
      {
        type: 'list',
        items: [
          'Keyword research and optimization',
          'Quality content creation',
          'Technical SEO improvements',
          'Link building strategies',
          'Local SEO optimization'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'digital-marketing',
    author: 'Digital Marketing Services',
    date: 'Jan 15, 2024',
    tags: ['SEO', 'Digital Marketing', 'Google Ranking', 'Website Optimization']
  },
  {
    id: 2,
    title: "UNRAVELING THE MYSTERY: WHY IS MY AIR CONDITIONER MAKING A NOISE?",
    excerpt: "Discover the common causes of AC noise and learn how to diagnose and fix these issues for optimal performance.",
    content: [
      {
        type: 'heading',
        text: 'Common AC Noise Issues'
      },
      {
        type: 'paragraph',
        text: 'Air conditioner noises can indicate various problems. Understanding these sounds helps in early diagnosis and prevention of major repairs.'
      },
      {
        type: 'list',
        items: [
          'Rattling sounds from loose components',
          'Squealing from belt issues',
          'Clicking from electrical problems',
          'Buzzing from refrigerant leaks',
          'Grinding from motor problems'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/8142888/pexels-photo-8142888.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'ac-repair',
    author: 'AC Repair Services',
    date: 'Jan 12, 2024',
    tags: ['AC Repair', 'Air Conditioning', 'HVAC', 'Maintenance']
  },
  {
    id: 3,
    title: "HOW TO FIX BLURRY CCTV FOOTAGE: TIPS AND TRICKS",
    excerpt: "CCTV cameras are crucial for security, but blurry footage defeats the purpose. Learn professional techniques to diagnose and fix camera clarity issues.",
    content: [
      {
        type: 'heading',
        text: 'Understanding Blurry CCTV Footage'
      },
      {
        type: 'paragraph',
        text: 'CCTV cameras are essential for security systems. When footage becomes blurry, it compromises the entire security setup. This guide provides solutions to restore clear video quality.'
      },
      {
        type: 'heading',
        text: 'Common Causes and Solutions'
      },
      {
        type: 'list',
        items: [
          'Clean camera lenses regularly',
          'Adjust focus settings properly',
          'Check lighting conditions',
          'Verify camera positioning',
          'Update firmware and settings'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'cctv-services',
    author: 'CCTV Installation Services',
    date: 'Jan 10, 2024',
    tags: ['CCTV', 'Security Cameras', 'Surveillance', 'Camera Repair']
  },
  {
    id: 4,
    title: "TOP 4 TIPS FOR FINDING PAINTING SERVICES ONLINE IN HYDERABAD",
    excerpt: "Find reliable painting services in Hyderabad with these expert tips for choosing the right professionals for your home or office.",
    content: [
      {
        type: 'heading',
        text: 'Finding Quality Painting Services'
      },
      {
        type: 'paragraph',
        text: 'Choosing the right painting service is crucial for achieving professional results. Here are the top tips for finding reliable painters in Hyderabad.'
      },
      {
        type: 'list',
        items: [
          'Check online reviews and ratings',
          'Verify licenses and insurance',
          'Compare multiple quotes',
          'Review previous work portfolios',
          'Ensure quality materials usage'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'painting-services',
    author: 'Painting Services',
    date: 'Jan 8, 2024',
    tags: ['Painting Services', 'Home Improvement', 'Hyderabad', 'Interior Design']
  },
  {
    id: 5,
    title: "COMMON ELEVATOR PROBLEMS AND PROFESSIONAL FIXES",
    excerpt: "Elevators are essential for modern buildings, but they can experience various issues. Learn about common problems and professional solutions.",
    content: [
      {
        type: 'heading',
        text: 'Understanding Elevator Issues'
      },
      {
        type: 'paragraph',
        text: 'Elevators are complex systems requiring regular maintenance. Understanding common problems helps in quick identification and professional repair.'
      },
      {
        type: 'list',
        items: [
          'Door alignment and operation issues',
          'Unusual noises during operation',
          'Slow or jerky movements',
          'Button and control malfunctions',
          'Emergency system failures'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'elevator-services',
    author: 'Elevator Services',
    date: 'Jan 6, 2024',
    tags: ['Elevator Repair', 'Building Maintenance', 'Safety', 'Professional Services']
  },
  {
    id: 6,
    title: "SMART TV MAINTENANCE: KEEP YOUR TELEVISION RUNNING SMOOTHLY",
    excerpt: "Smart TVs require proper maintenance to function optimally. Learn essential care tips to extend your TV's lifespan and performance.",
    content: [
      {
        type: 'heading',
        text: 'Smart TV Care Essentials'
      },
      {
        type: 'paragraph',
        text: 'Smart TVs combine entertainment with technology, requiring specific maintenance approaches to ensure longevity and optimal performance.'
      },
      {
        type: 'list',
        items: [
          'Regular software updates',
          'Proper cleaning techniques',
          'Ventilation maintenance',
          'Cable management',
          'Power surge protection'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/6316986/pexels-photo-6316986.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'tv-repair',
    author: 'TV Repair Services',
    date: 'Jan 4, 2024',
    tags: ['TV Repair', 'Smart TV', 'Electronics', 'Maintenance']
  },
  {
    id: 7,
    title: "LAPTOP BATTERY REPAIR: COMPLETE DIAGNOSTIC GUIDE",
    excerpt: "Laptop battery issues can significantly impact productivity. Learn comprehensive diagnostic and repair solutions for optimal performance.",
    content: [
      {
        type: 'heading',
        text: 'Laptop Battery Diagnostics'
      },
      {
        type: 'paragraph',
        text: 'Battery problems are common in laptops. This guide covers diagnostic techniques and repair solutions to restore your laptop\'s portability.'
      },
      {
        type: 'list',
        items: [
          'Battery health assessment',
          'Calibration procedures',
          'Replacement considerations',
          'Power management optimization',
          'Charging system repairs'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'laptop-repair',
    author: 'Laptop Repair Services',
    date: 'Jan 2, 2024',
    tags: ['Laptop Repair', 'Battery Replacement', 'Computer Services', 'Tech Support']
  },
  {
    id: 8,
    title: "WATER LEAK DETECTION: ADVANCED PROFESSIONAL METHODS",
    excerpt: "Hidden water leaks can cause significant damage. Discover professional detection methods to locate and address leaks quickly.",
    content: [
      {
        type: 'heading',
        text: 'Professional Leak Detection'
      },
      {
        type: 'paragraph',
        text: 'Water leaks can remain hidden for months, causing structural damage. Professional detection methods help identify leaks without destructive investigation.'
      },
      {
        type: 'list',
        items: [
          'Electronic leak detection equipment',
          'Thermal imaging technology',
          'Acoustic detection methods',
          'Pressure testing systems',
          'Moisture mapping techniques'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/4506198/pexels-photo-4506198.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'water-leak-detection',
    author: 'Water Leak Detection Services',
    date: 'Dec 30, 2023',
    tags: ['Water Leaks', 'Plumbing', 'Leak Detection', 'Water Damage']
  },
  {
    id: 9,
    title: "COMPUTER REPAIR: HARDWARE AND SOFTWARE SOLUTIONS",
    excerpt: "Comprehensive computer repair services covering both hardware failures and software issues with professional diagnostic approaches.",
    content: [
      {
        type: 'heading',
        text: 'Complete Computer Diagnostics'
      },
      {
        type: 'paragraph',
        text: 'Computer problems can disrupt productivity. Our comprehensive approach addresses both hardware and software issues with professional expertise.'
      },
      {
        type: 'list',
        items: [
          'Hardware component testing',
          'Software troubleshooting',
          'Virus removal and security',
          'Data recovery services',
          'Performance optimization'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/2882507/pexels-photo-2882507.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'computer-repair',
    author: 'Computer Repair Services',
    date: 'Dec 28, 2023',
    tags: ['Computer Repair', 'Hardware', 'Software', 'Tech Support']
  },
  {
    id: 10,
    title: "ELECTRICAL SERVICES: SAFE AND RELIABLE SOLUTIONS",
    excerpt: "Professional electrical services ensuring safety and compliance with all installations, repairs, and maintenance work.",
    content: [
      {
        type: 'heading',
        text: 'Professional Electrical Work'
      },
      {
        type: 'paragraph',
        text: 'Electrical work requires expertise and safety compliance. Our licensed electricians provide reliable solutions for all electrical needs.'
      },
      {
        type: 'list',
        items: [
          'Electrical installations',
          'Circuit repairs and upgrades',
          'Safety inspections',
          'Emergency electrical services',
          'Code compliance work'
        ]
      }
    ],
    image: 'https://images.pexels.com/photos/298660/pexels-photo-298660.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'electrical-services',
    author: 'Electrical Services',
    date: 'Dec 26, 2023',
    tags: ['Electrical', 'Safety', 'Installation', 'Professional Services']
  }
];
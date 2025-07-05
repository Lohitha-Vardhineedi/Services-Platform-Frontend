import React, { FC } from 'react';
import { FaBolt } from 'react-icons/fa6';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
import { MdOutlineStar } from 'react-icons/md';
import { RiDiscountPercentFill } from 'react-icons/ri';

// Type for select option
interface SelectOption {
  value: string;
  label: string;
}

// Type for select filter
interface FilterSelect {
  id: string;
  label: string;
  options: SelectOption[];
}

// Type for icon filter
interface FilterIcon {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const FILTER_SELECTS: FilterSelect[] = [
  // {
  //   id: 'sortBy',
  //   label: 'Sort By',
  //   options: [
  //     { value: 'relevance', label: 'Relevance' },
  //     { value: 'rating', label: 'Rating' },
  //     { value: 'popular', label: 'Popular' },
  //     { value: 'distance', label: 'Distance' },
  //   ],
  // },
  // {
  //   id: 'services',
  //   label: 'Services',
  //   options: [
  //     { value: 'authorised', label: 'Authorised' },
  //     { value: 'doorStep', label: 'Door Step' },
  //   ],
  // },
  // {
  //   id: 'ratings',
  //   label: 'Ratings',
  //   options: [
  //     { value: '1.0', label: '1.0' },
  //     { value: '2.0', label: '2.0' },
  //     { value: '3.0', label: '3.0' },
  //     { value: '4.0', label: '4.0' },
  //     { value: '5.0', label: '5.0' },
  //   ],
  // },
];

const FILTER_ICONS: FilterIcon[] = [
  {
    id: 'topRated',
    label: 'Top Rated',
    icon: <MdOutlineStar size={23} color="#ffc71b" className='flex'/>,
  },
  {
    id: 'popular',
    label: 'Popular',
    icon: <MdOutlineStar size={23} color="#00b800" className='flex'/>,
  },
  // {
  //   id: 'quickResponse',
  //   label: 'Quick Response',
  //   icon: <FaBolt size={20} color="#00b800"  className='flex'/>,
  // },
  // {
  //   id: 'deals',
  //   label: 'Deals',
  //   icon: <RiDiscountPercentFill size={23} className='clr-purple flex'/>,
  // },
  {
    id: 'allFilters',
    label: 'All Filters',
    icon: <HiAdjustmentsHorizontal size={23} className='clr-blue flex'/>,
  },
];

export const ServiceFilters: FC = () => {
  return (
    <div className="flex flex-wrap my-3 gap-4 px-2">
      {FILTER_SELECTS.map((select) => (
        <div
          key={select.id}
          className="border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300"
        >
          <select
            className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
            defaultValue=""
            aria-label={select.label}
          >
            <option value="" disabled hidden>
              {select.label}
            </option>
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {FILTER_ICONS.map((filter) => (
        <div
          key={filter.id}
          className="border border-gray-500 shadow py-2 px-4 flex items-center rounded-xl cursor-pointer hover:bg-fuchsia-300"
        >
          {filter.icon}
          <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2">
            {filter.label}
          </span>
        </div>
      ))}
    </div>
  );
};


// import React from 'react';
// import { FaBolt } from 'react-icons/fa6';
// import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
// import { MdOutlineStar } from 'react-icons/md';
// import { RiDiscountPercentFill } from 'react-icons/ri';

// const FILTER_SELECTS = [
//   {
//     id: 'sortBy',
//     label: 'Sort By',
//     options: [
//       { value: 'relevance', label: 'Relevance' },
//       { value: 'rating', label: 'Rating' },
//       { value: 'popular', label: 'Popular' },
//       { value: 'distance', label: 'Distance' },
//     ],
//   },
//   {
//     id: 'services',
//     label: 'Services',
//     options: [
//       { value: 'authorised', label: 'Authorised' },
//       { value: 'doorStep', label: 'Door Step' },
//     ],
//   },
//   {
//     id: 'ratings',
//     label: 'Ratings',
//     options: [
//       { value: '1.0', label: '1.0' },
//       { value: '2.0', label: '2.0' },
//       { value: '3.0', label: '3.0' },
//       { value: '4.0', label: '4.0' },
//       { value: '5.0', label: '5.0' },
//     ],
//   },
// ];

// const FILTER_ICONS = [
//   {
//     id: 'topRated',
//     label: 'Top Rated',
//     icon: <MdOutlineStar size={23} color="#ffc71b" />,
//   },
//   {
//     id: 'quickResponse',
//     label: 'Quick Response',
//     icon: <FaBolt size={20} color="#00b800" />,
//   },
//   {
//     id: 'deals',
//     label: 'Deals',
//     icon: <RiDiscountPercentFill size={23} className=" d-flex clr-purple" />,
//   },
//   {
//     id: 'allFilters',
//     label: 'All Filters',
//     icon: <HiAdjustmentsHorizontal size={23} className=" d-flex clr-blue"/>,
//   },
// ];

// export const ServiceFilters = () => {
//   return (
//     <div className="flex flex-wrap my-3 gap-4 px-2">
//       {FILTER_SELECTS.map((select) => (
//         <div
//           key={select.id}
//           className="border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300"
//         >
//           <select
//             className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
//             defaultValue=""
//             aria-label={select.label}
//           >
//             <option value="" disabled hidden>
//               {select.label}
//             </option>
//             {select.options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       ))}

//       {FILTER_ICONS.map((filter) => (
//         <div
//           key={filter.id}
//           className="border border-gray-500 shadow py-2 px-4 flex items-center rounded-xl cursor-pointer hover:bg-fuchsia-300"
//         >
//           {filter.icon}
//           <span className="text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2">
//             {filter.label}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };


// import React from 'react'
// import { FaBolt } from 'react-icons/fa6'
// import { HiAdjustmentsHorizontal } from 'react-icons/hi2'
// import { MdOutlineStar } from 'react-icons/md'
// import { RiDiscountPercentFill } from 'react-icons/ri'

// export const ServiceFilters = () => {
//   return (
//     <div className='flex flex-wrap my-3 gap-4 px-2 '>
//       <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300'>
//         <select className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
//           defaultValue="">
//           <option value="" disabled hidden>
//             Sort By
//           </option>
//           <option value="relevance">Relevance</option>
//           <option value="rating">Rating</option>
//           <option value="popular">Popular</option>
//           <option value="distance">Distance</option>
//         </select>
//       </div>

//       <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300'>
//         <select className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
//           defaultValue="">
//           <option value="" disabled hidden>
//             Services
//           </option>
//           <option value="authorised">Authorised</option>
//           <option value="doorStep">Door Step</option>
//         </select>
//       </div>

//       <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
//         <MdOutlineStar size={23} className=" d-flex" color="#ffc71b" />
//         <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>Top Rated</span>

//       </div>
//       <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
//         <FaBolt size={20} className=" d-flex"  color='#00b800'/>
//         <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>Quick Response</span>

//       </div>
//       <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
//         <RiDiscountPercentFill size={23} className=" d-flex clr-purple"  />
//         <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>Deals</span>

//       </div>
//       <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300'>
//         <select className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
//           defaultValue="">
//           <option value="" disabled hidden>
//             Ratings
//           </option>
//           <option value="relevance">1.0</option>
//           <option value="rating">2.0</option>
//           <option value="popular">3.0</option>
//           <option value="distance">4.0</option>
//           <option value="distance">5.0</option>
//         </select>
//       </div>
//       <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
//         <HiAdjustmentsHorizontal size={23} className=" d-flex clr-blue"  />
//         <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>All Filters</span>

//       </div>

//     </div>

//   )
// }
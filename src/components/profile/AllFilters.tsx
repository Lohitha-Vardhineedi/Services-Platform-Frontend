import React, { useState, useEffect } from "react";
import Photos from "./Photos.jsx";
import Services from "./Services.jsx";
import Reviews from "./Reviews.jsx";
import { TechnicianService } from "../../pages/ProfilePage.js";

interface AllFiltersProps {
  services: TechnicianService[];
  technician: Technician;
  technicianImages: string[];
  ratings: any;
}
const AllFilters: React.FC<AllFiltersProps> = ({
  services,
  technicianImages,
  ratings,
  technician
}) => {

  const [activeTab, setActiveTab] = useState("Overview");

  const FILTERS =["Overview", "Photos", "Services", "Reviews"]

  const renderContent = () => {
    if (activeTab === "Overview") {
      return (
        <>
          <Photos images={technicianImages}/>
            <Services services={services} technician={technician}/>
          <Reviews ratings={ratings} />
          {/* <FreqQ /> */}
        </>
      );
    }
    switch (activeTab) {
      case "Photos":
        return <Photos images={technicianImages} />;
      case "Services":
        return <Services services={services} technician={technician}/>;
      case "Reviews":
        return <Reviews ratings={ratings} />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4  mt-8 flex flex-col md:felx-row gap-3 p-2">
      <div className="flex-1">
        <div className="flex gap-4">
          {FILTERS.map((item) => (
            <div
              className={`flex border-2  rounded-xl py-1 px-6 text-md sm:text-md md:text-lg lg:text-lg xl:text-lg font-extralight hover:bg-fuchsia-300 cursor-pointer shadow 
                ${activeTab === item ? "bg-purple text-white border-fuchsia-800 " : "border-gray-400"}
                `}
              key={item}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="my-5 ">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AllFilters;
// import React, { useState, useEffect } from "react";
// import Photos from "./Photos.jsx";
// import Services from "./Services.jsx";
// import Reviews from "./Reviews.jsx";
// import { TechnicianService } from "../../pages/ProfilePage.js";

// interface AllFiltersProps {
//   services: TechnicianService[];
//   technicianImages: string[];
//   ratings: any;
// }
// const AllFilters: React.FC<AllFiltersProps> = ({
//   services,
//   technicianImages,
//   ratings,
// }) => {

//   const [activeTab, setActiveTab] = useState("Overview");

//   const FILTERS =["Overview", "Photos", "Services", "Reviews"]

//   const renderContent = () => {
//     if (activeTab === "Overview") {
//       return (
//         <>
//           <Photos images={technicianImages}/>
//             <Services services={services} />
//           <Reviews ratings={ratings} />
//           {/* <FreqQ /> */}
//         </>
//       );
//     }
//     switch (activeTab) {
//       case "Photos":
//         return <Photos images={technicianImages} />;
//       case "Services":
//         return <Services services={services} />;
//       case "Reviews":
//         return <Reviews ratings={ratings} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="mb-4  mt-8 flex flex-col md:felx-row gap-3 p-2">
//       <div className="flex-1">
//         <div className="flex gap-4">
//           {FILTERS.map((item) => (
//             <div
//               className={`flex border-2  rounded-xl py-1 px-6 text-md sm:text-md md:text-lg lg:text-lg xl:text-lg font-extralight hover:bg-fuchsia-300 cursor-pointer shadow 
//                 ${activeTab === item ? "bg-purple text-white border-fuchsia-800 " : "border-gray-400"}
//                 `}
//               key={item}
//               onClick={() => setActiveTab(item)}
//             >
//               {item}
//             </div>
//           ))}
//         </div>

//         <div className="my-5 ">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllFilters;
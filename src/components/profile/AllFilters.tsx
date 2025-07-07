import React, { useState, useEffect } from "react";
import {
  FaCartPlus,
  FaRegComment,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa6";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineStar } from "react-icons/md";
import { PiShareFatBold } from "react-icons/pi";
import { TiStarOutline } from "react-icons/ti";
import Photos from "./Photos.jsx";
import Services from "./Services.jsx";
import Reviews from "./Reviews.jsx";
import FreqQ from "./FreqQ.jsx";

const AllFilters = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const FILTERS =
    role === "technician"
      ? ["Overview", "Photos", "Services", "Reviews"]
      : ["Overview", "Photos", "Services", "Reviews", "Frequent Q & A"];

  const renderContent = () => {
    if (activeTab === "Overview") {
      return (
        <>
          <Photos />
          <Services />
          <Reviews />
          {role !== "technician" && <FreqQ />}
        </>
      );
    }
    switch (activeTab) {
      case "Photos":
        return <Photos />;
      case "Services":
        return <Services />;
      case "Reviews":
        return <Reviews />;
      case "Frequent Q & A":
        return role !== "technician" ? <FreqQ /> : null;
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
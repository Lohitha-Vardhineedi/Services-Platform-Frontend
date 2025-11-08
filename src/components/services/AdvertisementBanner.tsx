import React, { useState, useEffect } from "react";
import b1 from "../../asserts/b1.jpg";
import b2 from "../../asserts/b2.jpg";
import b3 from "../../asserts/b3.jpg";


const ads = [b1, b2, b3];
  // "https://img.freepik.com/premium-photo/service-concept-person-hand-holding-service-icon-virtual-screen_1296497-175.jpg?semt=ais_hybrid&w=740",
  // "https://www.shutterstock.com/image-photo/african-american-carpenter-man-look-600nw-2251298121.jpg",
  // "https://media.istockphoto.com/id/1395783965/photo/plumbing-technician-checking-water-installation-with-notepad-ok-gesture.jpg?s=612x612&w=0&k=20&c=At0CYTgR0t5Uw2lf7jIOo4GAh6mUu2WNyDbV2u3bMRs=",
  // "https://www.shutterstock.com/image-photo/hvac-technician-performing-air-conditioner-600nw-2488702851.jpg",

const AdvertisementBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full sm:h-40 md:h-44 lg:h-48 relative overflow-hidden rounded-xl shadow-lg mb-6">
      <img
        src={ads[currentIndex]}
        alt="Advertisement"
        className="w-full h-full object-cover transition-all duration-700"
      />
      {/* <div className="absolute bottom-2 right-2 text-white bg-black/50 px-3 py-1 rounded text-sm">
        Ad {currentIndex + 1} of {ads.length}
      </div> */}
    </div>
  );
};

export default AdvertisementBanner;

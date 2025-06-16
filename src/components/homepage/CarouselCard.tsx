import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function CarouselCard() {
  const slides = [
    {
      title: "Get Loan Against Property",
      subtitle: "At a competitive interest rate starting from ",
      highlight: "9.00%",
      subtext: "by Jio Finance Limited",
      button: "Apply Now",
      image: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&w=400&h=400&fit=crop"
    },
    {
      title: "Summer Offers",
      subtitle: "Coolers, ACs, and more starting from ",
      highlight: "₹2999",
      subtext: "Best deals this season",
      button: "Explore Now",
      image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&w=400&h=400&fit=crop"
    },
    {
      title: "Business Loans",
      subtitle: "Get instant approval up to ",
      highlight: "₹10L",
      subtext: "For your business needs",
      button: "Get Quote",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&w=400&h=400&fit=crop"
    }
  ];
  const [current, setCurrent] = React.useState(0);
  const slide = slides[current];
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const [hover, setHover] = React.useState(false);

  // Auto-advance carousel every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="flex-[2.5_2.5_0%] h-48 bg-amber-50 rounded-2xl shadow-lg flex items-stretch overflow-hidden min-w-0 relative">
      <div className="flex-1 flex flex-col justify-center p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{slide.title}</h3>
        <p className="text-gray-700 mb-2">
          {slide.subtitle}
          <span className="font-bold text-orange-600">{slide.highlight}</span> {slide.subtext}
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold mt-2 w-fit">{slide.button}</button>
      </div>
      <div
        className="h-full w-40 flex-shrink-0 rounded-r-2xl overflow-hidden group relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
        {hover && (
          <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-base font-semibold rounded-r-2xl transition-opacity">
            Explore
          </button>
        )}
      </div>
      {/* Carousel indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, idx) => (
          <span key={idx} className={`w-2 h-2 rounded-full ${idx === current ? 'bg-orange-500' : 'bg-gray-300'}`}></span>
        ))}
      </div>
      {/* Prev/Next buttons */}
      <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-md z-10">
        <ChevronLeft className="w-5 h-5 text-gray-500" />
      </button>
      <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-md z-10">
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
}

export default CarouselCard; 
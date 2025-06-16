import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarouselCard from './CarouselCard';
import { serviceCards, serviceCardBgColors } from '../data/serviceCardsData';

// ServiceCardsRow component
function ServiceCardsRow() {
  return (
    <div className="mb-12">
      <div className="flex flex-row gap-2 items-stretch">
        {/* Carousel Card (real carousel) */}
        <CarouselCard />
        {/* Service Cards (half text, half image, always in same row, with Explore overlay via CSS) */}
        {serviceCards.slice(1, 5).map((card, index) => (
          <div
            key={index}
            className={`flex-1 min-w-0 h-48 rounded-2xl shadow-lg flex items-stretch overflow-hidden group ${serviceCardBgColors[index]}`}
          >
            <div className="flex flex-col justify-center p-2 w-1/2">
              <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
              <p className="text-xs text-white opacity-90">{card.subtitle}</p>
            </div>
            <div
              className="h-full w-1/2 flex-shrink-0 rounded-r-2xl overflow-hidden group relative"
            >
              <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
              <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-base font-semibold rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceCardsRow; 
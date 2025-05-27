// SimpleSlider.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import { advertiseMentCaursol } from "../../Utils/constant";

const SimpleSlider = () => {
  return (
    <div style={{ width: "100%", maxWidth: "800px" }}>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {advertiseMentCaursol?.map((item) => (
          <SwiperSlide key={item?.id}>
            <img
              src={item?.image}
              alt={item?.alt}
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SimpleSlider;

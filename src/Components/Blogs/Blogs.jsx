import React from "react";
import Slider from "react-slick";
import "./blogs.css";
import { blogDetails } from "../../Utils/constant";
function BlogCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 8000, // long duration for smooth scroll
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // scroll immediately
    cssEase: "linear", // no ease-in-out, just smooth linear
    pauseOnHover: false,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {blogDetails?.map((item) => (
          <div className="slide-item">
            <div
              className="blog-card bg-white rounded-xl overflow-hidden drop-shadow-xl"
              style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
            >
              <img src={item?.imageUrl} className="blog-image" />
              <h5 className="blog-text">{item?.blog}</h5>
            </div>{" "}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BlogCarousel;

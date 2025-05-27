import Container from "react-bootstrap/esm/Container";
import Layout from "../../Components/Layout/Layout";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import "./categoryDetails.css";
import { FaThumbsUp } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { categoryDetails } from "../../Utils/constant";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Carousel } from "react-bootstrap";

const CategoryDetailPage = () => {
  const navigate = useNavigate();
  const handleNavgateProfile = () => {
    navigate("/profile");
  };
  return (
    <Layout>
      <div style={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}>
        <Container fluid>
          <Row className="mt-3">
            <Col xs={12}>
              <div className="filter-toolbar d-flex align-items-center flex-wrap gap-3 mb-4 px-2 py-2">
                <div className="horizontal-filter-bar d-flex overflow-auto flex-nowrap gap-2">
                  <button className="filter-pill active">All</button>
                  <button className="filter-pill">✅ Verified</button>
                  <button className="filter-pill">🎯 Nearby</button>
                  <button className="filter-pill">🆕 New</button>
                  <button className="filter-pill">💬 Offers</button>
                  <button className="filter-pill">⏱ Open Now</button>
                  <button className="filter-pill">📍 Hyderabad</button>
                </div>

                <div className="dropdown-group d-flex gap-2 ms-auto">
                  <div className="sort-dropdown">
                    <label htmlFor="sortBy" className="dropdown-label">
                      Sort
                    </label>
                    <select id="sortBy" className="dropdown-select">
                      <option value="name">Name</option>
                      <option value="latest">Latest</option>
                      <option value="popular">Popular</option>
                    </select>
                  </div>

                  <div className="sort-dropdown">
                    <label htmlFor="ratingSort" className="dropdown-label">
                      Rating
                    </label>
                    <select id="ratingSort" className="dropdown-select">
                      <option value="high">High → Low</option>
                      <option value="low">Low → High</option>
                    </select>
                  </div>
                </div>
              </div>
            </Col>
            {categoryDetails?.map((item) => (
              <Col xs={12} md={6} lg={4} className="mb-4" key={item?.id}>
                <div className="custom-card-white">
                  {/* 🔼 Top Image Slider */}
                  <Carousel indicators={false} interval={3000} controls={false}>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 card-img"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX0Sdu4GQRYR6ZcImN8APY2jIPYga1hC9D2jsmUjCYi6tvE51KRsBdAIWNhwUWh1WnrBM&usqp=CAU"
                        alt="Slide 1"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100 card-img"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPgU7xqfZlfGPjFVn3TRhyTNw9-n9QxPLAgw&s"
                        alt="Slide 2"
                      />
                    </Carousel.Item>
                  </Carousel>

                  {/* 📄 Card Content */}
                  <div className="custom-card-body-white p-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="custom-icon-white me-2">
                        <FaThumbsUp />
                      </div>
                      <h5 className="mb-0 fw-bold text-dark">
                        AC Repair & Services
                      </h5>
                    </div>

                    <div className="rating mb-2 text-muted">
                      <IoIosStar className="text-warning" /> 3.7 | 67 Ratings
                    </div>

                    <div className="location text-muted small mb-3">
                      <IoLocationOutline className="me-1" />
                      SR Nagar, Hyderabad • 2 KM
                      <MdVerified className="ms-2 text-success" />
                    </div>

                    <button
                      className="custom-btn-white"
                      onClick={handleNavgateProfile}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </Layout>
  );
};
export default CategoryDetailPage;

import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import "./profilePage.css";
import Layout from "../../Components/Layout/Layout";
import BookingPopup from "../../Components/Popups/BookingPopup/BookingPopup";
import { Link } from "react-router-dom";

const servicesList = [
  { id: 1, name: "AC Gas Filling", price: 1200 },
  { id: 2, name: "AC General Service", price: 500 },
  { id: 3, name: "AC Installation", price: 1500 },
  { id: 4, name: "AC Uninstallation", price: 800 },
  { id: 5, name: "AC Water Leak Repair", price: 1000 },
];
const reviews = [
  {
    name: "Ravi Kumar",
    rating: 5,
    comment: "Excellent service! Quick and clean job. Highly recommended.",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Neha Sharma",
    rating: 4,
    comment: "Very professional and polite. Fixed my AC leak efficiently.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Suresh Yadav",
    rating: 5,
    comment: "Best AC technician in Hyderabad! Honest and knowledgeable.",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
  },
];
const averageRating =
  reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

const workImages = [
  {
    id: 1,
    src: "https://content.jdmagicbox.com/v2/comp/hyderabad/v2/040pxx40.xx40.180831193416.k1v2/catalogue/royal-cooling-solutions-chilakalguda-hyderabad-ac-repair-and-services-vmeeigl79r.jpg",
    alt: "AC Install 1",
  },
  {
    id: 2,
    src: "https://clareservices.com/wp-content/uploads/2021/05/technician-service-removing-air-filter-air-conditioner-cleaning_35076-3617.jpg",
    alt: "AC Repair",
  },
  {
    id: 3,
    src: "https://www.shutterstock.com/image-photo/hvac-technician-performing-air-conditioner-260nw-2488702851.jpg",
    alt: "Water Leak Fix",
  },
  {
    id: 4,
    src: "https://epichomeservice.in/wp-content/uploads/2024/10/repairman-in-uniform-installing-the-outside.jpg.webp",
    alt: "Gas Filling",
  },
  {
    id: 5,
    src: "https://jonwayne.com/uploads/_transformed/uploads/207944/Jon-Wayne-AC-Repair_2023-04-13-215303_umov_e87f59.webp",
    alt: "Water Leak Fix",
  },
  {
    id: 6,
    src: "https://img.freepik.com/free-photo/repairman-doing-air-conditioner-service_1303-26541.jpg?semt=ais_hybrid&w=740",
    alt: "Gas Filling",
  },
];
const otherServiceCategories = [
  {
    id: 2,
    categoryImage:
      "https://prnvservices.com/uploads/category_images/images/227ab8bc89a8a895ad7002b329b855e9.svg",
    categoryName: "Carpenter Services",
  },
  {
    id: 3,
    categoryImage:
      "https://prnvservices.com/uploads/category_images/images/5835f8611630dea5bdf479bcf69a1a86.svg",
    categoryName: "CCTV Repair & Services",
  },
  {
    id: 4,
    categoryImage:
      "https://prnvservices.com/uploads/category_images/images/21714e4a1cddf969cd37a1708148a0b2.svg",
    categoryName: "Chimney Repair & Services",
  },
  {
    id: 5,
    categoryImage:
      "https://prnvservices.com/uploads/category_images/images/d55eebac38ffb4552057d6bbe985bc66.svg",
    categoryName: "Computer/Laptop Repair & Services",
  },
];

const PartnerProfilePage = () => {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const customer = { name: "Mounika", phone: "9876543210" };
  const technician = { name: "Venkat", phone: "9123456789" };

  const handleAddToCart = (service) => {
    if (!cart.find((item) => item.id === service.id)) {
      setCart([...cart, service]);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
  const discount = totalPrice > 1000 ? totalPrice * 0.2 : 0;
  const netPrice = totalPrice - discount;
  const gst = 0;
  const finalPrice = netPrice + gst;

  return (
    <Layout>
      <Container className="my-4">
        {/* Profile Header */}
        <div className="profile-header shadow-lg text-center p-4 rounded">
          <img
            src="https://img.freepik.com/premium-photo/young-man-isolated-blue_1368-124991.jpg?semt=ais_hybrid&w=740"
            alt="Profile"
            className="profile-image mb-3"
          />
          <h2>Aakula Ramesh</h2>
          <p>AC Technician | Kukatpally, Hyderabad</p>
        </div>
        <Link to="/leads">
          <Button
            variant="primary"
            className="mt-3 "
            style={{ backgroundColor: "var(--crimson-red)" }}
          >
            Leads
          </Button>
        </Link>
        {/* Profile Info */}
        <Row className="g-4 mt-4">
          <Col md={6}>
            <div className="profile-box p-3 shadow-sm rounded">
              <h5>📞 Contact Information</h5>
              <p>
                <strong>Phone:</strong> 9999999999
              </p>
              <p>
                <strong>Email:</strong> ramesh@example.com
              </p>
              <p>
                <strong>Location:</strong> Kukatpally, Hyderabad
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="profile-box p-3 shadow-sm rounded">
              <h5>🛠️ Service Info</h5>
              <p>Specialist in Split & Window ACs.</p>
              <p>10+ years experience.</p>
              <p>Verified Professional ✅</p>
            </div>
          </Col>
        </Row>

        {/* Services Section */}
        <h4 className="mt-5 mb-3 service-heading">🧰 Available Services</h4>
        <Row className="g-4">
          {servicesList.map((service) => (
            <Col md={4} key={service.id}>
              <Card
                className={
                  cart.find((item) => item.id === service.id)
                    ? "service-card-selected"
                    : "service-card"
                }
              >
                <Card.Body>
                  <Card.Title>{service.name}</Card.Title>
                  <Card.Text className="text-muted">₹{service.price}</Card.Text>
                  {cart.find((item) => item.id === service.id) ? (
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveFromCart(service.id)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="dark"
                      onClick={() => handleAddToCart(service)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Cart Section */}
        {cart.length > 0 && (
          <div className="cart-box mt-5 shadow-sm p-4 rounded">
            <h5>
              🛒 Your Cart <Badge bg="success">{cart.length}</Badge>
            </h5>
            <ul className="mt-3">
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} - ₹{item.price}
                </li>
              ))}
            </ul>

            <hr />
            <div className="price-details">
              <p>
                <strong>Total Price:</strong> ₹{totalPrice}
              </p>
              {discount > 0 && (
                <p className="text-success">
                  🎉 Special Discount (20%): -₹{discount.toFixed(0)}
                </p>
              )}
              <p>
                <strong>GST:</strong> ₹{gst}
              </p>
              <p>
                <strong>Net Price:</strong> ₹{netPrice}
              </p>
              <p>
                <strong>Final Price:</strong> ₹{finalPrice}
              </p>
            </div>

            <div className="text-end mt-3">
              <Button
                variant="success"
                size="lg"
                onClick={() => setShowModal(true)}
                // onClick={() =>
                //   window.open(
                //     `https://wa.me/919999999999?text=Hi Ramesh, I would like to book AC service worth ₹${finalPrice}`,
                //     "_blank"
                //   )
                // }
              >
                Book Now
              </Button>
              <BookingPopup
                show={showModal}
                onClose={() => setShowModal(false)}
                customer={customer}
                technician={technician}
              />
            </div>
          </div>
        )}
        {/* Reviews & Ratings Section */}
        <div className="reviews-section mt-5">
          <h4 className="mb-4">🌟 Customer Reviews</h4>
          <Row className="g-4">
            {reviews.map((review, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="review-card h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="rounded-circle me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="mb-0">{review.name}</h6>
                        <div className="text-warning">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <i className="bi bi-star-fill" key={i}></i>
                          ))}
                          {Array.from({ length: 5 - review.rating }).map(
                            (_, i) => (
                              <i className="bi bi-star" key={i}></i>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted">{review.comment}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {/* Average Rating Section */}
        <div className="average-rating-box text-center my-5 p-4 shadow-sm rounded">
          <h4 className="mb-3">⭐ Overall Rating</h4>
          <h1 className="display-4 fw-bold text-warning">
            {averageRating.toFixed(1)} / 5
          </h1>
          <div className="text-warning fs-4">
            {Array.from({ length: Math.floor(averageRating) }).map((_, i) => (
              <i className="bi bi-star-fill" key={i}></i>
            ))}
            {averageRating % 1 !== 0 && <i className="bi bi-star-half"></i>}
            {Array.from({ length: 5 - Math.ceil(averageRating) }).map(
              (_, i) => (
                <i className="bi bi-star" key={i}></i>
              )
            )}
          </div>
          <p className="text-muted mt-2">{reviews.length} reviews submitted</p>
        </div>
        {/* Work Gallery Section */}
        <div className="work-gallery-section mt-5">
          <h4 className="mb-4 text-center">📷 Work Gallery</h4>
          <Row className="g-4">
            {workImages.map((img) => (
              <Col xs={12} sm={6} md={4} key={img.id}>
                <Card className="work-gallery-card shadow-sm">
                  <Card.Img
                    variant="top"
                    src={img.src}
                    alt={img.alt}
                    className="gallery-img"
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {/* Other Categories Section */}
        <div className="mt-5">
          <h4 className="mb-4 text-center">
            💡 You Might Also Like Other Services
          </h4>
          <Row className="g-4 justify-content-center">
            {otherServiceCategories.map((category) => (
              <Col xs={12} sm={6} md={4} lg={3} key={category.id}>
                <Card className="category-card text-center p-3 h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={category.categoryImage}
                    className="category-image mx-auto"
                    alt={category.categoryName}
                  />
                  <Card.Body>
                    <Card.Title className="fs-6">
                      {category.categoryName}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </Layout>
  );
};

export default PartnerProfilePage;

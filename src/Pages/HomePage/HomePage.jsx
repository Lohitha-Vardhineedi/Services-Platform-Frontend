import Container from "react-bootstrap/esm/Container";
import Layout from "../../Components/Layout/Layout";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import "./home.css";
import ImageSlider from "../../Components/carousel/Carousel";
import SimpleSlider from "../../Components/carousel/Carousel";
import {
  categoryDetails,
  howItWorksSectionDetails,
} from "../../Utils/constant";
import BlogCarousel from "../../Components/Blogs/Blogs";
import CategoryDetails from "../../Components/CategoryCards/CategoryCards";
import HowItWorksCard from "../../Components/HowItWorksCard/HowItWorksCard";

const HomePage = () => {
  return (
    <>
      <Layout>
        <div className="home-page">
          <Container fluid>
            <Row className="g-4">
              <Col xs={12}>
                <h3 className="search-text">
                  Search across '5.9 crore+' Product and Services
                </h3>
              </Col>
              <Col sm={3} md={3}>
                <select className="form-control">
                  <option>Select Category</option>
                  <option>Ac Repair</option>
                </select>
              </Col>
              <Col sm={4} md={4}>
                <select className="form-control">
                  <option>Select Location</option>
                  <option>Hyderabad</option>
                  <option>Mumbai</option>
                </select>
              </Col>
              <Col sm={3} md={3}>
                <select className="form-control">
                  <option>Select pin code</option>
                  <option>123456</option>
                </select>
              </Col>
              <Col sm={2} md={2}>
                <button className="form-control submit-button">Search</button>
              </Col>
            </Row>
            <Row className="g-4 mt-3">
              <Col md={6}>
                <SimpleSlider />
              </Col>
              <Col md={6}>
                <SimpleSlider />
              </Col>

              <Col sm={12}>
                <h3 className="search-text">Featured Categories</h3>
              </Col>
              {categoryDetails?.map((item) => (
                <Col
                  xs={4}
                  md={3}
                  lg={2}
                  className="custom-xl-9"
                  key={item?.id}
                >
                  <CategoryDetails categoryDetails1={item} key={item?.id} />
                </Col>
              ))}
              <Col sm={12}>
                <h3 className="search-text">BLOGS</h3>
              </Col>
              <Col xs={12}>
                <BlogCarousel />
              </Col>
              <Col xs={12}>
                <h3 className="search-text">HOW IT WORKS</h3>
              </Col>
              <Col xs={0} md={2}></Col>
              <Col xs={12} md={8}>
                <p className="how-it-works-text">
                  Prnv Services is an online platform that connects customers
                  with local Verified service professionals, allowing users to
                  easily hire professionals for various services such as AC
                  Repairs, Carpenter Services, and Plumbing & so on .
                </p>
              </Col>
              <Col xs={0} md={2}></Col>
              {howItWorksSectionDetails.map((item) => (
                <Col xs={12} md={6} lg={4} key={item.id}>
                  <HowItWorksCard cardDetails={item} key={item.id} />
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </Layout>
    </>
  );
};
export default HomePage;

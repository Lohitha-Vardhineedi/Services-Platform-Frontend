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
import { useEffect, useState } from "react";
import {
  allPinCodes,
  allRegions,
  getCategoriesDetails,
} from "../../Services/APIrequests";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [regions, setRegions] = useState([]);
  const [pinCodes, setPinCodes] = useState([]);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategoriesDetails();

      setCategory(response?.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getAllRegions = async () => {
    setIsLoading(true);
    try {
      const response = await allRegions();

      setRegions(response?.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getPinCodes = async () => {
    setIsLoading(true);
    try {
      const response = await allPinCodes();

      setPinCodes(response?.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
    getAllRegions();
    getPinCodes();
  }, []);
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
                  {isLoading ? (
                    <option>Loading...</option>
                  ) : category?.length === 0 ? (
                    <option>No Data Found</option>
                  ) : (
                    <>
                      <option>Select Category</option>
                      {category?.map((item) => (
                        <option key={item?.id}>{item?.category_name}</option>
                      ))}
                    </>
                  )}
                </select>
              </Col>
              <Col sm={4} md={3}>
                <select className="form-control">
                  {isLoading ? (
                    <option>Loading...</option>
                  ) : regions?.length === 0 ? (
                    <option>No Data Found</option>
                  ) : (
                    <>
                      <option>Select Location</option>
                      {regions?.map((item) => (
                        <option key={item?.id}>{item?.sa_name}</option>
                      ))}
                    </>
                  )}
                </select>
              </Col>
              <Col sm={3} md={2}>
                <select className="form-control">
                  {isLoading ? (
                    <option>Loading...</option>
                  ) : pinCodes?.length === 0 ? (
                    <option>No Data Found</option>
                  ) : (
                    <>
                      <option>Select Pincode</option>
                      {pinCodes?.map((item) => (
                        <option key={item?.id}>
                          {item?.Pnc_Code}({item?.Pnc_aliasname})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </Col>
              <Col sm={3} md={2}>
                <select className="form-control">
                  <option>Select Area</option>
                  <option>Sr Nagar</option>
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
              {category?.map((item) => (
                <Col
                  xs={4}
                  md={3}
                  lg={2}
                  className="custom-xl-9"
                  key={item?.id}
                >
                  <CategoryDetails categoryDetails={item} key={item?.id} />
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

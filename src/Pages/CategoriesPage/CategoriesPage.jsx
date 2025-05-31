import "../HomePage/home.css";
import Layout from "../../Components/Layout/Layout";
import { Col, Container, Row } from "react-bootstrap";
import { categoryDetails } from "../../Utils/constant";
import CategoryDetails from "../../Components/CategoryCards/CategoryCards";
import { useEffect, useState } from "react";
import { getCategoriesDetails } from "../../Services/APIrequests";
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [resultCategory, setResultCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategoriesDetails();

      setCategories(response?.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
    setCategories(categoryDetails);
    setResultCategory(categoryDetails);
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    const result = categories.filter((item) =>
      item.categoryName.includes(searchValue.toLowerCase())
    );
    console.log(result);
    setResultCategory(result);
  };
  return (
    <Layout>
      <section className="home-page">
        <Container className="">
          <Row className="g-4">
            <Col xs={12}>
              <input
                type="search"
                className="form-control"
                placeholder="Search Category"
                onChange={handleSearch}
              />
            </Col>
            {categories?.length != 0 ? (
              <>
                {categories?.map((item) => (
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
              </>
            ) : (
              <>
                <h1>Not found</h1>
              </>
            )}
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
export default CategoriesPage;

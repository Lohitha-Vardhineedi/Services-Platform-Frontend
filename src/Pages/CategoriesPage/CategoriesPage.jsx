import "../HomePage/home.css";
import Layout from "../../Components/Layout/Layout";
import { Col, Container, Row } from "react-bootstrap";
import { categoryDetails } from "../../Utils/constant";
import CategoryDetails from "../../Components/CategoryCards/CategoryCards";
import { useEffect, useState } from "react";
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [resultCategory, setResultCategory] = useState([]);
  useEffect(() => {
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
            {resultCategory?.length != 0 ? (
              <>
                {resultCategory?.map((item) => (
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

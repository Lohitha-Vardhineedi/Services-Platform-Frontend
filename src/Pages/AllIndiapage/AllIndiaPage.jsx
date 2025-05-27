import { Col, Container, Row } from "react-bootstrap";
import Layout from "../../Components/Layout/Layout";
import pageStyles from "./allIndiaPage.module.css";
import EnquiryForm from "../../Components/EnquiryForm/EnquiryForm";
import CityEnquiryForm from "../../Components/CityEnquiryForm/CityEnquiryForm";
const AllIndiaPage = () => {
  return (
    <Layout>
      <section className={`${pageStyles["all-india-page"]}`}>
        <Container fluid className="p-0 m-0">
          <Row>
            <Col xs={12} sm={12} md={6}>
              <CityEnquiryForm />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <article className={`${pageStyles["card-container"]}`}>
                <EnquiryForm />
              </article>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
export default AllIndiaPage;

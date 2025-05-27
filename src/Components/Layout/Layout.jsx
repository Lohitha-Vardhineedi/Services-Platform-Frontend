import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import TopNav from "../TopNav/TopNav";
import "./layout.css";
import Footer from "../Footer/footer";

const Layout = ({ children }) => {
  return (
    <Container fluid className="p-0 m-0">
      <Row>
        <Col xs={12}>
          <div className="nav-layout-container">
            <TopNav />
          </div>
          <div>{children}</div>
          <div style={{ width: "100%" }}>
            <Footer />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Layout;

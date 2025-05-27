import Container from "react-bootstrap/esm/Container";
import "./footer.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { FaRegBuilding } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="footer-container">
      <Container fluid>
        <Row>
          <Col md={1}></Col>
          <Col xs={12} md={3}>
            <div className="footer-start-container">
              <h2 className="footerHeading">Quick Links</h2>
              <p className="footer-desc">ABOUT US</p>
              <p className="footer-desc">CONTACT US</p>
              <p className="footer-desc">FAQ'S</p>
              <p className="footer-desc">Professional Agreement Details</p>
              <p className="footer-desc">PRNV Services Refund Policy</p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="footer-start-container">
              <h2 className="footerHeading">Contact Us</h2>
              <div className="d-flex flex-row align-items-center justify-content-center gap-3">
                <FaRegBuilding size={65} className="footerHeading" />
                <p className="footer-desc">
                  301, Sai Manor Apartments, Near Umesh Chandra Statue, Beside
                  Metro Station S.R. Nagar, Hyderabad - 500038
                </p>
              </div>
              <div className="d-flex flex-row align-items-center  gap-2">
                <FaHeadphones size={25} className="footerHeading" />
                <p className="footer-desc">9059789177, 9603558369</p>
              </div>
              <div className="d-flex flex-row align-items-center  gap-2">
                <MdEmail size={25} className="footerHeading" />
                <p className="footer-desc">prnvservices@gmail.com</p>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="footer-start-container">
              <h2 className="footerHeading">SOCIAL LINKS</h2>

              <div className="d-flex flex-row justify-content-start align-items-center gap-2">
                <div className="social-links">
                  <FaFacebookF size={20} />
                </div>
                <div className="social-links">
                  <FaTwitter size={20} />
                </div>
                <div className="social-links">
                  <FaYoutube size={20} />
                </div>
                <div className="social-links">
                  <FaLinkedin size={20} />
                </div>
                <div className="social-links">
                  <FaPinterest size={20} />
                </div>
                <div className="social-links">
                  <FaInstagram size={20} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={1}></Col>
          <Col xs={12} md={5} className="p-0 m-0">
            <div className="footer-bottom-section">
              <p>@ 2023 PRNV Services</p>
            </div>
          </Col>
          <Col xs={12} md={5} className="p-0 m-0">
            <div className="footer-bottom-section">
              <p style={{ textAlign: "right" }}>
                PRIVACY POLICY TERMS & CONDITIONS
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Footer;

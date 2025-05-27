import { useState } from "react";
import {
  Container,
  Nav,
  Tab,
  Card,
  Button,
  Form,
  Modal,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "./LeadsTabs.css";
import Layout from "../../Components/Layout/Layout";

const LeadsTabs = () => {
  const [key, setKey] = useState("notStarted");
  const [showOtpConfirm, setShowOtpConfirm] = useState(true);
  const [showWorkDoneCustomer, setShowWorkDoneCustomer] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [showSavingsPopup, setShowSavingsPopup] = useState(false);
  const [miscAmount, setMiscAmount] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);

  const baseAmount = 1000;
  const gst = 0;
  const totalAmount = baseAmount + gst + Number(miscAmount);

  const ratings = [
    { text: "Poor", value: 1 },
    { text: "Fair", value: 2 },
    { text: "Good", value: 3 },
    { text: "Very Good", value: 4 },
    { text: "Excellent", value: 5 },
  ];

  return (
    <Layout>
      <Container className="py-4" style={{ minHeight: "80vh" }}>
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
          <Nav
            variant="tabs"
            className="leads-tabs rounded shadow-sm p-2 bg-light"
          >
            <Nav.Item>
              <Nav.Link eventKey="notStarted">Not Yet Started</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="inProgress">In Progress</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="completed">Completed</Nav.Link>
            </Nav.Item>
          </Nav>
          <Container fluid>
            <Row>
              <Col xs={12} md={4}>
                <Tab.Content className="mt-4">
                  <Tab.Pane eventKey="notStarted">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Lead ID: #12345</Card.Title>
                        {showOtpConfirm ? (
                          <Button
                            variant="danger"
                            onClick={() => setShowOtpConfirm(false)}
                          >
                            Confirm OTP
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            onClick={() => setKey("inProgress")}
                          >
                            Start Work
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey="inProgress">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Customer Name: Mounika</Card.Title>
                        <Card.Text>Phone: 9876543210</Card.Text>
                        <Card.Text>Work: AC Repair</Card.Text>

                        <div className="cart- mt-4 shadow-sm p-4 rounded">
                          <h5>
                            🛒 Bill Details <Badge bg="success">1</Badge>
                          </h5>

                          <Form className="mt-3">
                            <Form.Group controlId="miscAmount">
                              <Form.Label>Add Miscellaneous Amount</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                value={miscAmount}
                                onChange={(e) => setMiscAmount(e.target.value)}
                              />
                            </Form.Group>
                          </Form>

                          <ul className="mt-3">
                            <li>Base Amount - ₹{baseAmount}</li>
                            <li>GST (0%) - ₹{gst.toFixed(2)}</li>
                            <li>Miscellaneous - ₹{miscAmount}</li>
                          </ul>

                          <hr />
                          <div className="price-details">
                            <p>
                              <strong>Total Bill:</strong> ₹
                              {totalAmount.toFixed(2)}
                            </p>
                          </div>

                          <div className="text-end mt-3">
                            <Button
                              variant="success"
                              onClick={() => setShowWorkDoneCustomer(true)}
                            >
                              Work Done
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey="completed">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Lead ID: #12345</Card.Title>

                        <Card.Title>Work Completed</Card.Title>
                        <p>Total Bill: ₹{totalAmount.toFixed(2)}</p>
                        <div className="text-end">
                          {/* <Button
                    variant="success"
                    onClick={() => setShowSavingsPopup(true)}
                  >
                    View Savings
                  </Button> */}
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
              <Col xs={12} md={4}>
                <Tab.Content className="mt-4">
                  <Tab.Pane eventKey="notStarted">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Lead ID: #12345</Card.Title>
                        {showOtpConfirm ? (
                          <Button
                            variant="danger"
                            onClick={() => setShowOtpConfirm(false)}
                          >
                            Confirm OTP
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            onClick={() => setKey("inProgress")}
                          >
                            Start Work
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey="inProgress">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Customer Name: Mounika</Card.Title>
                        <Card.Text>Phone: 9876543210</Card.Text>
                        <Card.Text>Work: AC Repair</Card.Text>

                        <div className="cart- mt-4 shadow-sm p-4 rounded">
                          <h5>
                            🛒 Bill Details <Badge bg="success">1</Badge>
                          </h5>

                          <Form className="mt-3">
                            <Form.Group controlId="miscAmount">
                              <Form.Label>Add Miscellaneous Amount</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                value={miscAmount}
                                onChange={(e) => setMiscAmount(e.target.value)}
                              />
                            </Form.Group>
                          </Form>

                          <ul className="mt-3">
                            <li>Base Amount - ₹{baseAmount}</li>
                            <li>GST (0%) - ₹{gst.toFixed(2)}</li>
                            <li>Miscellaneous - ₹{miscAmount}</li>
                          </ul>

                          <hr />
                          <div className="price-details">
                            <p>
                              <strong>Total Bill:</strong> ₹
                              {totalAmount.toFixed(2)}
                            </p>
                          </div>

                          <div className="text-end mt-3">
                            <Button
                              variant="success"
                              onClick={() => setShowWorkDoneCustomer(true)}
                            >
                              Work Done
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey="completed">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Lead ID: #12345</Card.Title>

                        <Card.Title>Work Completed</Card.Title>
                        <p>Total Bill: ₹{totalAmount.toFixed(2)}</p>
                        <div className="text-end">
                          {/* <Button
                    variant="success"
                    onClick={() => setShowSavingsPopup(true)}
                  >
                    View Savings
                  </Button> */}
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
              <Col xs={12} md={4}>
                <Tab.Content className="mt-4">
                  <Tab.Pane eventKey="notStarted">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Lead ID: #12345</Card.Title>
                        {showOtpConfirm ? (
                          <Button
                            variant="danger"
                            onClick={() => setShowOtpConfirm(false)}
                          >
                            Confirm OTP
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            onClick={() => setKey("inProgress")}
                          >
                            Start Work
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey="inProgress">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Customer Name: Mounika</Card.Title>
                        <Card.Text>Phone: 9876543210</Card.Text>
                        <Card.Text>Work: AC Repair</Card.Text>

                        <div className="cart- mt-4 shadow-sm p-4 rounded">
                          <h5>
                            🛒 Bill Details <Badge bg="success">1</Badge>
                          </h5>

                          <Form className="mt-3">
                            <Form.Group controlId="miscAmount">
                              <Form.Label>Add Miscellaneous Amount</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                value={miscAmount}
                                onChange={(e) => setMiscAmount(e.target.value)}
                              />
                            </Form.Group>
                          </Form>

                          <ul className="mt-3">
                            <li>Base Amount - ₹{baseAmount}</li>
                            <li>GST (0%) - ₹{gst.toFixed(2)}</li>
                            <li>Miscellaneous - ₹{miscAmount}</li>
                          </ul>

                          <hr />
                          <div className="price-details">
                            <p>
                              <strong>Total Bill:</strong> ₹
                              {totalAmount.toFixed(2)}
                            </p>
                          </div>

                          <div className="text-end mt-3">
                            <Button
                              variant="success"
                              onClick={() => setShowWorkDoneCustomer(true)}
                            >
                              Work Done
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane eventKey="completed">
                    <Card className="lead-card">
                      <Card.Body>
                        <Card.Title>Lead ID: #12345</Card.Title>

                        <Card.Title>Work Completed</Card.Title>
                        <p>Total Bill: ₹{totalAmount.toFixed(2)}</p>
                        <div className="text-end">
                          {/* <Button
                    variant="success"
                    onClick={() => setShowSavingsPopup(true)}
                  >
                    View Savings
                  </Button> */}
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Container>
        </Tab.Container>

        <Modal
          show={showWorkDoneCustomer}
          onHide={() => setShowWorkDoneCustomer(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Customer Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>Would you like to give a review and rating?</p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button
                variant="danger"
                onClick={() => {
                  setShowReviewPopup(false);
                  setShowWorkDoneCustomer(false);
                  setShowCongratsPopup(true);
                  setKey("completed");
                }}
              >
                Skip
              </Button>
              <Button
                variant="dark"
                onClick={() => {
                  setShowWorkDoneCustomer(false);
                  setShowReviewPopup(true);
                }}
              >
                Yes, Give Review
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showReviewPopup}
          onHide={() => setShowReviewPopup(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Submit Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="reviewTextarea">
                <Form.Label>Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="ratingSelect" className="mt-3">
                <Form.Label>Rating</Form.Label>
                <div className="d-flex justify-content-between">
                  {ratings.map(({ text, value }) => (
                    <div
                      key={value}
                      className={`text-center rating-option ${
                        selectedRating === value ? "selected" : ""
                      }`}
                      onClick={() => setSelectedRating(value)}
                      style={{ cursor: "pointer" }}
                    >
                      <FaStar className="text-warning" />
                      <div>{text}</div>
                    </div>
                  ))}
                </div>
              </Form.Group>
              <div className="text-center mt-4">
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowReviewPopup(false);
                    setShowCongratsPopup(true);
                    setKey("completed");
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showCongratsPopup}
          onHide={() => setShowCongratsPopup(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Congratulations!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>You have 1 week work guarantee.</p>
            <Button
              variant="success"
              onClick={() => {
                setShowCongratsPopup(false);
                setShowSavingsPopup(true);
              }}
            >
              OK
            </Button>
          </Modal.Body>
        </Modal>

        <Modal
          show={showSavingsPopup}
          onHide={() => setShowSavingsPopup(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-success">🎉 Your Savings</Modal.Title>
          </Modal.Header>
          <Modal.Body className="savings-body animate-fade-in">
            <p>Base Amount: ₹{baseAmount}</p>
            <p>GST (0%): ₹{gst.toFixed(2)}</p>
            <p>Miscellaneous: ₹{miscAmount}</p>
            <hr />
            <h5 className="text-success fw-bold">
              Total: ₹{totalAmount.toFixed(2)}
            </h5>
            <div className="text-center mt-3">
              <Button
                variant="success"
                onClick={() => setShowSavingsPopup(false)}
              >
                Done
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default LeadsTabs;

import React from "react";
import { Card, Row, Col, Button, Container } from "react-bootstrap";
import styles from "./SubscriptionPlans.module.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Layout from "../../Components/Layout/Layout";

const plans = [
  {
    id: 1,
    name: "Economy Plan",
    originalPrice: "₹ 2,000 + 18% GST",
    discountedPrice: "₹ 1,180",
    totalPrice: "₹ 2,360",
    duration: "Valid for 30 Days",
    offer: "50% OFF",
    features: [
      "No Minimum business guarantee and no leads",
      "Add 30 Work images",
      "We provide a subdomain that is equal to powerful website.",
      "Add 3 Work Videos.",
      "Social media promotion",
      "No refund",
      "Change of plan - no",
      "Billing facility - available",
      "No commissions from technicians",
      "Profile page with features like on/off feature, reviews & ratings, views, pricing, offers, your photo, address, phone number, email id, etc",
    ],
  },
  {
    id: 2,
    name: "Gold Plan",
    originalPrice: "₹ 6,000 +18% GST",
    discountedPrice: "₹ 3,540",
    totalPrice: "₹ 7,080",
    duration:
      "50 leads in 30 Days (if not, plan extended until 50 leads are given)",
    features: [
      "We provide 50 genuine leads.",
      "One lead shared with one technician.",
      "Add 30 Work images",
      "Add 3 Work Videos.",
      "Social media promotion",
      "No refund",
      "Change of plan - no",
      "Billing facility - available",
      "No commissions from technicians",
      "Profile page with features like on/off feature, reviews & ratings, views, pricing, offers, your photo, address, phone number, email id, etc",
    ],
  },
];

const isNegativePoint = (text) =>
  text.toLowerCase().includes("no ") || text.toLowerCase().includes(" - no");

const SubscriptionPlans = () => {
  return (
    <Layout>
      <div className={styles["subscription-container"]}>
        <Container fluid="md" className={styles.wrapper}>
          <Row className="justify-content-center mb-4">
            <Col md={12}>
              <h2 className={styles.title}>Subscription Plans</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {plans.map((plan) => (
              <Col key={plan.id} xs={12} md={6} lg={5} className="d-flex mb-4">
                <Card className={`${styles.card} w-100`}>
                  <Card.Body className="d-flex flex-column h-100">
                    <Card.Title className={styles.planName}>
                      {plan.name}
                    </Card.Title>
                    {plan.offer && (
                      <div className={styles.offerTag}>{plan.offer}</div>
                    )}
                    <div className={styles.priceSection}>
                      <div className={styles.oldPrice}>
                        {plan.originalPrice}
                      </div>
                      <div className={styles.discountedPrice}>
                        {plan.discountedPrice}
                      </div>
                      <div className={styles.total}>
                        INCL 18% GST: {plan.totalPrice}
                      </div>
                    </div>
                    <div className={styles.duration}>{plan.duration}</div>
                    <ul className={styles.featureList}>
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>
                          {isNegativePoint(feature) ? (
                            <FaTimesCircle className={styles.iconWrong} />
                          ) : (
                            <FaCheckCircle className={styles.iconCheck} />
                          )}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto d-flex justify-content-center">
                      <Button className={styles.chooseBtn}>CHOOSE PLAN</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default SubscriptionPlans;

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import styles from "./EnquiryForm.module.css";

const EnquiryForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleEnquiry = () => {
    const whatsappNumber = "919876543210"; // Change to your number
    const message = `Hi, my name is ${name}. My phone number is ${phone}. I am interested in making an enquiry.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.title}>Enquiry Form</h3>
      <Form>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Control
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            className="form-control"
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>

        <Button
          className={styles.enquiryButton}
          onClick={handleEnquiry}
          disabled={!name || !phone}
        >
          Enquire Now
        </Button>
      </Form>

      <p className={styles.footerText}>
        We will get back to you as soon as possible.
      </p>
    </div>
  );
};

export default EnquiryForm;

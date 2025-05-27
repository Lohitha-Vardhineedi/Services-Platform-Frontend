import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import styles from "./CityEnquiryForm.module.css";
import { useNavigate } from "react-router-dom";

const CityEnquiryForm = () => {
  const [city, setCity] = useState("");
  const navigate = useNavigate("");

  const citiesInIndia = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Visakhapatnam",
    "Surat",
    "Nagpur",
    "Indore",
    "Bhopal",
  ];

  const handleSubmit = () => {
    if (city) {
      navigate("/categories");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>City Enquiry Form</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Select
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select your city</option>
            {citiesInIndia.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!city}
        >
          Enquiry Now
        </Button>
      </Form>
    </div>
  );
};

export default CityEnquiryForm;

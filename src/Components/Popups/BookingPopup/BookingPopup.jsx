import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import "./BookingPopup.css"; // custom styles

const BookingPopup = ({ show, onClose, customer, technician }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [customerOtp, setCustomerOtp] = useState("");
  const [technicianOtp, setTechnicianOtp] = useState("");

  const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handleSendOtp = () => {
    const custOtp = generateOtp();
    const techOtp = generateOtp();

    setCustomerOtp(custOtp);
    setTechnicianOtp(techOtp);

    // Simulate sending OTP
    alert(
      `📲 OTPs Sent!\nCustomer OTP: ${custOtp}\nTechnician OTP: ${techOtp}`
    );

    setOtpSent(true);
    setConfirmed(true);
  };

  const handleClose = () => {
    onClose();
    setConfirmed(false);
    setOtpSent(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Body className="popup-body">
        {!confirmed ? (
          <>
            <h4 className="mb-3 text-center">Confirm Booking</h4>
            <div className="info-box mb-3">
              <p>
                <strong>Customer:</strong> {customer.name} ({customer.phone})
              </p>
              <p>
                <strong>Technician:</strong> {technician.name} (
                {technician.phone})
              </p>
            </div>
            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                onClick={handleSendOtp}
                disabled={otpSent}
              >
                {otpSent ? "OTP Sent" : "Send OTP"}
              </Button>
            </div>
          </>
        ) : (
          <div className="confirmation-box text-center">
            <FaCheckCircle className="check-icon" />
            <h4 className="mt-3">Booking Confirmed!</h4>
            <p>OTP sent to both customer and technician.</p>
            <Button variant="success" className="mt-3" onClick={handleClose}>
              OK
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingPopup;

import React from 'react';
import SignupForm from '../../components/auth/SignupForm';

const TechnicianSignup: React.FC = () => {
  return (
      <SignupForm defaultRole="technician" />
  );
};

export default TechnicianSignup;

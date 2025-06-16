import React from 'react';
import SignupForm from '../../components/auth/SignupForm';

const UserSignup: React.FC = () => {
  return <SignupForm defaultRole="user" />;
};

export default UserSignup;

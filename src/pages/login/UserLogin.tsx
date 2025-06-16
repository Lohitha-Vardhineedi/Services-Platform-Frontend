import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/layout/AuthLayout';

const UserLogin = () => {
  return (
    <AuthLayout title="Log In" subtitle="Access your account">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoginForm defaultRole="user" />
      </main>
    </AuthLayout>
  );
};

export default UserLogin;

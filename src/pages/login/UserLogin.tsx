import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/layout/AuthLayout';

const UserLogin = () => {
    return (
        <LoginForm defaultRole="user" />
    );
};

export default UserLogin;

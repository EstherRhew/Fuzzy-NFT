import React from 'react';
import LoginForm from "../components/LoginForm";
import Logo from "../assets/image/logo.png";

const LoginPage = () => {
  return (
    <main className="auth">
      <div className="auth_logo">
        <img src={Logo} alt=""/>
        <span>Fuzzy</span>
      </div>
      <LoginForm />
    </main>
  );
};

export default LoginPage;

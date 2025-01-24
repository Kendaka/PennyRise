import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import priseLogo from "../../assets/images/prise.png";
import ErrorModal from '../../components/common/ErrorModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { loginUser } from '../../services/api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  

    if (!email) {
      setError('Email is required.');
      setShowErrorModal(true);
      return;
    } else if (!email.includes("@")) {
      setError('Invalid email address.');
      setShowErrorModal(true);
      return;
    }

    if (!password) {
      setError('Password is required.');
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true); 
      const response = await loginUser({ email, password });
      setLoading(false);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (!response.user.monthlyIncome || !response.user.preferredCurrency) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
      
      if (!response.user.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setLoading(false); 
      console.error('Login error:', error); 
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      setError(errorMessage);
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center">
      <img 
        src={priseLogo}
        alt="Prise Logo"
        className="w-36 py-6"
      />
      <h1 className="text-text font-bold font-montserrat text-2xl mb-4">
        Sign in to your account
      </h1>

      <form className="flex flex-col gap-5 items-center py-3" onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-3 px-4 mb-3 w-80 bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
        
        <div className="relative w-80">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-3 px-4 w-full bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-3 text-text"
          >
            {passwordVisible ? (
              <span role="img" aria-label="hide">👁️</span>
            ) : (
              <span role="img" aria-label="show">👁️‍🗨️</span>
            )}
          </button>
          <Link to="/forgot-password" className="absolute right-2 bottom-14 text-xs font-roboto font-bold text-secondary hover:underline">
            Forgot?
          </Link>
        </div>

        <div className="flex flex-col justify-center items-center">
          <button
            type="submit"
            className="bg-primary rounded-3xl text-lg py-3 text-background hover:bg-secondary w-80 mb-4"
          >
            Login
          </button>
          <p className="text-text text-md font-roboto px-2">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>

      {showErrorModal && (
        <ErrorModal
          message={error}
          onClose={handleCloseErrorModal}
        />
      )}

      {loading && <LoadingSpinner />}
    </section>
  );
};

export default Login;
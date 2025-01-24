import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import priseLogo from "../../assets/images/prise.png";
import { resetPassword } from '../../services/api'; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token'); 

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setSuccess('Password reset successful!');
      setError('');
      navigate('/login');
    } catch (error) {
      setError('Error resetting password. Please try again.');
      setSuccess('');
    }
  };

  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center">
      <img 
        src={priseLogo}
        alt="Prise Logo"
        className="w-36 py-6"
      />
      <h1 className="text-text font-bold font-montserrat text-2xl mb-4">
        Reset your password
      </h1>

      <form className="flex flex-col gap-5 items-center py-3" onSubmit={handleSubmit}>
        <div className="relative w-80">
          <input
            type={newPasswordVisible ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="py-3 px-4 mb-3 w-full bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          <button
            type="button"
            onClick={toggleNewPasswordVisibility}
            className="absolute right-2 top-3 text-text"
          >
            {newPasswordVisible ? (
              <span role="img" aria-label="hide">👁️</span>
            ) : (
              <span role="img" aria-label="show">👁️‍🗨️</span>
            )}
          </button>
        </div>

        <div className="relative w-80">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="py-3 px-4 mb-3 w-full bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-2 top-3 text-text"
          >
            {confirmPasswordVisible ? (
              <span role="img" aria-label="hide">👁️</span>
            ) : (
              <span role="img" aria-label="show">👁️‍🗨️</span>
            )}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-1">{success}</p>}

        <button
          type="submit"
          className="w-full bg-secondary text-background text-roboto px-4 py-2 rounded-md"
        >
          Reset Password
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;
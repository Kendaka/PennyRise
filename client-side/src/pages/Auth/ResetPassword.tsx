import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import priseLogo from "../../assets/images/prise.png";
import { resetPassword } from '../../services/api'; 

interface ResetPasswordProps {}

// ResetPassword component
const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [newPasswordVisible, setNewPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token'); 

  // Function to toggle password visibility
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate the form inputs
    if (!newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    // Check if the password meets the criteria
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Call the API to reset the password
    try {
      if (token) {
        await resetPassword(token, newPassword);
        setSuccess('Password reset successful!');
        setError('');
        navigate('/login');
      } else {
        setError('Invalid token.');
      }
    } catch (error) {
      setError('Error resetting password. Please try again.');
      setSuccess('');
    }
  };

  // Function to handle navigation to login page
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  // Redirect to login page after successful password reset request
  const handleSubmit = async () => {
    if (email.trim()) {
      try {
        await requestPasswordReset(email);
        setSuccess(`A password reset link has been sent to ${email}`);
        setError('');
      } catch (error) {
        setError('Error sending password reset link. Please try again.');
        setSuccess('');
      }
    } else {
      setError('Please enter a valid email address.');
      setSuccess('');
    }
  };

  // Redirect to login page after successful password reset request
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-background p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-xl text-text font-montserrat font-bold mb-4">Forgot Your Password?</h1>
        <p className="text-sm text-textLight font-roboto mb-6">
          Enter your email address, and we'll send you instructions to reset your password.
        </p>
        <div className="mb-4">
          <label className="block text-sm text-textLight font-roboto">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-3 px-4 mb-3 w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary lg:w-full"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-secondary text-roboto text-background px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;

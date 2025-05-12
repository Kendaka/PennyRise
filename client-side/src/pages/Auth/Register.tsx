import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import priseLogo from "../../assets/images/prise.png";
import SuccessModal from '../../components/common/SuccessModal';
import ErrorModal from '../../components/common/ErrorModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { registerUser } from '../../services/api';

// Types for the form data and error state
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Define types for the error state
interface Errors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Registration component
const Registration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for error messages
  const [errors, setErrors] = useState<Errors>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for server error messages
  const [serverError, setServerError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate(); 

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setServerError("");
  };

  const togglePasswordVisibility = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    let hasError = false;
    const newErrors: Errors = { username: "", email: "", password: "", confirmPassword: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address.";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      await registerUser(formData);
      setLoading(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      setLoading(false);
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      setServerError(errorMessage);
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = (): void => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  const handleCloseErrorModal = (): void => {
    setShowErrorModal(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-2">
      <img src={priseLogo} className="w-24 md:w-32 lg:w-32" alt="Prise Logo" />
      <h1 className="text-text font-bold font-montserrat text-xl md:text-2xl lg:text-2xl mb-2">
        Create your account
      </h1>
      <p className="font-roboto text-textLight font-bold text-sm text-center mb-3 md:mb-4">
        Start using Prise for the better future!
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-background px-4 py-5 md:px-6 lg:px-8 rounded-lg shadow-md w-full max-w-md mx-auto"
      >
        <div className="mb-4">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="py-3 px-3 w-full md:w-full lg:w-full bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-sm"
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="py-3 px-3 w-full md:w-full lg:w-full bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-sm"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4 relative w-full md:w-full lg:w-full">
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="py-3 px-3 w-full bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-sm"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3 text-text"
          >
            {passwordVisible ? (
              <span role="img" aria-label="hide">
                👁️
              </span>
            ) : (
              <span role="img" aria-label="show">
                👁️‍🗨️
              </span>
            )}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="mb-4 relative w-full md:w-full lg:w-full">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="py-3 px-3 w-full bg-background text-text placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-sm"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-3 text-text"
          >
            {confirmPasswordVisible ? (
              <span role="img" aria-label="hide">
                👁️
              </span>
            ) : (
              <span role="img" aria-label="show">
                👁️‍🗨️
              </span>
            )}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-background py-3 rounded-xl mt-3 hover:bg-secondary transition duration-200"
        >
          Register
        </button>
      </form>

      {showSuccessModal && (
        <SuccessModal
          message="You have successfully registered!"
          onClose={handleCloseSuccessModal}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={serverError || Object.values(errors).find((error) => error)}
          onClose={handleCloseErrorModal}
        />
      )}

      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Registration;

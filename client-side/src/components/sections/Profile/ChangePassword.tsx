import React, { useState } from 'react';

// This component allows users to change their password. It includes fields for the current password, new password, and confirmation of the new password.
interface ChangePasswordFormProps {
  onChangePassword: (passwords: { currentPassword: string; newPassword: string }) => void;
}

// This component allows users to change their password. It includes fields for the current password, new password, and confirmation of the new password.
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // This function handles the submission of the form. It checks if the new password and confirmation match, and if they do, it calls the onChangePassword function with the current and new passwords.
  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    onChangePassword({ currentPassword, newPassword });
  };


  // This function handles the change of the current password input field.
  return (
    <div className="bg-background p-4 rounded-md shadow-md mt-2">
      <h3 className="text-lg text-text font-montserrat font-bold mb-4">Change Password</h3>
      <div className="mb-4">
        <label className="block text-sm text-textLight font-roboto mb-1">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="py-3 px-4 mb-3 w-full bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-textLight font-roboto mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="py-3 px-4 mb-3 w-full bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-textLight font-roboto mb-1">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="py-3 px-4 mb-3 w-full bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        onClick={handleSubmit}
        className="bg-secondary text-background text-roboto px-4 py-2 rounded-md"
      >
        Change Password
      </button>
    </div>
  );
};

export default ChangePasswordForm;

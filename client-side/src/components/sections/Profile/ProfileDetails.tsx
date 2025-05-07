import React, { useState } from 'react';


interface User {
  username: string;
  email: string;
}

interface ProfileDetailsProps {
  user: User;
  onUpdate: (updatedUser: { username: string }) => void;
}

// This component displays the user's profile details and allows them to update their username.
const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState<string>(user.username || '');

  const handleSave = () => {
    if (name.trim()) {
      onUpdate({ username: name });
    }
  };

  return (
    <div className="bg-background p-4 rounded-md shadow-md mt-4">
      <h3 className="text-lg text-text font-montserrat font-bold mb-4 lg:mt-0">Profile Details</h3>
      <div className="mb-4">
        <label className="block font-roboto text-textLight mb-1">Username</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="py-3 px-4 w-full md:w-80 bg-background text-[#333333] placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary md:mb-2"
        />
        <div className="flex justify-end mt-2 lg:justify-start md:justify-start lg:mb-4">
          <button
            onClick={handleSave}
            className="text-sm bg-secondary text-background px-3 font-roboto py-2 rounded-lg lg:mb-2 md:mb-4"
          >
            Save Username
          </button>
        </div>
      </div>
      <div className="mb-4 lg:mb-6 md:mb-6">
        <label className="block font-roboto text-textLight mb-1">Email Address</label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="py-3 px-4 mb-3 w-full md:w-80 bg-background text-textLight placeholder-[#777777] border border-secondary rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
      </div>
    </div>
  );
};

export default ProfileDetails;

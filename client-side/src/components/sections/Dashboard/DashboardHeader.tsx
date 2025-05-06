import React, { useState, useEffect } from 'react';
import defaultProfilePic from '../../../assets/images/defaultProfilePic.png';

// Define the props for the DashboardHeader component
interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  const [profilePicture, setProfilePicture] = useState<string>(defaultProfilePic);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.profilePicture) {
      setProfilePicture(`http://localhost:5000/${user.profilePicture}`);
    }
  }, []);

  return (
    <header className="flex items-center bg-background p-3">
      <img
        src={profilePicture}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="ml-4">
        <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-text font-bold font-montserrat">
          Hello, {userName}!
        </h1>
        <p className="text-sm md:text-md lg:text-lg xl:text-xl text-text font-roboto">
          This is your finance overview.
        </p>
      </div>
    </header>
  );
};

export default DashboardHeader;

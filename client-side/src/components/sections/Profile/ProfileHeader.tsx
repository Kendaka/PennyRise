import React, { useState, useEffect } from 'react';
import DefaultProfile from '../../../assets/images/defaultProfilePic.png';

// This component displays the user's profile picture and allows them to change or delete it.
interface User {
  profilePicture?: string;
}

// The ProfileHeader component is responsible for displaying the user's profile picture and providing options to change or delete it.
interface ProfileHeaderProps {
  user: User;
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => Promise<void>;
}

// The ProfileHeader component is responsible for displaying the user's profile picture and providing options to change or delete it.
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onChangeImage, onDeleteImage }) => {
  const [profilePicture, setProfilePicture] = useState<string>(DefaultProfile);

  useEffect(() => {
    if (user.profilePicture) {
      setProfilePicture(`http://localhost:5000/${user.profilePicture}`);
    } else {
      setProfilePicture(DefaultProfile);
    }
  }, [user]);

  const handleDeleteImage = async () => {
    await onDeleteImage();
    setProfilePicture(DefaultProfile);
  };

  return (
    <div className="flex items-center bg-background p-4 rounded-md shadow-md space-x-4">
      <img
        src={profilePicture}
        alt="Profile"
        className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full object-cover"
      />
      <div className="flex flex-row space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={onChangeImage}
          className="hidden"
          id="profilePictureInput"
        />
        <label
          htmlFor="profilePictureInput"
          className="bg-secondary text-background font-roboto text-sm lg:text-sm xl:text-sm xl:py-2 xl:text-center px-2 rounded-lg cursor-pointer flex items-center justify-center"
        >
          Add/Change Image
        </label>
        <button
          onClick={handleDeleteImage}
          className="bg-accent text-sm md:text-base lg:text-sm xl:text-sm text-background font-roboto px-3 py-2 rounded-lg flex items-center justify-center"
        >
          Delete Image
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;

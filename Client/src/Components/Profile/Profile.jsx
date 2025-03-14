import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    photo: '',
    address: '',
    mobile: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userType, setUserType] = useState(''); // Added to store user type
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data from localStorage when component mounts
    const storedPhoto = localStorage.getItem('profilePhoto');
    const storedAddress = localStorage.getItem('userAddress');
    const storedMobile = localStorage.getItem('userMobile');
    const storedUserType = localStorage.getItem('userType'); // Fetch user type from localStorage

    if (storedPhoto || storedAddress || storedMobile) {
      setProfileData({
        photo: storedPhoto || '',
        address: storedAddress || '',
        mobile: storedMobile || ''
      });
      setUserType(storedUserType); // Set user type from localStorage
    } else {
      // If no data in localStorage, fetch from API
      fetchProfileData();
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/profile');
      const data = await response.json();
      setProfileData(data);
      setUserType(data.userType); // Set user type from API response
      // Store profile data in localStorage
      if (data.photo) {
        localStorage.setItem('profilePhoto', data.photo);
      }
      if (data.address) {
        localStorage.setItem('userAddress', data.address);
      }
      if (data.mobile) {
        localStorage.setItem('userMobile', data.mobile);
      }
      if (data.userType) {
        localStorage.setItem('userType', data.userType); // Store user type in localStorage
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          photo: reader.result
        }));
        // Update profile photo in localStorage when changed
        localStorage.setItem('profilePhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      await fetch('/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });
      // Update localStorage with new values
      localStorage.setItem('profilePhoto', profileData.photo);
      localStorage.setItem('userAddress', profileData.address);
      localStorage.setItem('userMobile', profileData.mobile);
      setIsEditing(false);
      // Refresh the page after saving the profile
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <img 
            src={profileData.photo || 'default-avatar.png'} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Address:</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mobile Number:</label>
            <input
              type="tel"
              name="mobile"
              value={profileData.mobile}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {!isEditing ? (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4">
              <button 
                type="submit" 
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
        {userType === 'landlord' && (
          <button 
            type="button" 
            onClick={handleAddProperty}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Property
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import { FaBars, FaTimes } from 'react-icons/fa';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const storedUserName = localStorage.getItem('userName');
    const storedPhoto = localStorage.getItem('profilePhoto');
    const pageReloaded = localStorage.getItem('pageReloaded');

    if (loginStatus === 'true' && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      if (storedPhoto) {
        setProfilePhoto(storedPhoto);
      } else {
        setProfilePhoto('default-profile-photo.png'); // Set default profile photo if not set
      }

      // Reload the page once if not already reloaded
      if (!pageReloaded) {
        localStorage.setItem('pageReloaded', 'true');
        window.location.reload();
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePhoto');
    localStorage.removeItem('pageReloaded'); // Reset the flag on sign out
    setIsLoggedIn(false);
    setUserName('');
    setProfilePhoto('');
    navigate('/login'); // Redirect to login page after sign out
  };

  return (
    <div className='flex flex-wrap justify-between items-center w-full fixed top-0 left-0 p-4 bg-slate-600 rounded-lg mr-1 z-50'>
      <div className='flex justify-between items-center w-full md:w-auto'>
        <div className='w-32 h-10 md:w-48 md:h-14'>
          <Logo />
        </div>

        {/* Buttons for mobile view */}
        <div className='flex space-x-3 md:hidden'>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className='py-1 px-3 text-white rounded-md text-sm bg-green-500 hover:bg-blue-600'>
                Log In
              </Link>
              <Link to="/register" className='py-1 px-3 text-white rounded-md text-sm bg-green-500 hover:bg-blue-600'>
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <span className='text-white text-sm'>Hi {userName}!</span>
              <Link to="/profile">
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  onClick={() => navigate('/profile')}
                />
              </Link>
              <button 
                onClick={handleSignOut}
                className='py-1 px-3 text-white rounded-md text-sm bg-red-500 hover:bg-red-600'>
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <button className='md:hidden text-white ml-2' onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-14 text-lg text-white w-full md:w-auto mt-4 md:mt-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2`}>
        <NavLink
          className={(navData) => navData.isActive ? 'scale-110 underline' : ''}
          to="/"
        >
          Home
        </NavLink>
        <NavLink 
          className={(navData) => navData.isActive ? 'scale-110 underline' : ''}
          to="/blog"
        >
          Blog
        </NavLink>
        <NavLink 
          className={(navData) => navData.isActive ? 'scale-110 underline' : ''}
          to="/contact-us"
        >
          Contact Us
        </NavLink>
      </nav>

      {/* Buttons for desktop view */}
      <div className='hidden md:flex space-x-3'>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className='py-1 px-5 text-white rounded-md text-lg bg-green-500 hover:bg-blue-600'>
              Log In
            </Link>
            <Link to="/register" className='py-1 px-5 text-white rounded-md text-lg bg-green-500 hover:bg-blue-600'>
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <span className='text-white text-lg'>Hi {userName}!</span>
            <Link to="/profile">
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => navigate('/profile')}
              />
            </Link>
            <button 
              onClick={handleSignOut}
              className='py-1 px-3 text-white rounded-md text-lg bg-red-500 hover:bg-red-600'>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
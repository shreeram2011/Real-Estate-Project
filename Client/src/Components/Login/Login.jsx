import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [userType, setUserType] = useState('hunter'); // Default userType is 'hunter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      // Send the login request to the backend
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
        userType,
      });

      const { token, msg, name, userType: serverUserType, userId } = response.data;

      // Check if the userType from the server matches the selected userType
      if (userType === 'hunter' && serverUserType !== 'hunter') {
        setErrorMessage('Invalid login. You are registered as a Landlord');
        return;
      }

      if (userType === 'landlord' && serverUserType !== 'landlord') {
        setErrorMessage('Invalid login. You are registered as a Home Hunter');
        return;
      }

      // Proceed if the userTypes match
      if (
        (userType === 'hunter' && serverUserType === 'hunter') ||
        (userType === 'landlord' && serverUserType === 'landlord')
      ) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('isLoggedIn', 'true');
        // Store the user's ObjectId in local storage
        localStorage.setItem('userId', userId);
        alert(msg); // Show success message
        navigate('/'); // Redirect to the home page
        window.location.reload(); // Reload to update the page state
      }

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.msg || 'Login failed. Please try again.';
      setErrorMessage(errorMsg); // Set error message in case of failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to Your Account
          </h2>

          {/* User Type Selection */}
          <div className="mt-4 flex justify-center space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                userType === 'hunter'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setUserType('hunter')}
            >
              Home Hunter
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                userType === 'landlord'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setUserType('landlord')}
            >
              Landlord
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Display Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in as {userType === 'hunter' ? 'Home Hunter' : 'Landlord'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

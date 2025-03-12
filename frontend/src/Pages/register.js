import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleRegister = async (e) => {
    e.preventDefault();
    
    setError(''); 

    if (password !== confirmedPassword) {
      alert(`Passwords do not match: ${password} - ${confirmedPassword}`);
      return;
    }
;
    try {


      // Handle successful registration (e.g., store token and redirect)
      localStorage.setItem('token', response.data.token); // Save token in localStorage
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('userId', response.data.user.id);

      const response = await axios.post('https://cleirigh-backend.vercel.app/api/register', {
        username,
        email,
        password,
        confirmedPassword
      });

      window.location.href = '/home'; // Redirect to the home page
    } catch (error) {
      // Log the error for debugging
      console.log(error.response)
      console.error('Registration error details:', error);

      // Check for error response and update the error message
      if (error.response) {
        setError(error.response.data.message); // Set the error message from the backend
      } else {
        setError('Error registering: ' + error.message); // Fallback error message
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {/* Only display the error message if it has content */}
      {error && <p className="error">{"An account with this email already exists. Please log in."}</p>} {/* Display error message only when there's an error */}
      <form onSubmit={handleRegister}>
        <div id="input-container">
            <div>
            <label className='form-label'>Username:</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update state without clearing error
                required
            />
            </div>
            <div>
            <label className='form-label'>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update state without clearing error
                required
            />
            </div>
            <div>
            <label className='form-label'>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update state without clearing error
                required
            />
            </div>
            <div>
            <label className='form-label'>Confirm Password:</label>
            <input
                type="password"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)} // Update state without clearing error
                required
            />
            </div>
        </div>
        <button onClick={handleRegister} type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

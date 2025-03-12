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

    try {
        console.log("Sending registration request:", { username, email, password, confirmedPassword });

        const response = await axios.post('https://cleirigh-backend.vercel.app/api/register', {
            username,
            email,
            password
        });

        localStorage.setItem('token', response.data.token);

        if (response.data.user) {
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('userId', response.data.user.id);
        }

        window.location.href = '/home';
    } catch (error) {
        console.error('Registration error details:', error);

        if (error.response) {
            setError(error.response.data.message);
        } else {
            setError('Error registering: ' + error.message);
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      console.log(`Registering user: ${email}`);
      const res = await axios.post('https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/users', formData);
      localStorage.setItem('token', res.data.token);
      history.push('/dashboard');
    } catch (err) {
      console.error('Error registering:', err.response?.data || err.message); // Логирование ошибки
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterForm;

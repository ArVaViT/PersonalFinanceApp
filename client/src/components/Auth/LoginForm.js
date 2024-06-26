import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const history = useHistory();

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ email, password });

    try {
      console.log('Login request body:', body); // Логирование данных запроса
      const res = await axios.post(
        'https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/auth/login',
        body,
        config
      );

      localStorage.setItem('token', res.data.token);
      history.push('/dashboard');
    } catch (err) {
      console.error('Error logging in:', err.response?.data || err.message); // Логирование ошибки
      setError(err.response?.data?.errors[0]?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={e => onSubmit(e)}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginForm;

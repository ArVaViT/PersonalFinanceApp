// src/components/Layout/Navbar.js
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from '../../styles/Navbar.module.css';

const Navbar = () => {
    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('token');
        history.push('/'); // Перенаправление на страницу логина после логаута
    };

    return (
        <nav className={styles.navbar}>
            <h2>Personal Finance App</h2>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/accounts">Accounts</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/goals">Goals</Link></li>
                <li><Link to="/reminders">Reminders</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;

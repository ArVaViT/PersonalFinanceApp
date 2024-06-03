import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import styles from '../../../styles/AccountDetails.module.css';

const AccountDetails = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        balance: 0
    });
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get(`https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/accounts/${id}`, config);
                setFormData(res.data);
            } catch (err) {
                setError('Failed to fetch account. Please try again.');
            }
        };

        fetchAccount();
    }, [id]);

    const { name, type, balance } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.put(`https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/accounts/${id}`, formData, config);
            history.push('/accounts'); // Redirect to account list page after update
        } catch (err) {
            setError('Failed to update account. Please try again.');
        }
    };

    return (
        <div className={styles.accountDetails}>
            <h2>Update Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="type">Type:</label>
                    <select name="type" value={type} onChange={onChange} required>
                        <option value="">Select Type</option>
                        <option value="bank">Bank</option>
                        <option value="cash">Cash</option>
                        <option value="e-wallet">E-wallet</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="balance">Balance:</label>
                    <input type="number" name="balance" value={balance} onChange={onChange} required />
                </div>
                <button type="submit">Update Account</button>
            </form>
        </div>
    );
};

export default AccountDetails;

// src/components/Dashboard.js
import React from 'react';
import AccountList from './Dashboard/Accounts/AccountList';
import TransactionList from './Dashboard/Transactions/TransactionList';
import GoalList from './Dashboard/Goals/GoalList';
import ReminderList from './Dashboard/Reminders/ReminderList';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <AccountList />
            </div>
            <div>
                <TransactionList />
            </div>
            <div>
                <GoalList />
            </div>
            <div>
                <ReminderList />
            </div>
        </div>
    );
};

export default Dashboard;

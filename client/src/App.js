// src/App.js
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Navbar, Footer, Dashboard, LoginForm, RegisterForm, AccountList, AccountForm, AccountDetails, CategoryList, CategoryForm, GoalList, GoalForm, GoalDetails, ReminderList, ReminderForm, ReminderDetails, TransactionList, TransactionForm, TransactionDetails } from './components/componentsIndex';
import './App.css';

// PrivateRoute component to protect routes
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            localStorage.getItem('token') ? (
                <Component {...props} />
            ) : (
                <Redirect to="/" />
            )
        }
    />
);

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <Switch>
                <Route exact path="/" component={LoginForm} />
                <Route exact path="/register" component={RegisterForm} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/accounts" component={AccountList} />
                <PrivateRoute exact path="/accounts/create" component={AccountForm} />
                <PrivateRoute exact path="/accounts/:id" component={AccountDetails} />
                <PrivateRoute exact path="/categories" component={CategoryList} />
                <PrivateRoute exact path="/categories/create" component={CategoryForm} />
                <PrivateRoute exact path="/goals" component={GoalList} />
                <PrivateRoute exact path="/goals/create" component={GoalForm} />
                <PrivateRoute exact path="/goals/:id" component={GoalDetails} />
                <PrivateRoute exact path="/reminders" component={ReminderList} />
                <PrivateRoute exact path="/reminders/create" component={ReminderForm} />
                <PrivateRoute exact path="/reminders/:id" component={ReminderDetails} />
                <PrivateRoute exact path="/transactions" component={TransactionList} />
                <PrivateRoute exact path="/transactions/create" component={TransactionForm} />
                <PrivateRoute exact path="/transactions/:id" component={TransactionDetails} />
            </Switch>
            <Footer />
        </div>
    );
};

export default App;

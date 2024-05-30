// src/components/UI/Select.js
import React from 'react';

const Select = ({ name, value, onChange, options, required }) => {
    return (
        <select name={name} value={value} onChange={onChange} required={required}>
            <option value="">Select</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;

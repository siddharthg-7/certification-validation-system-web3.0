import React, { useState } from 'react';

const FloatingLabelInput = ({ label, type = 'text', value, onChange, id, required = false, textarea = false, ...props }) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className={`floating-input-container ${focused ? 'focused' : ''}`}>
            {textarea ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder=" "
                    required={required}
                    className="block w-full text-white"
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder=" "
                    required={required}
                    className="block w-full text-white"
                    {...props}
                />
            )}
            <label htmlFor={id}>
                {label} {required && '*'}
            </label>
        </div>
    );
};

export default FloatingLabelInput;

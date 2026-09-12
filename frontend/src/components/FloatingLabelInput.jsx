import React from 'react';

const FloatingLabelInput = ({
    label,
    type = 'text',
    value,
    onChange,
    id,
    required = false,
    textarea = false,
    placeholder = '',
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="label-formal">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            {textarea ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder || (label ? `Enter ${label.toLowerCase()}...` : '')}
                    className={`input-formal ${className}`}
                    rows={props.rows || 3}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder || (label ? `Enter ${label.toLowerCase()}...` : '')}
                    className={`input-formal ${className}`}
                    {...props}
                />
            )}
        </div>
    );
};

export default FloatingLabelInput;

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
    icon: Icon = null,
    helperText = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="label-formal">
                    {Icon && <Icon size={13} color="#00f2fe" />}
                    <span>{label}</span>
                    {required && <span className="text-rose-400 font-bold ml-0.5">*</span>}
                </label>
            )}
            <div className="relative">
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
            {helperText && (
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default FloatingLabelInput;

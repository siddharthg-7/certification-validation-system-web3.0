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
                <label htmlFor={id} className="block text-xs font-semibold text-[#53605B] uppercase tracking-wider mb-1.5 font-mono">
                    <span className="flex items-center gap-1.5">
                        {Icon && <Icon size={13} className="text-[#124B40]" />}
                        <span>{label}</span>
                        {required && <span className="text-[#B65F3D] font-bold">*</span>}
                    </span>
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
                        className={`w-full bg-white border border-[#D5D0C3] focus:border-[#124B40] focus:ring-1 focus:ring-[#124B40] rounded p-2.5 text-sm text-[#102322] placeholder-[#A4B0AC] outline-none transition-all ${className}`}
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
                        className={`w-full bg-white border border-[#D5D0C3] focus:border-[#124B40] focus:ring-1 focus:ring-[#124B40] rounded p-2.5 text-sm text-[#102322] placeholder-[#A4B0AC] outline-none transition-all ${className}`}
                        {...props}
                    />
                )}
            </div>
            {helperText && (
                <p className="text-[11px] text-[#7B8984] mt-1 font-mono">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default FloatingLabelInput;

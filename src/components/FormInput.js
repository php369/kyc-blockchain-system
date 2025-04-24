'use client';

import { useState } from 'react';

export default function FormInput({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  required = false,
  disabled = false,
  className = '',
  pattern = '',
  minLength = '',
  maxLength = '',
  accept = '',
  iconLeft = null,
  iconRight = null,
  showErrorIcon = true,
  helperText = '',
  onBlur = () => {},
}) {
  const [focused, setFocused] = useState(false);
  const hasError = error && error.length > 0;
  
  const handleFocus = () => setFocused(true);
  
  const handleBlur = (e) => {
    setFocused(false);
    onBlur(e);
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`relative rounded-md shadow-sm ${hasError ? 'border-red-300' : ''}`}>
        {iconLeft && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {iconLeft}
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${iconLeft ? 'pl-10' : ''}
              ${iconRight || (hasError && showErrorIcon) ? 'pr-10' : ''}
              ${hasError ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
              ${className}
            `}
            rows={4}
          />
        ) : type === 'file' ? (
          <input
            id={id}
            name={id}
            type={type}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={`
              block w-full text-sm text-gray-900 border border-gray-300 rounded-md
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              ${hasError ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
              ${className}
            `}
            accept={accept}
          />
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            pattern={pattern}
            minLength={minLength}
            maxLength={maxLength}
            className={`
              block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${iconLeft ? 'pl-10' : ''}
              ${iconRight || (hasError && showErrorIcon) ? 'pr-10' : ''}
              ${hasError ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
              ${className}
            `}
            required={required}
          />
        )}
        
        {(iconRight || (hasError && showErrorIcon)) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {hasError && showErrorIcon ? (
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              iconRight
            )}
          </div>
        )}
      </div>
      
      {(hasError || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  );
}
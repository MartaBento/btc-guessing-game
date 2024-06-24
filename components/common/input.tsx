"use client";

import { useState } from "react";

type InputProps = {
  label: string;
  labelDescription: string;
  type: "email" | "password" | "text";
  autoComplete?: string;
  placeholder: string;
  error?: string;
};

function Input({
  label,
  labelDescription,
  type,
  autoComplete,
  placeholder,
  error,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";

  const togglePasswordVisibility = () => {
    if (isPasswordType) {
      setShowPassword(!showPassword);
    }
  };

  const calculateType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="w-full">
      <label
        htmlFor={label}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {labelDescription}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={label}
          name={label}
          type={calculateType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 placeholder:text-sm focus:ring-2 focus:ring-inset focus:ring-berkeleyBlue pr-10"
        />
        {isPasswordType && (
          <button
            onClick={togglePasswordVisibility}
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pe-3"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-800 mt-1 text-xs font-semibold tracking-tight">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;

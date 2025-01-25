import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "../index";

function PasswordInput({
  label = "Password",
  placeholder = "Enter your password",
  registration,
  error,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          label={label}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          className={`text-gray-100 w-full pr-12 ${className}`}
          {...registration}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-300 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}

export default PasswordInput;

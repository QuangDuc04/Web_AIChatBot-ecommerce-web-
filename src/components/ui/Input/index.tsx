"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputVariant = "default" | "glass";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: InputVariant;
}

const baseClasses =
  "w-full text-[15px] px-4 py-2.5 rounded-xl outline-none transition-all duration-300";

const variantClasses: Record<InputVariant, string> = {
  default: [
    "bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400",
    "hover:border-[#1a7a74]/30",
    "focus:border-[#1a7a74] focus:shadow-[0_0_0_3px_rgba(26,122,116,0.1)]",
  ].join(" "),
  glass: [
    "bg-white/10 border border-white/20 text-white placeholder:text-white/80 placeholder:font-[500] backdrop-blur-sm",
    "hover:border-white/35 hover:bg-white/15",
    "focus:border-white/60 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.1)]",
  ].join(" "),
};

const Input = ({ variant = "default", className = "", type, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  if (isPassword) {
    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`${baseClasses} ${variantClasses[variant]} pr-11 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 ${
            variant === "glass"
              ? "text-white/60 hover:text-white"
              : "text-gray-400 hover:text-[#1a7a74]"
          }`}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }

  return (
    <input
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

const TextArea = ({ variant = "default", className = "", ...props }: TextAreaProps) => {
  return (
    <textarea
      className={`${baseClasses} ${variantClasses[variant]} min-h-[100px] resize-y ${className}`}
      {...props}
    />
  );
};

export { Input, TextArea };

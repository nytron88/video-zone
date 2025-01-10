import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "bg-gradient-to-r from-violet-400 to-cyan-400",
  textColor = "text-white",
  className = "",
  variant = "default",
  ...props
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border-2 border-violet-400/50 hover:border-violet-400 bg-transparent hover:bg-gradient-to-r hover:from-violet-400/10 hover:to-cyan-400/10";
      case "ghost":
        return "bg-transparent hover:bg-gradient-to-r hover:from-violet-400/10 hover:to-cyan-400/10";
      case "subtle":
        return "bg-gradient-to-r from-violet-400/10 to-cyan-400/10 hover:from-violet-400/20 hover:to-cyan-400/20";
      default:
        return bgColor;
    }
  };

  return (
    <button
      type={type}
      className={`
        relative px-4 py-2 rounded-lg font-medium
        transition-all duration-300 
        hover:shadow-lg hover:shadow-violet-400/10
        active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100
        ${getVariantClasses()}
        ${
          variant === "default" ? "hover:from-violet-500 hover:to-cyan-500" : ""
        }
        ${textColor} 
        ${className}
      `}
      {...props}
    >
      <span className="absolute inset-0 rounded-lg overflow-hidden">
        <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
        </span>
      </span>

      <span className="relative">{children}</span>
    </button>
  );
}

Button.displayName = "Button";

export default Button;

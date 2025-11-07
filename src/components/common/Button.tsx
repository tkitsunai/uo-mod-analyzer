import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  variant = "primary",
}) => {
  const baseClass = variant === "primary" ? "analyze-button" : "csv-button";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className}`}
    >
      {children}
    </button>
  );
};

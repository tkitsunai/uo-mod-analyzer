import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "処理中...",
  className = "",
}) => {
  return (
    <div className={`processing ${className}`}>
      <p>{message}</p>
      <div className="loading-spinner"></div>
    </div>
  );
};

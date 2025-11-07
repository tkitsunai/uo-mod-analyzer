import React from "react";

export type MessageType = "success" | "error" | "warning" | "info";

interface MessageProps {
  message: string;
  type?: MessageType;
  className?: string;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const Message: React.FC<MessageProps> = ({
  message,
  type = "info",
  className = "",
  onClose,
  autoHide = false,
  duration = 3000,
}) => {
  React.useEffect(() => {
    if (autoHide && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onClose, duration]);

  const getMessageClasses = () => {
    const baseClasses = "message";
    const typeClasses = {
      success: "message-success",
      error: "message-error",
      warning: "message-warning",
      info: "message-info",
    };

    return `${baseClasses} ${typeClasses[type]} ${className}`.trim();
  };

  return (
    <div className={getMessageClasses()}>
      <span className="message-text">{message}</span>
      {onClose && (
        <button
          type="button"
          className="message-close"
          onClick={onClose}
          aria-label="メッセージを閉じる"
        >
          ×
        </button>
      )}
    </div>
  );
};

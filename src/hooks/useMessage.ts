import { useState, useCallback } from "react";
import type { MessageType } from "../components/common/Message";

interface UseMessageReturn {
  message: string | null;
  messageType: MessageType;
  showMessage: (text: string, type?: MessageType, duration?: number) => void;
  hideMessage: () => void;
}

export const useMessage = (): UseMessageReturn => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>("info");

  const showMessage = useCallback(
    (text: string, type: MessageType = "info", duration: number = 1800) => {
      setMessage(text);
      setMessageType(type);

      // 自動非表示
      if (duration > 0) {
        setTimeout(() => {
          setMessage(null);
        }, duration);
      }
    },
    []
  );

  const hideMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    message,
    messageType,
    showMessage,
    hideMessage,
  };
};

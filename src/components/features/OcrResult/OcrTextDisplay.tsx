import React from "react";

interface OcrTextDisplayProps {
  text: string;
  className?: string;
}

export const OcrTextDisplay: React.FC<OcrTextDisplayProps> = ({ text, className = "" }) => {
  if (!text) {
    return null;
  }

  return (
    <div className={`ocr-result ${className}`}>
      <h3>OCR解析結果:</h3>
      <pre className="ocr-text">{text}</pre>
    </div>
  );
};

import React, { useState } from "react";

interface OcrTextDisplayProps {
  text: string;
  className?: string;
}

export const OcrTextDisplay: React.FC<OcrTextDisplayProps> = ({ text, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }

  return (
    <div className={`ocr-result ${className}`}>
      <div className="ocr-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>🔍 OCR解析結果 {isExpanded ? "🔼" : "🔽"}</h3>
      </div>
      {isExpanded && <pre className="ocr-text">{text}</pre>}
    </div>
  );
};

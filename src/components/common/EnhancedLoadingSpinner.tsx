import React, { useState, useEffect } from "react";

interface EnhancedLoadingSpinnerProps {
  message?: string;
  className?: string;
  showProgress?: boolean;
  estimatedTime?: number; // 秒
}

export const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  message = "処理中...",
  className = "",
  showProgress = false,
  estimatedTime = 10,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // メッセージを段階的に変更
    if (elapsed < 2) {
      setCurrentMessage("🔍 画像を解析中...");
    } else if (elapsed < 5) {
      setCurrentMessage("📝 テキストを認識中...");
    } else if (elapsed < 8) {
      setCurrentMessage("⚙️ MOD情報を抽出中...");
    } else {
      setCurrentMessage("✨ 結果を準備中...");
    }
  }, [elapsed]);

  const progress = showProgress ? Math.min((elapsed / estimatedTime) * 100, 90) : 0;

  return (
    <div className={`enhanced-loading ${className}`}>
      <div className="loading-content">
        <div className="loading-spinner-enhanced">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        <p className="loading-message">{currentMessage}</p>

        {showProgress && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{Math.round(progress)}% 完了</p>
          </div>
        )}

        <p className="loading-tip">
          💡 ヒント: 画像が鮮明で文字がはっきり見える方が解析精度が向上します
        </p>
      </div>
    </div>
  );
};

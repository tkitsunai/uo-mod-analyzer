import React from "react";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header className={`app-header ${className}`}>
      <h1>UO MOD解析ツール</h1>
      <p>
        Ultima Online の装備ツールチップ画像をアップロードまたは貼り付けて、MOD情報をCSVで抽出します
      </p>
      <div className="usage-info">
        <p>📁 ファイル選択 または 📋 Ctrl+V でクリップボードから貼り付け</p>
      </div>
    </header>
  );
};

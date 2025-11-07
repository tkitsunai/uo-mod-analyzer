import React from "react";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header className={`app-header ${className}`}>
      <h1>UO MOD Analyzer</h1>
      <p>Ultima Online の装備ツールチップ画像をアップロードまたは貼り付けて、MOD情報を抽出します</p>
    </header>
  );
};

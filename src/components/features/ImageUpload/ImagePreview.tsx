import React from "react";

interface ImagePreviewProps {
  imageUrl: string;
  alt?: string;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  alt = "アップロードされた画像",
  className = "",
}) => {
  return (
    <div className={`image-preview ${className}`}>
      <h3>選択された画像:</h3>
      <img src={imageUrl} alt={alt} className="preview-image" />
    </div>
  );
};

import { useEffect, useCallback } from "react";

export const useClipboard = (onImagePaste: (file: File) => void) => {
  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            onImagePaste(file);
          }
          break;
        }
      }
    },
    [onImagePaste]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return {};
};

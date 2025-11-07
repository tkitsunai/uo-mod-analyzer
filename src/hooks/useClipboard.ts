import { useEffect, useRef } from "react";

export const useClipboard = (onImagePaste: (file: File) => void) => {
  const isProcessingRef = useRef(false);
  const onImagePasteRef = useRef(onImagePaste);

  // コールバック関数の参照を更新
  useEffect(() => {
    onImagePasteRef.current = onImagePaste;
  }, [onImagePaste]);

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      // 既に処理中の場合はスキップ
      if (isProcessingRef.current) {
        return;
      }

      // クリップボードAPIが利用可能かチェック
      if (!event.clipboardData) {
        return;
      }

      const items = event.clipboardData.items;
      if (!items || items.length === 0) {
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.startsWith("image/")) {
          event.preventDefault();
          event.stopPropagation();

          const file = item.getAsFile();
          if (file) {
            console.log(
              "📋 Clipboard image detected:",
              file.type,
              `${Math.round(file.size / 1024)}KB`
            );

            // 処理中フラグを設定
            isProcessingRef.current = true;

            // ファイル名が空の場合は適切なファイル名を生成する
            let fileName = file.name;
            if (!fileName) {
              const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
              const extension = file.type.split("/")[1] || "png";
              fileName = `clipboard-image-${timestamp}.${extension}`;
            }

            const renamedFile = new File([file], fileName, {
              type: file.type,
              lastModified: file.lastModified,
            });

            try {
              await onImagePasteRef.current(renamedFile);
              console.log("✅ Clipboard image processed successfully");
            } catch (error) {
              console.error("❌ Error processing clipboard image:", error);
            } finally {
              // 処理完了後にフラグをリセット
              setTimeout(() => {
                isProcessingRef.current = false;
              }, 1000);
            }
          }
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []); // 依存関係を空にして、一度だけ設定

  return {};
};

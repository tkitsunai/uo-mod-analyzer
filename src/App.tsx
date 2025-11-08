import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import { useImageUpload } from "./hooks/useImageUpload";
import { useOcrProcessing } from "./hooks/useOcrProcessing";
import { useClipboard } from "./hooks/useClipboard";
import { useItemHistory } from "./hooks/useItemHistory";
import { useCsvExport } from "./hooks/useCsvExport";
import { useAutoItemName } from "./hooks/useAutoItemName";
import { useMessage } from "./hooks/useMessage";
import { useEditableModEntries } from "./hooks/useEditableModEntries";
import { Header } from "./components/layout/Header";
import { ImageUploadArea } from "./components/features/ImageUpload/ImageUploadArea";
import { ImagePreview } from "./components/features/ImageUpload/ImagePreview";

import { EnhancedLoadingSpinner } from "./components/common/EnhancedLoadingSpinner";
import { OcrTextDisplay } from "./components/features/OcrResult/OcrTextDisplay";
import { EditableModTable } from "./components/features/ModTable/EditableModTable";
import { ItemHistoryPanel } from "./components/features/ItemHistory/ItemHistoryPanel";
import { Message } from "./components/common/Message";

function App() {
  const [itemName, setItemName] = useState("");
  const { message: pasteMessage, messageType, showMessage, hideMessage } = useMessage();

  const { selectedFile, imagePreview, error: uploadError, handleFileSelect } = useImageUpload();

  const {
    isProcessing,
    ocrText,
    modEntries,
    estimatedName,
    error: ocrError,
    processImage,
    resetOcrResults,
  } = useOcrProcessing();

  const {
    items,
    isLoading: historyLoading,
    error: historyError,
    addItem,
    removeItem,
    updateItemName,
    clearAll,
  } = useItemHistory();

  const { exportModEntries, copyModEntries } = useCsvExport();

  // 編集可能なMODエントリの状態管理
  const { modEntries: editableModEntries, resetModEntries } = useEditableModEntries(modEntries);

  // MODエントリが更新されたときに編集可能エントリをリセット
  useEffect(() => {
    resetModEntries(modEntries);
  }, [modEntries, resetModEntries]);

  // アイテム名の自動入力
  useAutoItemName({
    estimatedName,
    onNameSet: setItemName,
  });

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      resetOcrResults();
      await handleFileSelect(file);
    }
  };

  const onImagePaste = useCallback(
    async (file: File) => {
      resetOcrResults();
      try {
        await handleFileSelect(file);
        showMessage("画像が貼り付けられました！", "success", 3000);
      } catch (error) {
        console.error("画像の貼り付けエラー:", error);
        showMessage("画像の貼り付けに失敗しました", "error", 3000);
      }
    },
    [handleFileSelect, resetOcrResults, showMessage]
  );

  useClipboard(onImagePaste);

  const handleAnalyze = async () => {
    if (selectedFile) {
      await processImage(selectedFile);
    }
  };

  const handleAddToHistory = async () => {
    if (editableModEntries.length === 0) return;

    const name = itemName.trim() || `アイテム ${new Date().toLocaleString()}`;
    await addItem(name, editableModEntries, ocrText, 0, imagePreview || undefined);

    setItemName("");
    resetOcrResults();
    resetModEntries([]);

    showMessage("📋 履歴に追加しました。新しい解析を開始できます。", "success", 3000);
  };

  return (
    <div className="app">
      <Header />

      {/* グローバルメッセージ表示エリア */}
      {pasteMessage && (
        <div className="global-message-container">
          <Message message={pasteMessage} type={messageType} onClose={hideMessage} />
        </div>
      )}

      <main className="app-main app-main-three-column">
        <div className="left-panel">
          <ImageUploadArea
            onFileSelect={onFileSelect}
            selectedFileName={selectedFile?.name}
            error={uploadError}
          />

          {imagePreview && <ImagePreview imageUrl={imagePreview} />}

          {selectedFile && !isProcessing && (
            <button className="btn btn-success analyze-button" onClick={handleAnalyze}>
              画像を解析
            </button>
          )}

          {isProcessing && (
            <EnhancedLoadingSpinner message="解析中..." showProgress={true} estimatedTime={12} />
          )}
        </div>

        <div className="center-panel">
          {ocrError && (
            <div className="error-message" style={{ color: "red", margin: "16px 0" }}>
              {ocrError}
            </div>
          )}

          {editableModEntries.length > 0 && !isProcessing && (
            <>
              <div className="item-name-input-section">
                <label htmlFor="item-name">アイテム名:</label>
                <input
                  id="item-name"
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="アイテム名を入力（任意）"
                  className="item-name-input"
                />
              </div>
              <EditableModTable
                modEntries={editableModEntries}
                onModEntriesChange={(entries) => resetModEntries(entries)}
                onExportCSV={async (options) => {
                  try {
                    await exportModEntries(editableModEntries, itemName, options);
                  } catch (error) {
                    showMessage("❌ CSVエクスポートに失敗しました", "error", 3000);
                  }
                }}
                onCopyCSV={async (options) => {
                  try {
                    await copyModEntries(editableModEntries, itemName, options);
                    showMessage("📋 CSVデータをクリップボードにコピーしました", "success", 3000);
                  } catch (error) {
                    showMessage("❌ クリップボードへのコピーに失敗しました", "error", 3000);
                  }
                }}
              />
              {ocrText && <OcrTextDisplay text={ocrText} />}
              <button className="btn btn-primary" onClick={handleAddToHistory}>
                📋 履歴に追加
              </button>
            </>
          )}
        </div>

        <div className="right-panel">
          <ItemHistoryPanel
            items={items}
            isLoading={historyLoading}
            error={historyError}
            onDeleteItem={removeItem}
            onUpdateItemName={updateItemName}
            onClearAll={clearAll}
            onShowMessage={showMessage}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

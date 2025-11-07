import React from "react";
import "./App.css";
import { useImageUpload } from "./hooks/useImageUpload";
import { useOcrProcessing } from "./hooks/useOcrProcessing";
import { useClipboard } from "./hooks/useClipboard";
import { Header } from "./components/layout/Header";
import { ImageUploadArea } from "./components/features/ImageUpload/ImageUploadArea";
import { ImagePreview } from "./components/features/ImageUpload/ImagePreview";
import { Button } from "./components/common/Button";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { OcrTextDisplay } from "./components/features/OcrResult/OcrTextDisplay";
import { ModTable } from "./components/features/ModTable/ModTable";
import { CsvExporter } from "./usecases/CsvExporter";
import { FileService } from "./infrastructure/storage/FileService";

function App() {
  const { selectedFile, imagePreview, error: uploadError, handleFileSelect } = useImageUpload();

  const {
    isProcessing,
    ocrText,
    modEntries,
    error: ocrError,
    processImage,
    resetOcrResults,
  } = useOcrProcessing();

  const csvExporter = new CsvExporter(new FileService());

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      resetOcrResults();
      await handleFileSelect(file);
    }
  };

  const onImagePaste = async (file: File) => {
    resetOcrResults();
    await handleFileSelect(file);
  };

  useClipboard(onImagePaste);

  const handleAnalyze = async () => {
    if (selectedFile) {
      await processImage(selectedFile);
    }
  };

  const handleExportCSV = () => {
    csvExporter.exportToCSV(modEntries);
  };

  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <ImageUploadArea
          onFileSelect={onFileSelect}
          selectedFileName={selectedFile?.name}
          error={uploadError}
        />

        {imagePreview && <ImagePreview imageUrl={imagePreview} />}

        {selectedFile && !isProcessing && <Button onClick={handleAnalyze}>画像を解析</Button>}

        {isProcessing && <LoadingSpinner message="解析中..." />}

        {ocrError && (
          <div className="error-message" style={{ color: "red", margin: "16px 0" }}>
            {ocrError}
          </div>
        )}

        {ocrText && !isProcessing && <OcrTextDisplay text={ocrText} />}

        {modEntries.length > 0 && !isProcessing && (
          <ModTable modEntries={modEntries} onExportCSV={handleExportCSV} />
        )}
      </main>
    </div>
  );
}

export default App;

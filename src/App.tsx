import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

// ModEntry型の定義
interface ModEntry {
  mod: string;
  value: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrText, setOcrText] = useState<string>("");
  const [modEntries, setModEntries] = useState<ModEntry[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // クリップボードから画像を読み取る機能
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            await handleImageFile(file);
          }
          break;
        }
      }
    };

    // ペーストイベントリスナーを追加
    document.addEventListener("paste", handlePaste);

    return () => {
      // クリーンアップ
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // 画像ファイルを処理する共通関数
  const handleImageFile = async (file: File) => {
    setSelectedFile(file);
    setOcrText("");
    setModEntries([]);

    // プレビュー画像を生成
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ファイル選択時のハンドラー
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImageFile(file);
    }
  };

  // OCR処理とMOD抽出
  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      // Tesseract.jsでOCR処理
      const {
        data: { text },
      } = await Tesseract.recognize(selectedFile, "eng", {
        logger: (m) => console.log(m), // OCR進捗をコンソールに出力
      });

      setOcrText(text);

      // 正規表現でMOD情報を抽出
      const modRegex = /([A-Za-z ]+)\s(\d+%?|\d+)/g;
      const extractedMods: ModEntry[] = [];
      let match;

      while ((match = modRegex.exec(text)) !== null) {
        const modName = match[1].trim();
        const modValue = match[2].trim();

        // 空白やノイズを除外
        if (modName.length > 1) {
          extractedMods.push({
            mod: modName,
            value: modValue,
          });
        }
      }

      setModEntries(extractedMods);
    } catch (error) {
      console.error("OCR処理エラー:", error);
      alert("画像の解析に失敗しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  // CSVダウンロード機能
  const downloadCSV = () => {
    if (modEntries.length === 0) return;

    // CSV形式の文字列を生成
    const csvHeader = "Mod,Value\n";
    const csvRows = modEntries.map((entry) => `"${entry.mod}","${entry.value}"`).join("\n");
    const csvContent = csvHeader + csvRows;

    // Blobを作成してダウンロード
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "uo_mods.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>UO MOD解析ツール</h1>
        <p>
          Ultima
          Onlineの装備ツールチップ画像をアップロードまたは貼り付けて、MOD情報をCSVで抽出します
        </p>
        <div className="usage-info">
          <p>📁 ファイル選択 または 📋 Ctrl+V でクリップボードから貼り付け</p>
        </div>
      </header>

      <main className="app-main">
        {/* ファイルアップロード */}
        <div className="upload-section">
          <label htmlFor="file-input" className="file-label">
            画像ファイルを選択
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          <div className="paste-info">
            <p>
              または、画像をコピーして <kbd>Ctrl+V</kbd> で貼り付け
            </p>
          </div>
          {selectedFile && <p className="file-info">選択されたファイル: {selectedFile.name}</p>}
        </div>

        {/* 画像プレビュー */}
        {imagePreview && (
          <div className="image-preview">
            <h3>選択された画像:</h3>
            <img src={imagePreview} alt="アップロードされた画像" className="preview-image" />
          </div>
        )}

        {/* 解析ボタン */}
        {selectedFile && !isProcessing && (
          <button onClick={processImage} className="analyze-button">
            画像を解析
          </button>
        )}

        {/* 処理中表示 */}
        {isProcessing && (
          <div className="processing">
            <p>解析中...</p>
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* OCR結果テキスト */}
        {ocrText && !isProcessing && (
          <div className="ocr-result">
            <h3>OCR解析結果:</h3>
            <pre className="ocr-text">{ocrText}</pre>
          </div>
        )}

        {/* MOD一覧テーブル */}
        {modEntries.length > 0 && !isProcessing && (
          <div className="mod-results">
            <h3>抽出されたMOD一覧:</h3>
            <table className="mod-table">
              <thead>
                <tr>
                  <th>MOD名</th>
                  <th>値</th>
                </tr>
              </thead>
              <tbody>
                {modEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.mod}</td>
                    <td>{entry.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* CSVダウンロードボタン */}
            <button onClick={downloadCSV} className="csv-button">
              CSVをダウンロード
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

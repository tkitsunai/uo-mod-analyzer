export interface IDownloadService {
  downloadFile(content: string, filename: string, mimeType?: string): void;
}

export interface IClipboardService {
  writeText(text: string): Promise<void>;
}

export class BrowserDownloadService implements IDownloadService {
  downloadFile(
    content: string,
    filename: string,
    mimeType: string = "text/csv;charset=utf-8;"
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

export class BrowserClipboardService implements IClipboardService {
  async writeText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // フォールバック: テキストエリアを使用
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  }
}

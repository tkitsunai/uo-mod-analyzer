export interface IFileService {
  readAsDataURL(file: File): Promise<string>;
  downloadCSV(content: string, filename: string): void;
}

export class FileService implements IFileService {
  async readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("ファイルの読み込みに失敗しました"));
        }
      };

      reader.onerror = () => {
        reject(new Error("ファイルの読み込み中にエラーが発生しました"));
      };

      reader.readAsDataURL(file);
    });
  }

  downloadCSV(content: string, filename: string): void {
    if (!content) {
      console.warn("CSVの内容が空です");
      return;
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
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

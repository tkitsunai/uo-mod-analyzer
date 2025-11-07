/**
 * OCRテキストを解析してアイテム名候補を抽出するドメインサービス
 */
export class OcrTextParser {
  /**
   * OCRテキストから行を抽出し、前処理を行う
   */
  static parseLines(ocrText: string): string[] {
    if (!ocrText?.trim()) {
      return [];
    }

    return ocrText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  /**
   * ツールチップの構造に基づいてアイテム名候補を抽出
   * UOのツールチップは一番上の行がアイテム名という法則を利用
   */
  static extractItemNameCandidates(lines: string[]): ItemNameCandidate[] {
    if (lines.length === 0) {
      return [];
    }

    const candidates: ItemNameCandidate[] = [];

    // 1番目の行を最優先候補として追加
    candidates.push({
      text: lines[0],
      position: 0,
      priority: "primary",
    });

    // 2-3行目も代替候補として追加（1行目がMODの場合のフォールバック）
    for (let i = 1; i < Math.min(lines.length, 3); i++) {
      candidates.push({
        text: lines[i],
        position: i,
        priority: "secondary",
      });
    }

    return candidates;
  }
}

export interface ItemNameCandidate {
  text: string;
  position: number;
  priority: "primary" | "secondary";
}

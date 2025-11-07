import type { AnalyzedItem } from "../domain/entities/AnalyzedItem";
import { createAnalyzedItem } from "../domain/entities/AnalyzedItem";
import { ItemHistoryManager } from "../domain/services/ItemHistoryManager";
import type { ModEntry } from "../domain/entities/ModEntry";

export interface AddItemRequest {
  name: string;
  modEntries: ModEntry[];
  ocrText: string;
  confidence: number;
  imageUrl?: string;
}

export class ItemHistoryUseCase {
  private historyManager: ItemHistoryManager;

  constructor(historyManager: ItemHistoryManager) {
    this.historyManager = historyManager;
  }

  async initialize(): Promise<void> {
    await this.historyManager.initialize();
  }

  async addItem(request: AddItemRequest): Promise<AnalyzedItem> {
    const item = createAnalyzedItem(
      request.name,
      request.modEntries,
      request.ocrText,
      request.confidence,
      request.imageUrl
    );

    await this.historyManager.addItem(item);
    return item;
  }

  async removeItem(id: string): Promise<void> {
    await this.historyManager.removeItem(id);
  }

  async updateItemName(id: string, name: string): Promise<void> {
    await this.historyManager.updateItem(id, { name });
  }

  async clearAllItems(): Promise<void> {
    await this.historyManager.clearAll();
  }

  getItems(): AnalyzedItem[] {
    return this.historyManager.getItems();
  }

  getItem(id: string): AnalyzedItem | undefined {
    return this.historyManager.getItem(id);
  }

  getItemCount(): number {
    return this.historyManager.getItemCount();
  }

  getAllModEntries(): ModEntry[] {
    const allItems = this.getItems();
    return allItems.flatMap((item) => item.modEntries);
  }
}

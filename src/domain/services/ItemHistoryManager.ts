import type { AnalyzedItem } from "../entities/AnalyzedItem";

export interface IItemStorage {
  save(items: AnalyzedItem[]): Promise<void>;
  load(): Promise<AnalyzedItem[]>;
}

export class ItemHistoryManager {
  private items: AnalyzedItem[] = [];
  private storage: IItemStorage;

  constructor(storage: IItemStorage) {
    this.storage = storage;
  }

  async initialize(): Promise<void> {
    this.items = await this.storage.load();
  }

  async addItem(item: AnalyzedItem): Promise<void> {
    this.items.unshift(item);
    await this.storage.save(this.items);
  }

  async removeItem(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
    await this.storage.save(this.items);
  }

  async updateItem(id: string, updates: Partial<AnalyzedItem>): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
      await this.storage.save(this.items);
    }
  }

  async clearAll(): Promise<void> {
    this.items = [];
    await this.storage.save(this.items);
  }

  getItems(): AnalyzedItem[] {
    return [...this.items];
  }

  getItem(id: string): AnalyzedItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  getItemCount(): number {
    return this.items.length;
  }
}

import { IItemData } from 'src/interfaces/IItemData';
import type { ICollectionData } from '../interfaces/ICollectionData';
import { Item } from './Item';

/**
 * Represents a Zotero collection with full CRUD operations.
 */
export class ZCollection {
  private readonly apiKey: string;
  private readonly id: string;
  private readonly type: 'users' | 'groups';
  private readonly baseUrl: string;
  private data: ICollectionData;

  constructor(data: ICollectionData, apiKey: string, id: string, type: 'users' | 'groups') {
    this.data = { ...data };
    this.apiKey = apiKey;
    this.id = id;
    this.type = type;
    this.baseUrl = `https://api.zotero.org/${type}/${id}`;
  }

  get key(): string { return this.data.key; }
  get name(): string { return this.data.name; }
  get parentCollection(): string | undefined { return this.data.parentCollection; }

  /**
   * @throws {Error} When name is empty or whitespace only
   */
  set name(value: string) {
    if (!value?.trim()) {
      throw new Error('Collection name cannot be empty');
    }
    this.data.name = value.trim();
  }

  set parentCollection(value: string | undefined) {
    this.data.parentCollection = value;
  }

  /**
   * Retrieves all items in this collection.
   * @throws {Error} When fetch operation fails
   */
  async getItems(): Promise<Item[]> {
    const response = await fetch(`${this.baseUrl}/collections/${this.data.key}/items`, {
      headers: { 'Zotero-API-Key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items for collection ${this.data.key}: ${response.statusText}`);
    }

    const itemsData: unknown[] = await response.json();
    return itemsData.map((itemData: unknown) => 
      new Item(itemData as IItemData, this.apiKey, this.id, this.type)
    );
  }

  /**
   * Updates the collection on Zotero servers.
   * @throws {Error} When update fails
   */
  async update(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/${this.data.key}`, {
      method: 'PUT',
      headers: {
        'Zotero-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.data)
    });

    if (!response.ok) {
      throw new Error(`Failed to update collection ${this.data.key}: ${response.statusText}`);
    }
  }

  /**
   * Deletes the collection from Zotero servers.
   * @throws {Error} When deletion fails
   */
  async delete(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/${this.data.key}`, {
      method: 'DELETE',
      headers: { 'Zotero-API-Key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete collection ${this.data.key}: ${response.statusText}`);
    }
  }

  /**
   * Attaches an item to this collection by adding the collection key to the item.
   * @throws {Error} When attachment fails
   */
  async attachToItem(item: Item): Promise<void> {
    if (!item.collections.includes(this.data.key)) {
      item.collections.push(this.data.key);
      await item.update();
    }
  }

  toJSON(): ICollectionData {
    return { ...this.data };
  }
}
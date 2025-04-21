import { ICollectionData } from '../interfaces/ICollectionData';
import { Item } from './Item';

export class ZCollection {
  private data: ICollectionData;
  private apiKey: string;
  private id: string;
  private type: 'users' | 'groups';
  private baseUrl: string;

  constructor(data: ICollectionData, apiKey: string, id: string, type: 'users' | 'groups') {
    this.data = data;
    this.apiKey = apiKey;
    this.id = id;
    this.type = type;
    this.baseUrl = `https://api.zotero.org/${type}s/${id}`;
  }

  get key(): string {
    return this.data.key;
  }

  get name(): string {
    return this.data.name;
  }

  get parentCollection(): string | undefined {
    return this.data.parentCollection;
  }

  set name(value: string) {
    this.data.name = value;
  }

  set parentCollection(value: string | undefined) {
    this.data.parentCollection = value;
  }

  async getItems(): Promise<Item[]> {
    const response = await fetch(`${this.baseUrl}/collections/${this.data.key}/items`, {
      headers: {
        'Zotero-API-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items for collection ${this.data.key}`);
    }

    const itemsData = await response.json();
    return itemsData.map((itemData: any) => new Item(itemData, this.apiKey, this.id, this.type));
  }

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
      throw new Error(`Failed to update collection ${this.data.key}`);
    }
  }

  async delete(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/${this.data.key}`, {
      method: 'DELETE',
      headers: {
        'Zotero-API-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete collection ${this.data.key}`);
    }
  }

  toJSON(): ICollectionData {
    return { ...this.data };
  }
}
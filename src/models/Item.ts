import { IItemData } from '../interfaces/IItemData';
import { ZCreator } from './ZCreator';
import { ZTag } from './ZTag';

export class Item {
  private data: IItemData;
  private apiKey: string;
  private id: string;
  private type: 'users' | 'groups';
  private baseUrl: string;

  constructor(data: IItemData, apiKey: string, id: string, type: 'users' | 'groups') {
    this.data = data;
    this.apiKey = apiKey;
    this.id = id;
    this.type = type;
    this.baseUrl = `https://api.zotero.org/${type}/${id}`;
  }

  get key(): string {
    return this.data.key;
  }

  get title(): string {
    return this.data.title;
  }

  get itemType(): string {
    return this.data.itemType;
  }


  get url(): string | undefined {
    return this.data.url;
  }

  get abstractNote(): string | undefined {
    return this.data.abstractNote;
  }

  get date(): string | undefined {
    return this.data.date;
  }

  get language(): string | undefined {
    return this.data.language;
  }

  get tags(): ZTag[] {
    return this.data.tags.map(tag => new ZTag(tag));
  }

  get creators(): ZCreator[] {
    return this.data.creators.map(creator => new ZCreator(creator));
  }

  // Setters for new fields
  set url(value: string | undefined) {
    this.data.url = value;
  }

  set abstractNote(value: string | undefined) {
    this.data.abstractNote = value;
  }

  set date(value: string | undefined) {
    this.data.date = value;
  }

  set language(value: string | undefined) {
    this.data.language = value;
  }

  set title(value: string) {
    this.data.title = value;
  }

  set itemType(value: string) {
    this.data.itemType = value;
  }

  addCreator(creator: ZCreator): void {
    this.data.creators.push(creator.toJSON());
  }

  removeCreator(index: number): void {
    if (index >= 0 && index < this.data.creators.length) {
      this.data.creators.splice(index, 1);
    }
  }

  addTag(tag: ZTag): void {
    this.data.tags.push(tag.toJSON());
  }

  removeTag(index: number): void {
    if (index >= 0 && index < this.data.tags.length) {
      this.data.tags.splice(index, 1);
    }
  }

  async update(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/items/${this.data.key}`, {
      method: 'PUT',
      headers: {
        'Zotero-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.data)
    });

    if (!response.ok) {
      throw new Error(`Failed to update item ${this.data.key}`);
    }
  }

  async delete(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/items/${this.data.key}`, {
      method: 'DELETE',
      headers: {
        'Zotero-API-Key': this.apiKey,
        'If-Unmodified-Since-Version': this.data.version.toString()
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete item ${this.data.key} (${`${this.baseUrl}/items/${this.data.key}`})`);
    }
  }

  toJSON(): IItemData {
    return { ...this.data };
  }
}
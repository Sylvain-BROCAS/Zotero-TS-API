import type { IItemData } from '../interfaces/IItemData';
import { ZCreator } from './ZCreator';
import { ZTag } from './ZTag';

/**
 * Represents a Zotero item with full CRUD operations.
 */
export class Item {
  private readonly apiKey: string;
  private readonly id: string;
  private readonly type: 'users' | 'groups';
  private readonly baseUrl: string;
  private data: IItemData;

  constructor(data: IItemData, apiKey: string, id: string, type: 'users' | 'groups') {
    this.data = { ...data };
    this.apiKey = apiKey;
    this.id = id;
    this.type = type;
    this.baseUrl = `https://api.zotero.org/${type}/${id}`;
  }

  get key(): string { return this.data.key; }
  get title(): string { return this.data.title; }
  get itemType(): string { return this.data.itemType; }
  get url(): string | undefined { return this.data.url; }
  get abstractNote(): string | undefined { return this.data.abstractNote; }
  get date(): string | undefined { return this.data.date; }
  get language(): string | undefined { return this.data.language; }
  get collections(): string[] { return [...this.data.collections]; }

  get tags(): ZTag[] {
    return this.data.tags.map(tag => new ZTag(tag));
  }

  get creators(): ZCreator[] {
    return this.data.creators.map(creator => new ZCreator(creator));
  }

  /**
   * @throws {Error} When title is empty or whitespace only
   */
  set title(value: string) {
    if (!value?.trim()) {
      throw new Error('Title cannot be empty');
    }
    this.data.title = value.trim();
  }

  /**
   * @throws {Error} When itemType is empty or whitespace only
   */
  set itemType(value: string) {
    if (!value?.trim()) {
      throw new Error('Item type cannot be empty');
    }
    this.data.itemType = value.trim();
  }

  set url(value: string | undefined) { this.data.url = value; }
  set abstractNote(value: string | undefined) { this.data.abstractNote = value; }
  set date(value: string | undefined) { this.data.date = value; }
  set language(value: string | undefined) { this.data.language = value; }

  addCreator(creator: ZCreator): void {
    this.data.creators.push(creator.toJSON());
  }

  /**
   * Removes a creator by index. Ignores invalid indices.
   */
  removeCreator(index: number): void {
    if (index >= 0 && index < this.data.creators.length) {
      this.data.creators.splice(index, 1);
    }
  }

  addTag(tag: ZTag): void {
    this.data.tags.push(tag.toJSON());
  }

  /**
   * Removes a tag by index. Ignores invalid indices.
   */
  removeTag(index: number): void {
    if (index >= 0 && index < this.data.tags.length) {
      this.data.tags.splice(index, 1);
    }
  }

  /**
   * Updates the item on Zotero servers.
   * @throws {Error} When update fails
   */
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
      throw new Error(`Failed to update item ${this.data.key}: ${response.statusText}`);
    }
  }

  /**
   * Deletes the item from Zotero servers.
   * @throws {Error} When deletion fails
   */
  async delete(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/items/${this.data.key}`, {
      method: 'DELETE',
      headers: {
        'Zotero-API-Key': this.apiKey,
        'If-Unmodified-Since-Version': this.data.version.toString()
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete item ${this.data.key}: ${response.statusText}`);
    }
  }

  toJSON(): IItemData {
    return { ...this.data };
  }
}
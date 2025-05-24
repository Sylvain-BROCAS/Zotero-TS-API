import type { ITagData } from '../interfaces/ITagData';

/**
 * Represents a tag associated with an item.
 */
export class ZTag {
  private data: ITagData;

  constructor(data: ITagData) {
    this.data = { ...data };
  }

  get name(): string {
    return this.data.tag;
  }

  get type(): number | undefined {
    return this.data.type;
  }

  /**
   * @throws {Error} When name is empty or whitespace only
   */
  set name(value: string) {
    if (!value?.trim()) {
      throw new Error('Tag name cannot be empty');
    }
    this.data.tag = value.trim();
  }

  set type(value: number | undefined) {
    this.data.type = value;
  }

  /**
   * Returns a copy of the tag data.
   */
  toJSON(): ITagData {
    return { ...this.data };
  }
}
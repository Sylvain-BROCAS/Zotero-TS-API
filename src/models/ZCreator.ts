import type { ICreatorData } from '../interfaces/ICreatorData';

/**
 * Represents a creator (author, editor, etc.) with either individual or organization name.
 */
export class ZCreator {
  private data: ICreatorData;

  constructor(data: ICreatorData) {
    this.data = { ...data };
  }

  get creatorType(): string {
    return this.data.creatorType;
  }

  get firstName(): string | undefined {
    return this.data.firstName;
  }

  get lastName(): string | undefined {
    return this.data.lastName;
  }

  get name(): string | undefined {
    return this.data.name;
  }

  set creatorType(value: string) {
    this.data.creatorType = value;
  }

  /**
   * Sets the first name. Automatically clears single name field.
   */
  set firstName(value: string | undefined) {
    this.data.firstName = value;
    if (value !== undefined) {
      this.data.name = undefined;
    }
  }

  /**
   * Sets the last name. Automatically clears single name field.
   */
  set lastName(value: string | undefined) {
    this.data.lastName = value;
    if (value !== undefined) {
      this.data.name = undefined;
    }
  }

  /**
   * Sets the single name (for organizations). Automatically clears first/last name fields.
   */
  set name(value: string | undefined) {
    this.data.name = value;
    if (value !== undefined) {
      this.data.firstName = undefined;
      this.data.lastName = undefined;
    }
  }

  toJSON(): ICreatorData {
    return { ...this.data };
  }
}
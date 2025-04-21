import { ICreatorData } from '../interfaces/ICreatorData';

export class ZCreator {
  private data: ICreatorData;

  constructor(data: ICreatorData) {
    this.data = data;
  }

  get creatorType(): string {
    return this.data.creatorType;
  }

  get firstName(): string {
    return this.data.firstName;
  }

  get lastName(): string {
    return this.data.lastName;
  }

  set creatorType(value: string) {
    this.data.creatorType = value;
  }

  set firstName(value: string) {
    this.data.firstName = value;
  }

  set lastName(value: string) {
    this.data.lastName = value;
  }

  toJSON(): ICreatorData {
    return { ...this.data };
  }
}
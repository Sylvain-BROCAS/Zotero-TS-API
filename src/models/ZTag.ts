import { ITagData } from '../interfaces/ITagData';

export class ZTag {
  private data: ITagData;

  constructor(data: ITagData) {
    this.data = data;
  }

  get tag(): string {
    return this.data.tag;
  }

  get type(): number {
    return this.data.type;
  }

  set tag(value: string) {
    this.data.tag = value;
  }

  set type(value: number) {
    this.data.type = value;
  }

  toJSON(): ITagData {
    return { ...this.data };
  }
}
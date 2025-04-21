export interface ICollectionData {
  key: string;
  version: number;
  name: string;
  parentCollection?: string;
  relations?: Record<string, string>;
}
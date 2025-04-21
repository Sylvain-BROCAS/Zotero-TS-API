import { IItemData } from "./IItemData";

export interface IZoteroAPIResponseItem {
    key: string;
    version: number;
    library: any;
    data: IItemData;
  }
  
import { ILibraryData } from '../interfaces/ILibraryData';
import { ICollectionData } from '../interfaces/ICollectionData';
import { IZoteroAPIResponseItem } from '../interfaces/IZoteroAPIResponseItem';
import { IItemData } from '../interfaces/IItemData';
import { ZCollection } from './ZCollection';
import { Item } from './Item';

export class Library {
  private apiKey: string;
  private libId: string;
  private libraryType: 'users' | 'groups';
  private baseUrl: string;
  private libraryData?: ILibraryData;

  constructor(apiKey: string, libId: string, libraryType: 'users' | 'groups') {
    this.apiKey = apiKey;
    this.libId = libId;
    this.libraryType = libraryType;
    this.baseUrl = `https://api.zotero.org/${libraryType}/${libId}`;
  }

  async connect(): Promise<void> {
    const response = await fetch(this.baseUrl, {
      headers: {
        'Zotero-API-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to connect to Zotero API -- API key : ${this.apiKey} -- ID : ${this.libId} -- Type : ${this.libraryType}`);
    }

    this.libraryData = await response.json();
  }

  get name(): string | undefined {
    return this.libraryData?.name;
  }

  get id(): number | undefined {
    return this.libraryData?.id;
  }

  get type(): string | undefined {
    return this.libraryData?.type;
  }

  async getCollections(): Promise<ZCollection[]> {
    const response = await fetch(`${this.baseUrl}/collections`, {
      headers: {
        'Zotero-API-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch collections');
    }

    const collectionsData = await response.json();
    return collectionsData.map((collectionData: ICollectionData) =>
      new ZCollection(collectionData, this.apiKey, this.libId, this.libraryType)
    );
  }

  async getAllItems(): Promise<Item[]> {
    const response = await fetch(`${this.baseUrl}/items`, {
      headers: {
        'Zotero-API-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }

    const itemsData: IZoteroAPIResponseItem[] = await response.json();
    return itemsData.map((item) =>
      new Item(item.data, this.apiKey, this.libId, this.libraryType)
    );
  }

  async createCollection(name: string, parentCollection?: string): Promise<ZCollection> {
    const collectionData: ICollectionData = {
      key: '',
      version: 0,
      name,
      parentCollection
    };

    const response = await fetch(`${this.baseUrl}/collections`, {
      method: 'POST',
      headers: {
        'Zotero-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(collectionData)
    });

    if (!response.ok) {
      throw new Error('Failed to create collection');
    }

    const createdCollection = await response.json();
    return new ZCollection(createdCollection, this.apiKey, this.libId, this.libraryType);
  }

  async createItem(itemData: Partial<IItemData>): Promise<Item> {
    const defaultItemData: Partial<IItemData> = {
      itemType: 'book',
      title: '',
      creators: [],
      tags: [],
      collections: []
    };

    const newItemData = { ...defaultItemData, ...itemData };

    const response = await fetch(`${this.baseUrl}/items`, {
      method: 'POST',
      headers: {
        'Zotero-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ data: newItemData }]) // 👈 le corps attendu est un tableau d'objets avec "data"
    });

    if (!response.ok) {
      throw new Error('Failed to create item');
    }

    const createdItems: IZoteroAPIResponseItem[] = await response.json();
    return new Item(createdItems[0].data, this.apiKey, this.libId, this.libraryType); // 👈 attention, c’est un tableau
  }
}

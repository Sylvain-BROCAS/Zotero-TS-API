import type { ILibraryData } from '../interfaces/ILibraryData';
import type { ICollectionData } from '../interfaces/ICollectionData';
import type { IZoteroAPIResponseItem } from '../interfaces/IZoteroAPIResponseItem';
import type { IItemData } from '../interfaces/IItemData';
import { ZCollection } from './ZCollection';
import { Item } from './Item';

/**
 * Valid Zotero item fields for API operations.
 */
const ZOTERO_FIELDS = [
  'itemType', 'title', 'creators', 'abstractNote', 'publicationTitle', 'url', 'tags', 'date', 'pages', 'volume', 'issue',
  'publisher', 'place', 'ISBN', 'series', 'seriesTitle', 'seriesText', 'journalAbbreviation', 'language', 'DOI', 'ISSN',
  'shortTitle', 'accessDate', 'archive', 'archiveLocation', 'libraryCatalog', 'callNumber', 'rights', 'extra', 'collections'
] as const;

/**
 * Represents a Zotero library with full CRUD operations.
 */
export class Library {
  private readonly apiKey: string;
  private readonly libId: string;
  private readonly libraryType: 'users' | 'groups';
  private readonly baseUrl: string;
  private libraryData?: ILibraryData;

  /**
   * @param apiKey The Zotero API key
   * @param libId The library ID (user ID or group ID)
   * @param libraryType Type of library ('users' or 'groups')
   * @throws {Error} When required parameters are invalid
   */
  constructor(apiKey: string, libId: string, libraryType: 'users' | 'groups') {
    if (!apiKey?.trim()) {
      throw new Error('API key is required');
    }
    if (!libId?.trim()) {
      throw new Error('Library ID is required');
    }

    this.apiKey = apiKey;
    this.libId = libId;
    this.libraryType = libraryType;
    this.baseUrl = `https://api.zotero.org/${libraryType}/${libId}`;
  }

  /**
   * Establishes connection to the Zotero library.
   * @throws {Error} When connection fails or credentials are invalid
   */
  async connect(): Promise<void> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: { 'Zotero-API-Key': this.apiKey }
      });

      if (!response.ok) {
        throw new Error(
          `Failed to connect to Zotero API (${response.status}): ${response.statusText}`
        );
      }

      this.libraryData = await response.json();
    } catch (error) {
      throw new Error(
        `Connection failed - API key: ${this.apiKey}, ID: ${this.libId}, Type: ${this.libraryType}. ${error}`
      );
    }
  }

  get apiKeyValue(): string {
    return this.apiKey;
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

  /**
   * @throws {Error} When fetch operation fails
   */
  async getCollections(): Promise<ZCollection[]> {
    const response = await this.makeRequest('/collections');
    const collectionsData: ICollectionData[] = await response.json();
    
    return collectionsData.map(collectionData =>
      new ZCollection(collectionData, this.apiKey, this.libId, this.libraryType)
    );
  }

  /**
   * @throws {Error} When fetch operation fails
   */
  async getAllItems(): Promise<Item[]> {
    const response = await this.makeRequest('/items');
    const itemsData: IZoteroAPIResponseItem[] = await response.json();
    
    return itemsData.map(item =>
      new Item(item.data, this.apiKey, this.libId, this.libraryType)
    );
  }

  /**
   * Creates a new collection in the library.
   * @param name Name of the collection
   * @param parentCollection Optional parent collection key
   * @throws {Error} When creation fails or name is invalid
   */
  async createCollection(name: string, parentCollection?: string): Promise<ZCollection> {
    if (!name?.trim()) {
      throw new Error('Collection name is required');
    }

    const collectionData: Omit<ICollectionData, 'key' | 'version'> = {
      name: name.trim(),
      parentCollection
    };

    const response = await this.makeRequest('/collections', {
      method: 'POST',
      body: JSON.stringify([collectionData])
    });

    const created = await response.json();
    return new ZCollection(created[0], this.apiKey, this.libId, this.libraryType);
  }

  /**
   * Creates a new item in the library.
   * @param itemData Item data object
   * @throws {Error} When creation fails or required fields are missing
   */
  async createItem(itemData: Record<string, unknown>): Promise<Item> {
    if (!itemData.title?.toString().trim()) {
      throw new Error('A title is required to create a Zotero item');
    }

    const { validData, unknownFields } = this.validateItemData(itemData);
    
    if (unknownFields.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(`[Zotero] Unknown fields ignored: ${unknownFields.join(', ')}`);
    }

    // Correction : Utiliser directement l'opérateur de coalescence nulle
    validData.itemType ??= 'webpage';

    const response = await this.makeRequest('/items', {
      method: 'POST',
      body: JSON.stringify([{ data: validData }])
    });

    const created = await response.json();
    const itemDataResponse = this.extractCreatedItemData(created);

    return new Item(itemDataResponse, this.apiKey, this.libId, this.libraryType);
  }

  /**
   * @throws {Error} When fetch operation fails
   */
  async getTags(): Promise<string[]> {
    const response = await this.makeRequest('/tags');
    const tagsData: Array<{ tag: string }> = await response.json();
    
    return tagsData.map(tag => tag.tag);
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Zotero-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed (${response.status}): ${response.statusText}`);
    }

    return response;
  }

  private validateItemData(itemData: Record<string, unknown>): {
    validData: Partial<IItemData>;
    unknownFields: string[];
  } {
    const validData: Partial<IItemData> = {};
    const unknownFields: string[] = [];

    for (const [key, value] of Object.entries(itemData)) {
      if (ZOTERO_FIELDS.includes(key as typeof ZOTERO_FIELDS[number])) {
        (validData as Record<string, unknown>)[key] = value;
      } else {
        unknownFields.push(key);
      }
    }

    return { validData, unknownFields };
  }

  private extractCreatedItemData(created: unknown): IItemData {
    if (Array.isArray(created)) {
      return created[0]?.data;
    }
    
    if (created && typeof created === 'object' && 'successful' in created) {
      const successful = (created as { successful: Record<string, { data: IItemData }> }).successful;
      const firstKey = Object.keys(successful)[0];
      return successful[firstKey]?.data;
    }

    throw new Error('Zotero API did not return a valid created item');
  }
}

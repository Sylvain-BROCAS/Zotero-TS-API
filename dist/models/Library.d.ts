import { ZCollection } from './ZCollection';
import { Item } from './Item';
export declare class Library {
    private readonly apiKey;
    private readonly libId;
    private readonly libraryType;
    private readonly baseUrl;
    private libraryData?;
    constructor(apiKey: string, libId: string, libraryType: 'users' | 'groups');
    connect(): Promise<void>;
    get apiKeyValue(): string;
    get name(): string | undefined;
    get id(): number | undefined;
    get type(): string | undefined;
    getCollections(): Promise<ZCollection[]>;
    getAllItems(): Promise<Item[]>;
    createCollection(name: string, parentCollection?: string): Promise<ZCollection>;
    createItem(itemData: Record<string, unknown>): Promise<Item>;
    getTags(): Promise<string[]>;
    private makeRequest;
    private validateItemData;
    private extractCreatedItemData;
}
//# sourceMappingURL=Library.d.ts.map
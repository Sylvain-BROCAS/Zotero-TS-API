import { IItemData } from '../interfaces/IItemData';
import { ZCollection } from './ZCollection';
import { Item } from './Item';
export declare class Library {
    private apiKey;
    private libId;
    private libraryType;
    private baseUrl;
    private libraryData?;
    constructor(apiKey: string, libId: string, libraryType: 'users' | 'groups');
    connect(): Promise<void>;
    get name(): string | undefined;
    get id(): number | undefined;
    get type(): string | undefined;
    getCollections(): Promise<ZCollection[]>;
    getAllItems(): Promise<Item[]>;
    createCollection(name: string, parentCollection?: string): Promise<ZCollection>;
    createItem(itemData: Partial<IItemData>): Promise<Item>;
}
//# sourceMappingURL=Library.d.ts.map
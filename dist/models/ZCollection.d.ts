import { ICollectionData } from '../interfaces/ICollectionData';
import { Item } from './Item';
export declare class ZCollection {
    private data;
    private apiKey;
    private id;
    private type;
    private baseUrl;
    constructor(data: ICollectionData, apiKey: string, id: string, type: 'users' | 'groups');
    get key(): string;
    get name(): string;
    get parentCollection(): string | undefined;
    set name(value: string);
    set parentCollection(value: string | undefined);
    getItems(): Promise<Item[]>;
    update(): Promise<void>;
    delete(): Promise<void>;
    toJSON(): ICollectionData;
}
//# sourceMappingURL=ZCollection.d.ts.map
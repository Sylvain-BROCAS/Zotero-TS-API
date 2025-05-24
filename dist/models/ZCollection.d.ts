import type { ICollectionData } from '../interfaces/ICollectionData';
import { Item } from './Item';
export declare class ZCollection {
    private readonly apiKey;
    private readonly id;
    private readonly type;
    private readonly baseUrl;
    private data;
    constructor(data: ICollectionData, apiKey: string, id: string, type: 'users' | 'groups');
    get key(): string;
    get name(): string;
    get parentCollection(): string | undefined;
    set name(value: string);
    set parentCollection(value: string | undefined);
    getItems(): Promise<Item[]>;
    update(): Promise<void>;
    delete(): Promise<void>;
    attachToItem(item: Item): Promise<void>;
    toJSON(): ICollectionData;
}
//# sourceMappingURL=ZCollection.d.ts.map
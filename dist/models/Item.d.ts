import { IItemData } from '../interfaces/IItemData';
import { ZCreator } from './ZCreator';
import { ZTag } from './ZTag';
export declare class Item {
    private data;
    private apiKey;
    private id;
    private type;
    private baseUrl;
    constructor(data: IItemData, apiKey: string, id: string, type: 'users' | 'groups');
    get key(): string;
    get title(): string;
    get itemType(): string;
    get creators(): ZCreator[];
    get tags(): ZTag[];
    set title(value: string);
    set itemType(value: string);
    addCreator(creator: ZCreator): void;
    removeCreator(index: number): void;
    addTag(tag: ZTag): void;
    removeTag(index: number): void;
    update(): Promise<void>;
    delete(): Promise<void>;
    toJSON(): IItemData;
}
//# sourceMappingURL=Item.d.ts.map
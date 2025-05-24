import type { IItemData } from '../interfaces/IItemData';
import { ZCreator } from './ZCreator';
import { ZTag } from './ZTag';
export declare class Item {
    private readonly apiKey;
    private readonly id;
    private readonly type;
    private readonly baseUrl;
    private data;
    constructor(data: IItemData, apiKey: string, id: string, type: 'users' | 'groups');
    get key(): string;
    get title(): string;
    get itemType(): string;
    get url(): string | undefined;
    get abstractNote(): string | undefined;
    get date(): string | undefined;
    get language(): string | undefined;
    get collections(): string[];
    get tags(): ZTag[];
    get creators(): ZCreator[];
    set title(value: string);
    set itemType(value: string);
    set url(value: string | undefined);
    set abstractNote(value: string | undefined);
    set date(value: string | undefined);
    set language(value: string | undefined);
    addCreator(creator: ZCreator): void;
    removeCreator(index: number): void;
    addTag(tag: ZTag): void;
    removeTag(index: number): void;
    update(): Promise<void>;
    delete(): Promise<void>;
    toJSON(): IItemData;
}
//# sourceMappingURL=Item.d.ts.map
import { ITagData } from '../interfaces/ITagData';
export declare class ZTag {
    private data;
    constructor(data: ITagData);
    get tag(): string;
    get type(): number;
    set tag(value: string);
    set type(value: number);
    toJSON(): ITagData;
}
//# sourceMappingURL=ZTag.d.ts.map
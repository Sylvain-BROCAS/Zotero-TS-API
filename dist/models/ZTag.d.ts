import type { ITagData } from '../interfaces/ITagData';
export declare class ZTag {
    private data;
    constructor(data: ITagData);
    get name(): string;
    get type(): number | undefined;
    set name(value: string);
    set type(value: number | undefined);
    toJSON(): ITagData;
}
//# sourceMappingURL=ZTag.d.ts.map
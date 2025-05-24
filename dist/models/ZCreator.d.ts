import type { ICreatorData } from '../interfaces/ICreatorData';
export declare class ZCreator {
    private data;
    constructor(data: ICreatorData);
    get creatorType(): string;
    get firstName(): string | undefined;
    get lastName(): string | undefined;
    get name(): string | undefined;
    set creatorType(value: string);
    set firstName(value: string | undefined);
    set lastName(value: string | undefined);
    set name(value: string | undefined);
    toJSON(): ICreatorData;
}
//# sourceMappingURL=ZCreator.d.ts.map
import { ICreatorData } from '../interfaces/ICreatorData';
export declare class ZCreator {
    private data;
    constructor(data: ICreatorData);
    get creatorType(): string;
    get firstName(): string;
    get lastName(): string;
    set creatorType(value: string);
    set firstName(value: string);
    set lastName(value: string);
    toJSON(): ICreatorData;
}
//# sourceMappingURL=ZCreator.d.ts.map
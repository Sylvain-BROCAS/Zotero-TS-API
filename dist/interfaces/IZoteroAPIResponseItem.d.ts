import type { IItemData } from './IItemData';
export interface IZoteroAPIResponseItem {
    key: string;
    version: number;
    library: {
        type: 'user' | 'group';
        id: number;
        name: string;
        links: {
            alternate: {
                href: string;
                type: string;
            };
        };
    };
    data: IItemData;
    links: {
        self: {
            href: string;
            type: string;
        };
        alternate: {
            href: string;
            type: string;
        };
    };
    meta: {
        createdByUser?: {
            id: number;
            username: string;
            name: string;
        };
        lastModifiedByUser?: {
            id: number;
            username: string;
            name: string;
        };
    };
}
//# sourceMappingURL=IZoteroAPIResponseItem.d.ts.map
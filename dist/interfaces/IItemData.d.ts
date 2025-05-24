import { ICreatorData } from './ICreatorData';
import { ITagData } from './ITagData';
export interface IItemData {
    key: string;
    version: number;
    itemType: string;
    title: string;
    creators: ICreatorData[];
    abstractNote?: string;
    publicationTitle?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    date?: string;
    language?: string;
    DOI?: string;
    ISBN?: string;
    shortTitle?: string;
    url?: string;
    accessDate?: string;
    archive?: string;
    archiveLocation?: string;
    libraryCatalog?: string;
    callNumber?: string;
    rights?: string;
    extra?: string;
    dateAdded?: string;
    dateModified?: string;
    tags: ITagData[];
    collections: string[];
    relations?: Record<string, string>;
}
//# sourceMappingURL=IItemData.d.ts.map
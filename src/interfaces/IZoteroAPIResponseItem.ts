import type { IItemData } from './IItemData';

/**
 * Represents the full response structure from Zotero API for an item
 */
export interface IZoteroAPIResponseItem {
  /** Unique identifier for the item */
  key: string;
  /** Version number for concurrency control */
  version: number;
  /** Library information */
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
  /** The actual item data */
  data: IItemData;
  /** API links for this item */
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
  /** Additional metadata */
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

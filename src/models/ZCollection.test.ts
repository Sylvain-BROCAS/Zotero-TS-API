import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZCollection } from './ZCollection';
import { Item } from './Item';
import type { ICollectionData } from '../interfaces/ICollectionData';
import { createMockResponse } from '../__tests__/utils/test-helpers';

describe('ZCollection', () => {
  let collection: ZCollection;
  let mockCollectionData: ICollectionData;

  beforeEach(() => {
    mockCollectionData = {
      key: 'COLLECTION123',
      version: 1,
      name: 'Test Collection',
      parentCollection: undefined
    };

    collection = new ZCollection(mockCollectionData, 'test-api-key', 'user123', 'users');
  });

  describe('Constructor', () => {
    it('should create collection with valid data', () => {
      expect(collection.key).toBe('COLLECTION123');
      expect(collection.name).toBe('Test Collection');
      expect(collection.parentCollection).toBeUndefined();
    });

    it('should create child collection', () => {
      const childData: ICollectionData = {
        key: 'CHILD123',
        version: 1,
        name: 'Child Collection',
        parentCollection: 'PARENT123'
      };

      const childCollection = new ZCollection(childData, 'api-key', 'user', 'users');

      expect(childCollection.parentCollection).toBe('PARENT123');
    });
  });

  describe('Getters', () => {
    it('should return correct key', () => {
      expect(collection.key).toBe('COLLECTION123');
    });

    it('should return correct name', () => {
      expect(collection.name).toBe('Test Collection');
    });

    it('should return correct parentCollection', () => {
      expect(collection.parentCollection).toBeUndefined();
    });
  });

  describe('Setters', () => {
    it('should set name correctly', () => {
      collection.name = 'Updated Collection';
      expect(collection.name).toBe('Updated Collection');
    });

    it('should trim name whitespace', () => {
      collection.name = '  Spaced Name  ';
      expect(collection.name).toBe('Spaced Name');
    });

    it('should throw error for empty name', () => {
      expect(() => { collection.name = ''; })
        .toThrow('Collection name cannot be empty');
    });

    it('should throw error for whitespace-only name', () => {
      expect(() => { collection.name = '   '; })
        .toThrow('Collection name cannot be empty');
    });

    it('should throw error for null name', () => {
      expect(() => { collection.name = null as any; })
        .toThrow('Collection name cannot be empty');
    });

    it('should set parentCollection', () => {
      collection.parentCollection = 'PARENT456';
      expect(collection.parentCollection).toBe('PARENT456');
    });

    it('should allow undefined parentCollection', () => {
      collection.parentCollection = undefined;
      expect(collection.parentCollection).toBeUndefined();
    });
  });

  describe('getItems()', () => {
    it('should retrieve items successfully', async () => {
      const mockItems = [
        {
          key: 'ITEM1',
          version: 1,
          title: 'Item 1',
          itemType: 'article',
          creators: [],
          tags: [],
          collections: ['COLLECTION123'],
          relations: {}
        },
        {
          key: 'ITEM2',
          version: 2,
          title: 'Item 2',
          itemType: 'book',
          creators: [],
          tags: [],
          collections: ['COLLECTION123'],
          relations: {}
        }
      ];

      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(mockItems));

      const items = await collection.getItems();

      expect(items).toHaveLength(2);
      expect(items[0]).toBeInstanceOf(Item);
      expect(items[0].title).toBe('Item 1');
      expect(items[1].title).toBe('Item 2');
    });

    it('should handle empty items response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse([]));

      const items = await collection.getItems();

      expect(items).toEqual([]);
    });

    it('should handle API error when fetching items', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(null, {
        ok: false,
        statusText: 'Not Found'
      }));

      await expect(collection.getItems())
        .rejects.toThrow('Failed to fetch items for collection COLLECTION123: Not Found');
    });
  });

  describe('update()', () => {
    it('should update collection successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(null));

      await expect(collection.update()).resolves.toBeUndefined();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.zotero.org/users/user123/collections/COLLECTION123',
        {
          method: 'PUT',
          headers: {
            'Zotero-API-Key': 'test-api-key',
            'Content-Type': 'application/json'
          },
          body: expect.stringContaining('"name":"Test Collection"')
        }
      );
    });

    it('should handle update failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(null, {
        ok: false,
        statusText: 'Conflict'
      }));

      await expect(collection.update())
        .rejects.toThrow('Failed to update collection COLLECTION123: Conflict');
    });
  });

  describe('delete()', () => {
    it('should delete collection successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(null));

      await expect(collection.delete()).resolves.toBeUndefined();
    });

    it('should handle delete failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(null, {
        ok: false,
        statusText: 'Forbidden'
      }));

      await expect(collection.delete())
        .rejects.toThrow('Failed to delete collection COLLECTION123: Forbidden');
    });
  });

  describe('toJSON()', () => {
    it('should return copy of collection data', () => {
      const json = collection.toJSON();

      expect(json).toEqual(mockCollectionData);
      expect(json).not.toBe(mockCollectionData);
    });

    it('should reflect current state after modifications', () => {
      collection.name = 'Modified Name';
      
      const json = collection.toJSON();
      
      expect(json.name).toBe('Modified Name');
    });
  });
});
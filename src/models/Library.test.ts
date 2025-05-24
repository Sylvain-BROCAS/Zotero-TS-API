import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Library } from './Library';
import { Item } from './Item';
import { ZCollection } from './ZCollection';
import { mockFetchSuccess, mockFetchError, createMockResponse } from '../__tests__/utils/test-helpers';

describe('Library', () => {
  let library: Library;
  const validApiKey = 'test-api-key-123';
  const validUserId = 'user123';
  const validGroupId = 'group456';

  beforeEach(() => {
    library = new Library(validApiKey, validUserId, 'users');
  });

  describe('Constructor', () => {
    it('should create library with valid parameters', () => {
      expect(library.apiKeyValue).toBe(validApiKey);
    });

    it('should create user library', () => {
      const userLibrary = new Library(validApiKey, validUserId, 'users');
      expect(userLibrary.apiKeyValue).toBe(validApiKey);
    });

    it('should create group library', () => {
      const groupLibrary = new Library(validApiKey, validGroupId, 'groups');
      expect(groupLibrary.apiKeyValue).toBe(validApiKey);
    });

    it('should throw error with empty API key', () => {
      expect(() => new Library('', validUserId, 'users'))
        .toThrow('API key is required');
    });

    it('should throw error with whitespace API key', () => {
      expect(() => new Library('   ', validUserId, 'users'))
        .toThrow('API key is required');
    });

    it('should throw error with null API key', () => {
      expect(() => new Library(null as any, validUserId, 'users'))
        .toThrow('API key is required');
    });

    it('should throw error with undefined API key', () => {
      expect(() => new Library(undefined as any, validUserId, 'users'))
        .toThrow('API key is required');
    });

    it('should throw error with empty library ID', () => {
      expect(() => new Library(validApiKey, '', 'users'))
        .toThrow('Library ID is required');
    });

    it('should throw error with whitespace library ID', () => {
      expect(() => new Library(validApiKey, '   ', 'users'))
        .toThrow('Library ID is required');
    });
  });

  describe('Getters before connection', () => {
    it('should return undefined for name before connection', () => {
      expect(library.name).toBeUndefined();
    });

    it('should return undefined for id before connection', () => {
      expect(library.id).toBeUndefined();
    });

    it('should return undefined for type before connection', () => {
      expect(library.type).toBeUndefined();
    });
  });

  describe('connect()', () => {
    it('should connect successfully with valid credentials', async () => {
      const mockLibraryData = {
        id: 123,
        name: 'Test Library',
        type: 'user',
        description: 'Test description'
      };

      mockFetchSuccess(mockLibraryData);

      await library.connect();

      expect(library.name).toBe('Test Library');
      expect(library.id).toBe(123);
      expect(library.type).toBe('user');
    });

    it('should handle 403 Forbidden error', async () => {
      mockFetchError(403, 'Forbidden');

      await expect(library.connect())
        .rejects.toThrow('Failed to connect to Zotero API (403): Forbidden');
    });

    it('should handle malformed JSON response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as any);

      await expect(library.connect())
        .rejects.toThrow('Connection failed');
    });
  });

  describe('getCollections()', () => {
    it('should retrieve collections successfully', async () => {
      const mockCollections = [
        { key: 'ABC123', name: 'Collection 1', parentCollection: undefined, version: 1 },
        { key: 'DEF456', name: 'Collection 2', parentCollection: 'ABC123', version: 1 }
      ];

      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(mockCollections));

      const collections = await library.getCollections();

      expect(collections).toHaveLength(2);
      expect(collections[0]).toBeInstanceOf(ZCollection);
      expect(collections[0].key).toBe('ABC123');
      expect(collections[1].key).toBe('DEF456');
    });

    it('should handle empty collections response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse([]));

      const collections = await library.getCollections();

      expect(collections).toEqual([]);
    });

    it('should handle API error when fetching collections', async () => {
      mockFetchError(500, 'Internal Server Error');

      await expect(library.getCollections())
        .rejects.toThrow('API request failed (500): Internal Server Error');
    });
  });

  describe('getAllItems()', () => {
    it('should retrieve items successfully', async () => {
      const mockItems = [
        {
          data: {
            key: 'ITEM123',
            title: 'Test Article',
            itemType: 'journalArticle',
            creators: [],
            tags: [],
            collections: [],
            version: 1,
            relations: {}
          }
        },
        {
          data: {
            key: 'ITEM456',
            title: 'Another Article',
            itemType: 'webpage',
            creators: [],
            tags: [],
            collections: [],
            version: 2,
            relations: {}
          }
        }
      ];

      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(mockItems));

      const items = await library.getAllItems();

      expect(items).toHaveLength(2);
      expect(items[0]).toBeInstanceOf(Item);
      expect(items[0].key).toBe('ITEM123');
      expect(items[0].title).toBe('Test Article');
      expect(items[1].title).toBe('Another Article');
    });

    it('should handle empty items response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(createMockResponse([]));

      const items = await library.getAllItems();

      expect(items).toEqual([]);
    });
  });

  describe('createCollection()', () => {
    it('should create collection with valid name', async () => {
      const mockResponse = {
        key: 'NEW123',
        name: 'New Collection',
        parentCollection: undefined
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockResponse]
      } as Response);

      const collection = await library.createCollection('New Collection');

      expect(collection).toBeInstanceOf(ZCollection);
      expect(collection.name).toBe('New Collection');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.zotero.org/users/user123/collections',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify([{ name: 'New Collection', parentCollection: undefined }])
        })
      );
    });

    it('should create collection with parent', async () => {
      const mockResponse = {
        key: 'CHILD123',
        name: 'Child Collection',
        parentCollection: 'PARENT123'
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockResponse]
      } as Response);

      const collection = await library.createCollection('Child Collection', 'PARENT123');

      expect(collection.name).toBe('Child Collection');
      expect(collection.parentCollection).toBe('PARENT123');
    });

    it('should throw error with empty collection name', async () => {
      await expect(library.createCollection(''))
        .rejects.toThrow('Collection name is required');
    });

    it('should throw error with whitespace collection name', async () => {
      await expect(library.createCollection('   '))
        .rejects.toThrow('Collection name is required');
    });

    it('should throw error with null collection name', async () => {
      await expect(library.createCollection(null as any))
        .rejects.toThrow('Collection name is required');
    });

    it('should handle API error during collection creation', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      } as Response);

      await expect(library.createCollection('Test Collection'))
        .rejects.toThrow('API request failed (400): Bad Request');
    });
  });

  describe('createItem()', () => {
    it('should create item with valid data', async () => {
      const itemData = {
        title: 'Test Article',
        itemType: 'journalArticle',
        url: 'https://example.com'
      };

      const mockResponse = {
        successful: {
          '0': {
            data: {
              ...itemData,
              key: 'NEWITEM123',
              version: 1,
              creators: [],
              tags: [],
              collections: []
            }
          }
        }
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const item = await library.createItem(itemData);

      expect(item).toBeInstanceOf(Item);
      expect(item.title).toBe('Test Article');
      expect(item.key).toBe('NEWITEM123');
    });

    it('should create item with default itemType when not provided', async () => {
      const itemData = { title: 'Test Item' };

      const mockResponse = [{
        data: {
          title: 'Test Item',
          itemType: 'webpage',
          key: 'NEWITEM456',
          version: 1,
          creators: [],
          tags: [],
          collections: []
        }
      }];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const item = await library.createItem(itemData);

      expect(item.itemType).toBe('webpage');
    });

    it('should filter unknown fields and warn', async () => {
      const itemData = {
        title: 'Test Article',
        unknownField: 'should be filtered',
        anotherUnknown: 123
      };

      const mockResponse = [{
        data: {
          title: 'Test Article',
          itemType: 'webpage',
          key: 'FILTERED123',
          version: 1,
          creators: [],
          tags: [],
          collections: []
        }
      }];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const consoleSpy = vi.spyOn(console, 'warn');

      await library.createItem(itemData);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Zotero] Unknown fields ignored: unknownField, anotherUnknown'
      );
    });

    it('should throw error when title is missing', async () => {
      const itemData = { itemType: 'journalArticle' };

      await expect(library.createItem(itemData))
        .rejects.toThrow('A title is required to create a Zotero item');
    });

    it('should throw error when title is empty', async () => {
      const itemData = { title: '', itemType: 'journalArticle' };

      await expect(library.createItem(itemData))
        .rejects.toThrow('A title is required to create a Zotero item');
    });

    it('should throw error when title is whitespace', async () => {
      const itemData = { title: '   ', itemType: 'journalArticle' };

      await expect(library.createItem(itemData))
        .rejects.toThrow('A title is required to create a Zotero item');
    });

    it('should handle malformed API response', async () => {
      const itemData = { title: 'Test Article' };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ unexpected: 'format' })
      } as Response);

      await expect(library.createItem(itemData))
        .rejects.toThrow('Zotero API did not return a valid created item');
    });
  });

  describe('getTags()', () => {
    it('should retrieve tags successfully', async () => {
      const mockTags = [
        { tag: 'science' },
        { tag: 'research' },
        { tag: 'typescript' }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTags
      } as Response);

      const tags = await library.getTags();

      expect(tags).toEqual(['science', 'research', 'typescript']);
    });

    it('should handle empty tags response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);

      const tags = await library.getTags();

      expect(tags).toEqual([]);
    });

    it('should handle API error when fetching tags', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable'
      } as Response);

      await expect(library.getTags())
        .rejects.toThrow('API request failed (503): Service Unavailable');
    });
  });
});
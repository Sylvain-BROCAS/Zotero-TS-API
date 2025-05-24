import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Item } from './Item';
import { ZCreator } from './ZCreator';
import { ZTag } from './ZTag';
import type { IItemData } from '../interfaces/IItemData';

describe('Item', () => {
  let item: Item;
  let mockItemData: IItemData;

  beforeEach(() => {
    mockItemData = {
      key: 'TESTITEM123',
      version: 1,
      title: 'Test Article',
      itemType: 'journalArticle',
      creators: [
        { creatorType: 'author', firstName: 'John', lastName: 'Doe' }
      ],
      tags: [
        { tag: 'science' }
      ],
      collections: ['COLLECTION123'],
      url: 'https://example.com',
      abstractNote: 'Test abstract',
      date: '2023-01-15',
      language: 'en',
      relations: {},
    };

    item = new Item(mockItemData, 'test-api-key', 'user123', 'users');
  });

  describe('Constructor', () => {
    it('should create item with valid data', () => {
      expect(item.key).toBe('TESTITEM123');
      expect(item.title).toBe('Test Article');
      expect(item.itemType).toBe('journalArticle');
    });

    it('should create defensive copy of data', () => {
      const originalData = { ...mockItemData };
      const testItem = new Item(mockItemData, 'api-key', 'user', 'users');
      
      mockItemData.title = 'Modified Title';
      
      expect(testItem.title).toBe(originalData.title);
    });
  });

  describe('Getters', () => {
    it('should return correct key', () => {
      expect(item.key).toBe('TESTITEM123');
    });

    it('should return correct title', () => {
      expect(item.title).toBe('Test Article');
    });

    it('should return correct itemType', () => {
      expect(item.itemType).toBe('journalArticle');
    });

    it('should return correct url', () => {
      expect(item.url).toBe('https://example.com');
    });

    it('should return correct abstractNote', () => {
      expect(item.abstractNote).toBe('Test abstract');
    });

    it('should return correct date', () => {
      expect(item.date).toBe('2023-01-15');
    });

    it('should return correct language', () => {
      expect(item.language).toBe('en');
    });

    it('should return defensive copy of collections', () => {
      const collections = item.collections;
      collections.push('NEW_COLLECTION');
      
      expect(item.collections).toEqual(['COLLECTION123']);
    });

    it('should return ZTag instances', () => {
      const tags = item.tags;
      expect(tags).toHaveLength(1);
      expect(tags[0]).toBeInstanceOf(ZTag);
      expect(tags[0].name).toBe('science');
    });

    it('should return ZCreator instances', () => {
      const creators = item.creators;
      expect(creators).toHaveLength(1);
      expect(creators[0]).toBeInstanceOf(ZCreator);
      expect(creators[0].firstName).toBe('John');
      expect(creators[0].lastName).toBe('Doe');
    });

    it('should handle undefined optional fields', () => {
      const minimalData: IItemData = {
        key: 'MINIMAL123',
        version: 1,
        title: 'Minimal Item',
        itemType: 'webpage',
        creators: [],
        tags: [],
        collections: [],
        relations: {},
      };

      const minimalItem = new Item(minimalData, 'api-key', 'user', 'users');

      expect(minimalItem.url).toBeUndefined();
      expect(minimalItem.abstractNote).toBeUndefined();
      expect(minimalItem.date).toBeUndefined();
      expect(minimalItem.language).toBeUndefined();
    });
  });

  describe('Setters', () => {
    it('should set title correctly', () => {
      item.title = 'New Title';
      expect(item.title).toBe('New Title');
    });

    it('should trim title whitespace', () => {
      item.title = '  Spaced Title  ';
      expect(item.title).toBe('Spaced Title');
    });

    it('should throw error for empty title', () => {
      expect(() => { item.title = ''; })
        .toThrow('Title cannot be empty');
    });

    it('should throw error for whitespace-only title', () => {
      expect(() => { item.title = '   '; })
        .toThrow('Title cannot be empty');
    });

    it('should throw error for null title', () => {
      expect(() => { item.title = null as any; })
        .toThrow('Title cannot be empty');
    });

    it('should set itemType correctly', () => {
      item.itemType = 'book';
      expect(item.itemType).toBe('book');
    });

    it('should trim itemType whitespace', () => {
      item.itemType = '  webpage  ';
      expect(item.itemType).toBe('webpage');
    });

    it('should throw error for empty itemType', () => {
      expect(() => { item.itemType = ''; })
        .toThrow('Item type cannot be empty');
    });

    it('should throw error for whitespace-only itemType', () => {
      expect(() => { item.itemType = '   '; })
        .toThrow('Item type cannot be empty');
    });

    it('should set optional fields', () => {
      item.url = 'https://newurl.com';
      item.abstractNote = 'New abstract';
      item.date = '2024-01-01';
      item.language = 'fr';

      expect(item.url).toBe('https://newurl.com');
      expect(item.abstractNote).toBe('New abstract');
      expect(item.date).toBe('2024-01-01');
      expect(item.language).toBe('fr');
    });

    it('should allow undefined for optional fields', () => {
      item.url = undefined;
      item.abstractNote = undefined;
      item.date = undefined;
      item.language = undefined;

      expect(item.url).toBeUndefined();
      expect(item.abstractNote).toBeUndefined();
      expect(item.date).toBeUndefined();
      expect(item.language).toBeUndefined();
    });
  });

  describe('Creator management', () => {
    it('should add creator', () => {
      const newCreator = new ZCreator({
        creatorType: 'editor',
        firstName: 'Jane',
        lastName: 'Smith'
      });

      item.addCreator(newCreator);

      const creators = item.creators;
      expect(creators).toHaveLength(2);
      expect(creators[1].firstName).toBe('Jane');
      expect(creators[1].lastName).toBe('Smith');
    });

    it('should remove creator by valid index', () => {
      item.removeCreator(0);

      expect(item.creators).toHaveLength(0);
    });

    it('should ignore invalid removal index (negative)', () => {
      const originalLength = item.creators.length;
      item.removeCreator(-1);

      expect(item.creators).toHaveLength(originalLength);
    });

    it('should ignore invalid removal index (too high)', () => {
      const originalLength = item.creators.length;
      item.removeCreator(999);

      expect(item.creators).toHaveLength(originalLength);
    });
  });

  describe('Tag management', () => {
    it('should add tag', () => {
      const newTag = new ZTag({ tag: 'technology' });

      item.addTag(newTag);

      const tags = item.tags;
      expect(tags).toHaveLength(2);
      expect(tags[1].name).toBe('technology');
    });

    it('should remove tag by valid index', () => {
      item.removeTag(0);

      expect(item.tags).toHaveLength(0);
    });

    it('should ignore invalid tag removal index (negative)', () => {
      const originalLength = item.tags.length;
      item.removeTag(-1);

      expect(item.tags).toHaveLength(originalLength);
    });

    it('should ignore invalid tag removal index (too high)', () => {
      const originalLength = item.tags.length;
      item.removeTag(999);

      expect(item.tags).toHaveLength(originalLength);
    });
  });

  describe('update()', () => {
    it('should update item successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true
      } as Response);

      await expect(item.update()).resolves.toBeUndefined();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.zotero.org/users/user123/items/TESTITEM123',
        {
          method: 'PUT',
          headers: {
            'Zotero-API-Key': 'test-api-key',
            'Content-Type': 'application/json'
          },
          body: expect.stringContaining('"title":"Test Article"')
        }
      );
    });

    it('should handle update failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Conflict'
      } as Response);

      await expect(item.update())
        .rejects.toThrow('Failed to update item TESTITEM123: Conflict');
    });

    it('should handle network error during update', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'));

      await expect(item.update())
        .rejects.toThrow('Network failure');
    });
  });

  describe('delete()', () => {
    it('should delete item successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true
      } as Response);

      await expect(item.delete()).resolves.toBeUndefined();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.zotero.org/users/user123/items/TESTITEM123',
        {
          method: 'DELETE',
          headers: {
            'Zotero-API-Key': 'test-api-key',
            'If-Unmodified-Since-Version': '1'
          }
        }
      );
    });

    it('should handle delete failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Forbidden'
      } as Response);

      await expect(item.delete())
        .rejects.toThrow('Failed to delete item TESTITEM123: Forbidden');
    });
  });

  describe('toJSON()', () => {
    it('should return copy of item data', () => {
      const json = item.toJSON();

      expect(json).toEqual(mockItemData);
      expect(json).not.toBe(mockItemData);
    });

    it('should reflect current state after modifications', () => {
      item.title = 'Modified Title';
      
      const json = item.toJSON();
      
      expect(json.title).toBe('Modified Title');
    });
  });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { ZTag } from './ZTag';
import type { ITagData } from '../interfaces/ITagData';

describe('ZTag', () => {
  describe('Constructor', () => {
    it('should create tag with name only', () => {
      const data: ITagData = { tag: 'science' };
      const tag = new ZTag(data);

      expect(tag.name).toBe('science');
      expect(tag.type).toBeUndefined();
    });

    it('should create tag with type', () => {
      const data: ITagData = { tag: 'important', type: 1 };
      const tag = new ZTag(data);

      expect(tag.name).toBe('important');
      expect(tag.type).toBe(1);
    });
  });

  describe('Getters', () => {
    it('should return correct name', () => {
      const tag = new ZTag({ tag: 'research' });
      expect(tag.name).toBe('research');
    });

    it('should return correct type', () => {
      const tag = new ZTag({ tag: 'colored', type: 1 });
      expect(tag.type).toBe(1);
    });
  });

  describe('Setters', () => {
    let tag: ZTag;

    beforeEach(() => {
      tag = new ZTag({ tag: 'science' });
    });

    it('should set name', () => {
      tag.name = 'technology';
      expect(tag.name).toBe('technology');
    });

    it('should set type', () => {
      tag.type = 1;
      expect(tag.type).toBe(1);
    });

    it('should allow undefined type', () => {
      tag.type = undefined;
      expect(tag.type).toBeUndefined();
    });

    it('should throw error for empty name', () => {
      expect(() => { tag.name = ''; })
        .toThrow('Tag name cannot be empty');
    });

    it('should throw error for whitespace name', () => {
      expect(() => { tag.name = '   '; })
        .toThrow('Tag name cannot be empty');
    });
  });

  describe('toJSON()', () => {
    it('should return tag data', () => {
      const data: ITagData = { tag: 'science', type: 1 };
      const tag = new ZTag(data);
      const json = tag.toJSON();

      expect(json).toEqual(data);
      expect(json).not.toBe(data);
    });

    it('should reflect modifications', () => {
      const tag = new ZTag({ tag: 'science' });
      tag.name = 'physics';
      tag.type = 1;

      const json = tag.toJSON();

      expect(json.tag).toBe('physics');
      expect(json.type).toBe(1);
    });
  });
});
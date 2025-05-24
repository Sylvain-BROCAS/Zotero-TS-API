import { describe, it, expect, beforeEach } from 'vitest';
import { ZCreator } from './ZCreator';
import type { ICreatorData } from '../interfaces/ICreatorData';

describe('ZCreator', () => {
  describe('Constructor', () => {
    it('should create creator with full name', () => {
      const data: ICreatorData = {
        creatorType: 'author',
        firstName: 'John',
        lastName: 'Doe'
      };

      const creator = new ZCreator(data);

      expect(creator.creatorType).toBe('author');
      expect(creator.firstName).toBe('John');
      expect(creator.lastName).toBe('Doe');
      expect(creator.name).toBeUndefined();
    });

    it('should create creator with single name', () => {
      const data: ICreatorData = {
        creatorType: 'author',
        name: 'UNESCO'
      };

      const creator = new ZCreator(data);

      expect(creator.creatorType).toBe('author');
      expect(creator.name).toBe('UNESCO');
      expect(creator.firstName).toBeUndefined();
      expect(creator.lastName).toBeUndefined();
    });
  });

  describe('Getters', () => {
    it('should return all properties correctly', () => {
      const data: ICreatorData = {
        creatorType: 'editor',
        firstName: 'Jane',
        lastName: 'Smith'
      };

      const creator = new ZCreator(data);

      expect(creator.creatorType).toBe('editor');
      expect(creator.firstName).toBe('Jane');
      expect(creator.lastName).toBe('Smith');
    });
  });

  describe('Setters', () => {
    let creator: ZCreator;

    beforeEach(() => {
      creator = new ZCreator({
        creatorType: 'author',
        firstName: 'John',
        lastName: 'Doe'
      });
    });

    it('should set creatorType', () => {
      creator.creatorType = 'editor';
      expect(creator.creatorType).toBe('editor');
    });

    it('should set firstName', () => {
      creator.firstName = 'Jane';
      expect(creator.firstName).toBe('Jane');
    });

    it('should set lastName', () => {
      creator.lastName = 'Smith';
      expect(creator.lastName).toBe('Smith');
    });

    it('should set name and clear first/last names', () => {
      creator.name = 'Organization';
      expect(creator.name).toBe('Organization');
      expect(creator.firstName).toBeUndefined();
      expect(creator.lastName).toBeUndefined();
    });

    it('should clear name when setting firstName', () => {
      creator.name = 'Organization';
      creator.firstName = 'John';
      expect(creator.firstName).toBe('John');
      expect(creator.name).toBeUndefined();
    });

    it('should clear name when setting lastName', () => {
      creator.name = 'Organization';
      creator.lastName = 'Doe';
      expect(creator.lastName).toBe('Doe');
      expect(creator.name).toBeUndefined();
    });
  });

  describe('toJSON()', () => {
    it('should return creator data for full name', () => {
      const data: ICreatorData = {
        creatorType: 'author',
        firstName: 'John',
        lastName: 'Doe'
      };

      const creator = new ZCreator(data);
      const json = creator.toJSON();

      expect(json).toEqual(data);
      expect(json).not.toBe(data);
    });

    it('should return creator data for single name', () => {
      const data: ICreatorData = {
        creatorType: 'author',
        name: 'UNESCO'
      };

      const creator = new ZCreator(data);
      const json = creator.toJSON();

      expect(json).toEqual(data);
    });
  });
});
export const mockLibraryData = {
  id: 123,
  name: 'Test Library',
  type: 'user',
  description: 'Test library description'
};

export const mockItemData = {
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
  relations: {}
};

export const mockCollectionData = {
  key: 'COLLECTION123',
  version: 1,
  name: 'Test Collection',
  parentCollection: undefined
};

export const mockZoteroAPIResponse = {
  data: mockItemData,
  key: 'TESTITEM123',
  version: 1,
  library: {
    type: 'user' as const,
    id: 123,
    name: 'Test Library',
    links: {
      alternate: {
        href: 'https://www.zotero.org/user123',
        type: 'text/html'
      }
    }
  },
  links: {
    self: {
      href: 'https://api.zotero.org/users/123/items/TESTITEM123',
      type: 'application/json'
    },
    alternate: {
      href: 'https://www.zotero.org/user123/items/TESTITEM123',
      type: 'text/html'
    }
  },
  meta: {}
};
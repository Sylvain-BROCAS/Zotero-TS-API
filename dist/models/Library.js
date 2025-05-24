"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
const ZCollection_1 = require("./ZCollection");
const Item_1 = require("./Item");
const ZOTERO_FIELDS = [
    'itemType', 'title', 'creators', 'abstractNote', 'publicationTitle', 'url', 'tags', 'date', 'pages', 'volume', 'issue',
    'publisher', 'place', 'ISBN', 'series', 'seriesTitle', 'seriesText', 'journalAbbreviation', 'language', 'DOI', 'ISSN',
    'shortTitle', 'accessDate', 'archive', 'archiveLocation', 'libraryCatalog', 'callNumber', 'rights', 'extra', 'collections'
];
class Library {
    constructor(apiKey, libId, libraryType) {
        if (!apiKey?.trim()) {
            throw new Error('API key is required');
        }
        if (!libId?.trim()) {
            throw new Error('Library ID is required');
        }
        this.apiKey = apiKey;
        this.libId = libId;
        this.libraryType = libraryType;
        this.baseUrl = `https://api.zotero.org/${libraryType}/${libId}`;
    }
    async connect() {
        try {
            const response = await fetch(this.baseUrl, {
                headers: { 'Zotero-API-Key': this.apiKey }
            });
            if (!response.ok) {
                throw new Error(`Failed to connect to Zotero API (${response.status}): ${response.statusText}`);
            }
            this.libraryData = await response.json();
        }
        catch (error) {
            throw new Error(`Connection failed - API key: ${this.apiKey}, ID: ${this.libId}, Type: ${this.libraryType}. ${error}`);
        }
    }
    get apiKeyValue() {
        return this.apiKey;
    }
    get name() {
        return this.libraryData?.name;
    }
    get id() {
        return this.libraryData?.id;
    }
    get type() {
        return this.libraryData?.type;
    }
    async getCollections() {
        const response = await this.makeRequest('/collections');
        const collectionsData = await response.json();
        return collectionsData.map(collectionData => new ZCollection_1.ZCollection(collectionData, this.apiKey, this.libId, this.libraryType));
    }
    async getAllItems() {
        const response = await this.makeRequest('/items');
        const itemsData = await response.json();
        return itemsData.map(item => new Item_1.Item(item.data, this.apiKey, this.libId, this.libraryType));
    }
    async createCollection(name, parentCollection) {
        if (!name?.trim()) {
            throw new Error('Collection name is required');
        }
        const collectionData = {
            name: name.trim(),
            parentCollection
        };
        const response = await this.makeRequest('/collections', {
            method: 'POST',
            body: JSON.stringify([collectionData])
        });
        const created = await response.json();
        return new ZCollection_1.ZCollection(created[0], this.apiKey, this.libId, this.libraryType);
    }
    async createItem(itemData) {
        if (!itemData.title?.toString().trim()) {
            throw new Error('A title is required to create a Zotero item');
        }
        const { validData, unknownFields } = this.validateItemData(itemData);
        if (unknownFields.length > 0) {
            console.warn(`[Zotero] Unknown fields ignored: ${unknownFields.join(', ')}`);
        }
        validData.itemType ?? (validData.itemType = 'webpage');
        const response = await this.makeRequest('/items', {
            method: 'POST',
            body: JSON.stringify([{ data: validData }])
        });
        const created = await response.json();
        const itemDataResponse = this.extractCreatedItemData(created);
        return new Item_1.Item(itemDataResponse, this.apiKey, this.libId, this.libraryType);
    }
    async getTags() {
        const response = await this.makeRequest('/tags');
        const tagsData = await response.json();
        return tagsData.map(tag => tag.tag);
    }
    async makeRequest(endpoint, options = {}) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Zotero-API-Key': this.apiKey,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) {
            throw new Error(`API request failed (${response.status}): ${response.statusText}`);
        }
        return response;
    }
    validateItemData(itemData) {
        const validData = {};
        const unknownFields = [];
        for (const [key, value] of Object.entries(itemData)) {
            if (ZOTERO_FIELDS.includes(key)) {
                validData[key] = value;
            }
            else {
                unknownFields.push(key);
            }
        }
        return { validData, unknownFields };
    }
    extractCreatedItemData(created) {
        if (Array.isArray(created)) {
            return created[0]?.data;
        }
        if (created && typeof created === 'object' && 'successful' in created) {
            const successful = created.successful;
            const firstKey = Object.keys(successful)[0];
            return successful[firstKey]?.data;
        }
        throw new Error('Zotero API did not return a valid created item');
    }
}
exports.Library = Library;
//# sourceMappingURL=Library.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZCollection = void 0;
const Item_1 = require("./Item");
class ZCollection {
    constructor(data, apiKey, id, type) {
        this.data = { ...data };
        this.apiKey = apiKey;
        this.id = id;
        this.type = type;
        this.baseUrl = `https://api.zotero.org/${type}/${id}`;
    }
    get key() { return this.data.key; }
    get name() { return this.data.name; }
    get parentCollection() { return this.data.parentCollection; }
    set name(value) {
        if (!value?.trim()) {
            throw new Error('Collection name cannot be empty');
        }
        this.data.name = value.trim();
    }
    set parentCollection(value) {
        this.data.parentCollection = value;
    }
    async getItems() {
        const response = await fetch(`${this.baseUrl}/collections/${this.data.key}/items`, {
            headers: { 'Zotero-API-Key': this.apiKey }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch items for collection ${this.data.key}: ${response.statusText}`);
        }
        const itemsData = await response.json();
        return itemsData.map((itemData) => new Item_1.Item(itemData, this.apiKey, this.id, this.type));
    }
    async update() {
        const response = await fetch(`${this.baseUrl}/collections/${this.data.key}`, {
            method: 'PUT',
            headers: {
                'Zotero-API-Key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.data)
        });
        if (!response.ok) {
            throw new Error(`Failed to update collection ${this.data.key}: ${response.statusText}`);
        }
    }
    async delete() {
        const response = await fetch(`${this.baseUrl}/collections/${this.data.key}`, {
            method: 'DELETE',
            headers: { 'Zotero-API-Key': this.apiKey }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete collection ${this.data.key}: ${response.statusText}`);
        }
    }
    async attachToItem(item) {
        if (!item.collections.includes(this.data.key)) {
            item.collections.push(this.data.key);
            await item.update();
        }
    }
    toJSON() {
        return { ...this.data };
    }
}
exports.ZCollection = ZCollection;
//# sourceMappingURL=ZCollection.js.map
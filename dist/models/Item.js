"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const ZCreator_1 = require("./ZCreator");
const ZTag_1 = require("./ZTag");
class Item {
    constructor(data, apiKey, id, type) {
        this.data = { ...data };
        this.apiKey = apiKey;
        this.id = id;
        this.type = type;
        this.baseUrl = `https://api.zotero.org/${type}/${id}`;
    }
    get key() { return this.data.key; }
    get title() { return this.data.title; }
    get itemType() { return this.data.itemType; }
    get url() { return this.data.url; }
    get abstractNote() { return this.data.abstractNote; }
    get date() { return this.data.date; }
    get language() { return this.data.language; }
    get collections() { return [...this.data.collections]; }
    get tags() {
        return this.data.tags.map(tag => new ZTag_1.ZTag(tag));
    }
    get creators() {
        return this.data.creators.map(creator => new ZCreator_1.ZCreator(creator));
    }
    set title(value) {
        if (!value?.trim()) {
            throw new Error('Title cannot be empty');
        }
        this.data.title = value.trim();
    }
    set itemType(value) {
        if (!value?.trim()) {
            throw new Error('Item type cannot be empty');
        }
        this.data.itemType = value.trim();
    }
    set url(value) { this.data.url = value; }
    set abstractNote(value) { this.data.abstractNote = value; }
    set date(value) { this.data.date = value; }
    set language(value) { this.data.language = value; }
    addCreator(creator) {
        this.data.creators.push(creator.toJSON());
    }
    removeCreator(index) {
        if (index >= 0 && index < this.data.creators.length) {
            this.data.creators.splice(index, 1);
        }
    }
    addTag(tag) {
        this.data.tags.push(tag.toJSON());
    }
    removeTag(index) {
        if (index >= 0 && index < this.data.tags.length) {
            this.data.tags.splice(index, 1);
        }
    }
    async update() {
        const response = await fetch(`${this.baseUrl}/items/${this.data.key}`, {
            method: 'PUT',
            headers: {
                'Zotero-API-Key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.data)
        });
        if (!response.ok) {
            throw new Error(`Failed to update item ${this.data.key}: ${response.statusText}`);
        }
    }
    async delete() {
        const response = await fetch(`${this.baseUrl}/items/${this.data.key}`, {
            method: 'DELETE',
            headers: {
                'Zotero-API-Key': this.apiKey,
                'If-Unmodified-Since-Version': this.data.version.toString()
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to delete item ${this.data.key}: ${response.statusText}`);
        }
    }
    toJSON() {
        return { ...this.data };
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map
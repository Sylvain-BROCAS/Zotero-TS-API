"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const ZCreator_1 = require("./ZCreator");
const ZTag_1 = require("./ZTag");
class Item {
    constructor(data, apiKey, id, type) {
        this.data = data;
        this.apiKey = apiKey;
        this.id = id;
        this.type = type;
        this.baseUrl = `https://api.zotero.org/${type}/${id}`;
    }
    get key() {
        return this.data.key;
    }
    get title() {
        return this.data.title;
    }
    get itemType() {
        return this.data.itemType;
    }
    get creators() {
        return this.data.creators.map(creator => new ZCreator_1.ZCreator(creator));
    }
    get tags() {
        return this.data.tags.map(tag => new ZTag_1.ZTag(tag));
    }
    set title(value) {
        this.data.title = value;
    }
    set itemType(value) {
        this.data.itemType = value;
    }
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
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/items/${this.data.key}`, {
                method: 'PUT',
                headers: {
                    'Zotero-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.data)
            });
            if (!response.ok) {
                throw new Error(`Failed to update item ${this.data.key}`);
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/items/${this.data.key}`, {
                method: 'DELETE',
                headers: {
                    'Zotero-API-Key': this.apiKey,
                    'If-Unmodified-Since-Version': this.data.version.toString()
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to delete item ${this.data.key} (${`${this.baseUrl}/items/${this.data.key}`})`);
            }
        });
    }
    toJSON() {
        return Object.assign({}, this.data);
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map
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
exports.ZCollection = void 0;
const Item_1 = require("./Item");
class ZCollection {
    constructor(data, apiKey, id, type) {
        this.data = data;
        this.apiKey = apiKey;
        this.id = id;
        this.type = type;
        this.baseUrl = `https://api.zotero.org/${type}s/${id}`;
    }
    get key() {
        return this.data.key;
    }
    get name() {
        return this.data.name;
    }
    get parentCollection() {
        return this.data.parentCollection;
    }
    set name(value) {
        this.data.name = value;
    }
    set parentCollection(value) {
        this.data.parentCollection = value;
    }
    getItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/collections/${this.data.key}/items`, {
                headers: {
                    'Zotero-API-Key': this.apiKey
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch items for collection ${this.data.key}`);
            }
            const itemsData = yield response.json();
            return itemsData.map((itemData) => new Item_1.Item(itemData, this.apiKey, this.id, this.type));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/collections/${this.data.key}`, {
                method: 'PUT',
                headers: {
                    'Zotero-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.data)
            });
            if (!response.ok) {
                throw new Error(`Failed to update collection ${this.data.key}`);
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/collections/${this.data.key}`, {
                method: 'DELETE',
                headers: {
                    'Zotero-API-Key': this.apiKey
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to delete collection ${this.data.key}`);
            }
        });
    }
    toJSON() {
        return Object.assign({}, this.data);
    }
}
exports.ZCollection = ZCollection;
//# sourceMappingURL=ZCollection.js.map
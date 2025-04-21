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
exports.Library = void 0;
const ZCollection_1 = require("./ZCollection");
const Item_1 = require("./Item");
class Library {
    constructor(apiKey, libId, libraryType) {
        this.apiKey = apiKey;
        this.libId = libId;
        this.libraryType = libraryType;
        this.baseUrl = `https://api.zotero.org/${libraryType}/${libId}`;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.baseUrl, {
                headers: {
                    'Zotero-API-Key': this.apiKey
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to connect to Zotero API -- API key : ${this.apiKey} -- ID : ${this.libId} -- Type : ${this.libraryType}`);
            }
            this.libraryData = yield response.json();
        });
    }
    get name() {
        var _a;
        return (_a = this.libraryData) === null || _a === void 0 ? void 0 : _a.name;
    }
    get id() {
        var _a;
        return (_a = this.libraryData) === null || _a === void 0 ? void 0 : _a.id;
    }
    get type() {
        var _a;
        return (_a = this.libraryData) === null || _a === void 0 ? void 0 : _a.type;
    }
    getCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/collections`, {
                headers: {
                    'Zotero-API-Key': this.apiKey
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch collections');
            }
            const collectionsData = yield response.json();
            return collectionsData.map((collectionData) => new ZCollection_1.ZCollection(collectionData, this.apiKey, this.libId, this.libraryType));
        });
    }
    getAllItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/items`, {
                headers: {
                    'Zotero-API-Key': this.apiKey
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const itemsData = yield response.json();
            return itemsData.map((item) => new Item_1.Item(item.data, this.apiKey, this.libId, this.libraryType));
        });
    }
    createCollection(name, parentCollection) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionData = {
                key: '',
                version: 0,
                name,
                parentCollection
            };
            const response = yield fetch(`${this.baseUrl}/collections`, {
                method: 'POST',
                headers: {
                    'Zotero-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(collectionData)
            });
            if (!response.ok) {
                throw new Error('Failed to create collection');
            }
            const createdCollection = yield response.json();
            return new ZCollection_1.ZCollection(createdCollection, this.apiKey, this.libId, this.libraryType);
        });
    }
    createItem(itemData) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultItemData = {
                itemType: 'book',
                title: '',
                creators: [],
                tags: [],
                collections: []
            };
            const newItemData = Object.assign(Object.assign({}, defaultItemData), itemData);
            const response = yield fetch(`${this.baseUrl}/items`, {
                method: 'POST',
                headers: {
                    'Zotero-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([{ data: newItemData }])
            });
            if (!response.ok) {
                throw new Error('Failed to create item');
            }
            const createdItems = yield response.json();
            return new Item_1.Item(createdItems[0].data, this.apiKey, this.libId, this.libraryType);
        });
    }
}
exports.Library = Library;
//# sourceMappingURL=Library.js.map
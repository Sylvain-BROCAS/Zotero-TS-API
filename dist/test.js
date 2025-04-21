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
const dotenv_1 = require("dotenv");
const Library_1 = require("./models/Library");
(0, dotenv_1.config)();
const apiKey = process.env.ZOTERO_API_KEY;
const id = process.env.ZOTERO_GROUP_ID;
const type = `groups`;
if (!apiKey || !id || !type) {
    throw new Error('ZOTERO_API_KEY, ZOTERO_ID, and ZOTERO_TYPE must be set in the .env file');
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const library = new Library_1.Library(apiKey, id, type);
    yield library.connect();
    console.log(`Connected to library: ${library.name}`);
    const collections = yield library.getCollections();
    console.log(`Found ${collections.length} collections`);
    const items = yield library.getAllItems();
    console.log(`Found ${items.length} items`);
    items.forEach(item => {
        console.log(`Item Key: ${item.key}`);
        console.log(`Title: ${item.title}`);
        console.log(`Item Type: ${item.itemType}`);
    });
}))();
//# sourceMappingURL=test.js.map
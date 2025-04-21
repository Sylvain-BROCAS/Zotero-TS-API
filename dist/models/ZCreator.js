"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZCreator = void 0;
class ZCreator {
    constructor(data) {
        this.data = data;
    }
    get creatorType() {
        return this.data.creatorType;
    }
    get firstName() {
        return this.data.firstName;
    }
    get lastName() {
        return this.data.lastName;
    }
    set creatorType(value) {
        this.data.creatorType = value;
    }
    set firstName(value) {
        this.data.firstName = value;
    }
    set lastName(value) {
        this.data.lastName = value;
    }
    toJSON() {
        return Object.assign({}, this.data);
    }
}
exports.ZCreator = ZCreator;
//# sourceMappingURL=ZCreator.js.map
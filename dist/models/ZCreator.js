"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZCreator = void 0;
class ZCreator {
    constructor(data) {
        this.data = { ...data };
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
    get name() {
        return this.data.name;
    }
    set creatorType(value) {
        this.data.creatorType = value;
    }
    set firstName(value) {
        this.data.firstName = value;
        if (value !== undefined) {
            this.data.name = undefined;
        }
    }
    set lastName(value) {
        this.data.lastName = value;
        if (value !== undefined) {
            this.data.name = undefined;
        }
    }
    set name(value) {
        this.data.name = value;
        if (value !== undefined) {
            this.data.firstName = undefined;
            this.data.lastName = undefined;
        }
    }
    toJSON() {
        return { ...this.data };
    }
}
exports.ZCreator = ZCreator;
//# sourceMappingURL=ZCreator.js.map
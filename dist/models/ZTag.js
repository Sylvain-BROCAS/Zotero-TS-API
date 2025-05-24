"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZTag = void 0;
class ZTag {
    constructor(data) {
        this.data = { ...data };
    }
    get name() {
        return this.data.tag;
    }
    get type() {
        return this.data.type;
    }
    set name(value) {
        if (!value?.trim()) {
            throw new Error('Tag name cannot be empty');
        }
        this.data.tag = value.trim();
    }
    set type(value) {
        this.data.type = value;
    }
    toJSON() {
        return { ...this.data };
    }
}
exports.ZTag = ZTag;
//# sourceMappingURL=ZTag.js.map
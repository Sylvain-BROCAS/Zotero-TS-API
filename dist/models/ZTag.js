"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZTag = void 0;
class ZTag {
    constructor(data) {
        this.data = data;
    }
    get tag() {
        return this.data.tag;
    }
    get type() {
        return this.data.type;
    }
    set tag(value) {
        this.data.tag = value;
    }
    set type(value) {
        this.data.type = value;
    }
    toJSON() {
        return Object.assign({}, this.data);
    }
}
exports.ZTag = ZTag;
//# sourceMappingURL=ZTag.js.map
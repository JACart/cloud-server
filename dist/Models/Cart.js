"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
exports.cartSchema = {
    _id: String,
    destination: { type: String, default: '' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    state: { type: String, default: 'idle' },
    userId: { type: String, default: '' },
    active: { type: Boolean, default: false },
};
//# sourceMappingURL=Cart.js.map
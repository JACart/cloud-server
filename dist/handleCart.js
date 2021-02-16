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
exports.handleCart = exports.isConnected = exports.CARTGPS = void 0;
const cartState_1 = require("./cartState");
const server_1 = require("./server");
let cart = { socket: null };
exports.CARTGPS = { latitude: 38.433905, longitude: -78.862169 };
// import { cartOutgoingEvents } from './connections'
const cartOutgoingEvents = [];
// const { cartOutgoingEvents } = require('./connections')
var isConnected = () => {
    if (cart.socket) {
        return cart.socket.connected;
    }
    else {
        return false;
    }
};
exports.isConnected = isConnected;
var handleCart = (nsp) => __awaiter(void 0, void 0, void 0, function* () {
    cartOutgoingEvents.map((x) => {
        server_1.eventManager.on(x, (data) => {
            if (cart.socket)
                cart.socket.emit(x, data);
        });
    });
    nsp.on('connection', (socket) => {
        socket.on('cart-connect', (data) => __awaiter(void 0, void 0, void 0, function* () {
            cart.socket = socket;
            yield cartState_1.connect(data);
        }));
        socket.on('summon-finish', () => {
            cartState_1.summonFinish();
        });
        socket.on('gps', (data) => {
            exports.CARTGPS.latitude = data.latitude;
            exports.CARTGPS.longitude = data.longitude;
            server_1.eventManager.emit('cart-gps', data);
        });
        socket.on('path', (data) => {
            cartState_1.CARTSTATE().path = data;
            server_1.eventManager.emit('path', data);
        });
        socket.on('cart-active', (data) => {
            data === true ? cartState_1.reconnect() : cartState_1.disconnect();
        });
        socket.on('transit-start', (data) => cartState_1.transitStart(data));
        socket.on('transit-end', () => __awaiter(void 0, void 0, void 0, function* () { return yield cartState_1.transitEnd(); }));
        socket.on('passenger-exit', () => __awaiter(void 0, void 0, void 0, function* () { return yield cartState_1.passengerExit(); }));
        socket.on('destination', (name) => __awaiter(void 0, void 0, void 0, function* () { return yield cartState_1.setDestination(name); }));
        socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cartState_1.disconnect();
        }));
    });
});
exports.handleCart = handleCart;
//# sourceMappingURL=handleCart.js.map
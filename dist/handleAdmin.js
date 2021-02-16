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
exports.handleAdmin = void 0;
const cartState_1 = require("./cartState");
const handleCart_1 = require("./handleCart");
const server_1 = require("./server");
var handleAdmin = (nsp) => __awaiter(void 0, void 0, void 0, function* () {
    server_1.eventManager.on('log', (data) => {
        nsp.emit('admin_log', data);
    });
    server_1.eventManager.on('client-gps', (data) => {
        nsp.emit('client_gps', data);
    });
    server_1.eventManager.on('cart-gps', (data) => {
        nsp.emit('cart_gps', data);
    });
    server_1.eventManager.on('path', (data) => {
        console.log(data);
        nsp.emit('path', data);
    });
    server_1.eventManager.on('cart-change', (data) => {
        nsp.emit('cart_change', data);
    });
    server_1.eventManager.on('state-change', (data) => {
        nsp.emit('state_change', data);
    });
    nsp.on('connection', (socket) => {
        socket.on('get', () => {
            socket.emit('cart_change', cartState_1.CARTSTATE().active ? 1 : 0);
            socket.emit('path', cartState_1.CARTSTATE().path ? cartState_1.CARTSTATE().path : []);
            socket.emit('cart_gps', {
                lat: handleCart_1.CARTGPS.latitude,
                lng: handleCart_1.CARTGPS.longitude,
            });
            socket.emit('state_change', cartState_1.CARTSTATE().active ? cartState_1.CARTSTATE().state : 'offline');
        });
    });
});
exports.handleAdmin = handleAdmin;
//# sourceMappingURL=handleAdmin.js.map
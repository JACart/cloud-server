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
exports.handleClient = void 0;
const cartState_1 = require("./cartState");
const connections_1 = require("./connections");
const server_1 = require("./server");
const clients = {};
let handleClient = (nsp) => __awaiter(void 0, void 0, void 0, function* () {
    connections_1.clientBroadcastEvents.map((x) => {
        server_1.eventManager.on(x, (data) => nsp.emit(x, data));
    });
    nsp.on('connection', (socket) => {
        socket.emit('success');
        socket.on('client-id', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const json = JSON.parse(data);
            clients[json.id] = {
                latitude: data.latitude,
                longitude: data.longitude,
                socket,
            };
            server_1.eventManager.emit('log', { type: 'client-connected', msg: data });
            socket.emit('cart-status', JSON.stringify({
                active: cartState_1.cartState.active,
                destination: cartState_1.cartState.destination,
                status: cartState_1.cartState.state,
                userId: cartState_1.cartState.userId,
            }));
        }));
        socket.on('summon', (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield cartState_1.summon(JSON.parse(data), socket);
            server_1.eventManager.emit('log', { type: 'summon', msg: data });
        }));
        socket.on('cancel', (id) => __awaiter(void 0, void 0, void 0, function* () {
            yield cartState_1.cancelSummon(id, socket);
            server_1.eventManager.emit('log', { type: 'summon-cancel', msg: id });
        }));
        socket.on('gps', (data) => {
            const json = JSON.parse(data);
            if (clients[json.id]) {
                clients[json.id].latitude = json.latitude;
                clients[json.id].longitude = json.longitude;
            }
            server_1.eventManager.emit('client-gps', JSON.parse(data));
        });
        socket.on('disconnect', (cartId) => {
            for (const key in clients) {
                if (clients.hasOwnProperty(key)) {
                    const element = clients[key].socket;
                    if (!element.connected) {
                        delete clients[key];
                    }
                }
            }
            server_1.eventManager.emit('log', { type: 'client-disconnected', msg: cartId });
            server_1.eventManager.emit('client-change', Object.keys(clients));
        });
    });
});
exports.handleClient = handleClient;
//# sourceMappingURL=handleClient.js.map
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
exports.setDestination = exports.passengerExit = exports.transitEnd = exports.transitStart = exports.summonFinish = exports.cancelSummon = exports.summon = exports.reconnect = exports.disconnect = exports.connect = exports.CARTSTATE = exports.cartState = exports.states = void 0;
const server_1 = require("./server");
const connections_1 = require("./connections");
var states;
(function (states) {
    states[states["IDLE"] = 0] = "IDLE";
    states[states["SUMMON"] = 1] = "SUMMON";
    states[states["SUMMON_CANCEL"] = 2] = "SUMMON_CANCEL";
    states[states["SUMMON_START"] = 3] = "SUMMON_START";
    states[states["SUMMON_FINISH"] = 4] = "SUMMON_FINISH";
    states[states["TRANSIT_END"] = 5] = "TRANSIT_END";
})(states = exports.states || (exports.states = {}));
exports.cartState = {
    _id: connections_1.CARTID,
    latitude: 0,
    longitude: 0,
    destination: '',
    active: false,
    userId: '',
    state: states.IDLE,
    path: [],
};
const CARTSTATE = () => exports.cartState;
exports.CARTSTATE = CARTSTATE;
const connect = (state) => __awaiter(void 0, void 0, void 0, function* () {
    exports.cartState = state;
    server_1.eventManager.emit('log', { type: 'cart-connect', msg: '{}' });
    server_1.eventManager.emit('cart-change', 1);
    server_1.eventManager.emit('state-change', exports.cartState.state);
    emitStateForClient();
});
exports.connect = connect;
const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.cartState.active = false;
    server_1.eventManager.emit('log', { type: 'cart-disconnect', msg: '{}' });
    server_1.eventManager.emit('cart-change', 0);
    server_1.eventManager.emit('state-change', exports.cartState.state);
    emitStateForClient();
});
exports.disconnect = disconnect;
const reconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.cartState.active = true;
    server_1.eventManager.emit('log', { type: 'cart-reconnect', msg: '{}' });
    server_1.eventManager.emit('cart-change', 1);
    server_1.eventManager.emit('state-change', exports.cartState.state);
    emitStateForClient();
});
exports.reconnect = reconnect;
const summon = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.cartState.active) {
        emitStateForClient();
    }
    else if (exports.cartState.userId !== '') {
        emitStateForClient();
    }
    else {
        exports.cartState.userId = data._id;
        exports.cartState.latitude = data.latitude;
        exports.cartState.longitude = data.longitude;
        exports.cartState.state = states.SUMMON_START;
        emitStateForClient();
        server_1.eventManager.emit('summon', {
            id: data._id,
            latitude: data.latitude,
            longitude: data.longitude,
        });
    }
    server_1.eventManager.emit('state-change', exports.cartState.state);
    server_1.eventManager.emit('log', {
        type: 'cart-state',
        msg: JSON.stringify(exports.cartState),
    });
});
exports.summon = summon;
const cancelSummon = (id, socket) => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.cartState.active) {
        emitStateForClient();
    }
    else {
        if (exports.cartState.userId === id) {
            exports.cartState.userId = '';
            exports.cartState.latitude = 0;
            exports.cartState.longitude = 0;
            exports.cartState.destination = '';
            exports.cartState.state = states.IDLE;
        }
        emitStateForClient();
        server_1.eventManager.emit('summon-cancel');
        server_1.eventManager.emit('state-change', exports.cartState.state);
    }
});
exports.cancelSummon = cancelSummon;
const summonFinish = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.cartState.state = states.SUMMON_FINISH;
    exports.cartState.destination = '';
    emitStateForClient();
    server_1.eventManager.emit('log', {
        type: 'summon-finish',
        msg: JSON.stringify(exports.cartState),
    });
    server_1.eventManager.emit('state-change', exports.cartState.state);
});
exports.summonFinish = summonFinish;
const transitStart = (data) => {
    console.log(data);
    exports.cartState = data;
    emitStateForClient();
    server_1.eventManager.emit('state-change', exports.cartState.state);
    server_1.eventManager.emit('log', {
        type: 'transit-start',
        msg: JSON.stringify(exports.cartState),
    });
};
exports.transitStart = transitStart;
const transitEnd = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.cartState.destination = '';
    exports.cartState.state = states.TRANSIT_END;
    emitStateForClient();
    server_1.eventManager.emit('log', {
        type: 'transit-end',
        msg: JSON.stringify(exports.cartState),
    });
    server_1.eventManager.emit('state-change', exports.cartState.state);
});
exports.transitEnd = transitEnd;
const passengerExit = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.cartState.userId = '';
    exports.cartState.destination = '';
    exports.cartState.state = states.IDLE;
    emitStateForClient();
    server_1.eventManager.emit('log', {
        type: 'passenger-exit',
        msg: JSON.stringify(exports.cartState),
    });
    server_1.eventManager.emit('state-change', exports.cartState.state);
    server_1.eventManager.emit('log', { type: 'passenger-exit', msg: '{}' });
});
exports.passengerExit = passengerExit;
const setDestination = (name) => __awaiter(void 0, void 0, void 0, function* () {
    exports.cartState.destination = name;
    server_1.eventManager.emit('log', { type: 'set-destination', msg: name });
});
exports.setDestination = setDestination;
function emitStateForClient() {
    server_1.eventManager.emit('cart-status', JSON.stringify({
        userId: exports.cartState.userId,
        destination: exports.cartState.destination,
        state: exports.cartState.state,
        active: exports.cartState.active,
    }));
}
//# sourceMappingURL=cartState.js.map
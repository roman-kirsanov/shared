"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShared = exports.createStorageShared = exports.createShared = void 0;
const react_1 = require("react");
const createShared = (defaultValue) => {
    let _value = defaultValue;
    let _subs = new Set();
    const get = () => _value;
    const set = (value) => {
        if (_value !== value) {
            _value = value;
            for (const listener of _subs) {
                listener(_value);
            }
        }
    };
    const on = (listener) => {
        _subs.add(listener);
        return listener;
    };
    const off = (listener) => {
        _subs.delete(listener);
    };
    const subscribe = (listener) => {
        on(listener);
        return () => {
            off(listener);
        };
    };
    return { get, set, on, off, subscribe };
};
exports.createShared = createShared;
const createStorageShared = (storage, key, defaultValue) => {
    const type = (typeof defaultValue);
    const item = `__shared_${key}_${type}`;
    const json = storage.getItem(item);
    const shared = (() => {
        if (json) {
            return (0, exports.createShared)((() => {
                var _a, _b;
                try {
                    return ((_b = (_a = JSON.parse(json)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : defaultValue);
                }
                catch (e) {
                    return defaultValue;
                }
            })());
        }
        else {
            return (0, exports.createShared)(defaultValue);
        }
    })();
    shared.on(value => storage.setItem(item, JSON.stringify({ value })));
    return shared;
};
exports.createStorageShared = createStorageShared;
const useShared = (shared) => {
    const value = (0, react_1.useSyncExternalStore)(shared.subscribe, shared.get);
    return [value, (value) => shared.set(value)];
};
exports.useShared = useShared;

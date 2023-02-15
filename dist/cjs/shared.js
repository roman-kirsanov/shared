"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShared = exports.createStorageShared = exports.createShared = void 0;
const react_1 = require("react");
const createShared = (defaultValue) => {
    let _subs = [];
    let _value = defaultValue;
    const get = () => _value;
    const set = (value) => {
        _value = value;
        _subs.forEach(listener => listener(_value));
    };
    const on = (listener) => {
        _subs.push(listener);
        return listener;
    };
    const off = (listener) => {
        _subs = _subs.filter(l => l != listener);
    };
    return { get, set, on, off };
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
    const [value, setValue] = (0, react_1.useState)(shared.get());
    (0, react_1.useEffect)(() => {
        const listener = shared.on((value) => setValue(value));
        return () => shared.off(listener);
    }, []);
    return [value, (value) => shared.set(value)];
};
exports.useShared = useShared;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShared = exports.createShared = void 0;
const react_1 = require("react");
const createShared = (defaultValue) => {
    let _listeners = [];
    let _value = defaultValue;
    const get = () => _value;
    const set = (value) => {
        _value = value;
        _listeners.forEach(listener => listener(_value));
    };
    const on = (listener) => {
        _listeners.push(listener);
        return listener;
    };
    const off = (listener) => {
        _listeners = _listeners.filter(l => l != listener);
    };
    return { get, set, on, off };
};
exports.createShared = createShared;
const useShared = (shared) => {
    const [value, setValue] = (0, react_1.useState)(shared.get());
    (0, react_1.useEffect)(() => {
        const listener = shared.on((value) => setValue(value));
        return () => shared.off(listener);
    }, []);
    return [value, (value) => shared.set(value)];
};
exports.useShared = useShared;

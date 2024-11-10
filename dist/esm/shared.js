import { useEffect, useState } from 'react';
export const createShared = (defaultValue) => {
    let _value = defaultValue;
    let _subs = [];
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
        _subs = [..._subs, listener];
        return listener;
    };
    const off = (listener) => {
        _subs = _subs.filter(l => l !== listener);
    };
    return { get, set, on, off };
};
export const createStorageShared = (storage, key, defaultValue) => {
    const type = (typeof defaultValue);
    const item = `__shared_${key}_${type}`;
    const json = storage.getItem(item);
    const shared = (() => {
        if (json) {
            return createShared((() => {
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
            return createShared(defaultValue);
        }
    })();
    shared.on(value => storage.setItem(item, JSON.stringify({ value })));
    return shared;
};
export const useShared = (shared) => {
    const [, setDummy] = useState(0);
    useEffect(() => {
        const listener = shared.on(() => setDummy(prev => prev + 1));
        return () => shared.off(listener);
    }, [shared]);
    return [
        shared.get(),
        (value) => shared.set(value)
    ];
};

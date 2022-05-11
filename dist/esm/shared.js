import { useEffect, useState } from 'react';
export const createShared = (defaultValue) => {
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
export const useShared = (shared) => {
    const [value, setValue] = useState(shared.get());
    useEffect(() => {
        const listener = shared.on((value) => setValue(value));
        return () => shared.off(listener);
    }, []);
    return [value, (value) => shared.set(value)];
};

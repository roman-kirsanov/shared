import { useEffect, useState } from 'react'

export type SharedListener<T> = (value: T) => void;

export type Shared<T> = {
    get: () => T;
    set: (value: T) => void;
    on: (listener: SharedListener<T>) => SharedListener<T>;
    off: (listener: SharedListener<T>) => void;
}

export const createShared = <T>(defaultValue: T): Shared<T> => {
    let _subs: SharedListener<T>[] = [];
    let _value: T = defaultValue;
    const get = () => _value;
    const set = (value: T) => {
        _value = value;
        _subs.forEach(listener => listener(_value));
    }
    const on = (listener: SharedListener<T>) => {
        _subs.push(listener);
        return listener;
    }
    const off = (listener: SharedListener<T>) => {
        _subs = _subs.filter(l => l != listener);
    }
    return { get, set, on, off }
}

export const createStorageShared = <T>(storage: Storage, key: string, defaultValue: T): Shared<T> => {
    const type = (typeof defaultValue);
    const item = `__shared_${key}_${type}`;
    const json = storage.getItem(item);
    const shared = (() => {
        if (json) {
            return createShared<T>((() => {
                try { return (JSON.parse(json)?.value ?? defaultValue); }
                catch (e) { return defaultValue; }
            })());
        } else {
            return createShared<T>(defaultValue);
        }
    })()
    shared.on(value => storage.setItem(item, JSON.stringify({ value })));
    return shared;
}

export type SharedHook<T> = [ T, (value: T) => void ];

export const useShared = <T>(shared: Shared<T>): SharedHook<T> => {
    const [ value, setValue ] = useState<T>(shared.get());
    useEffect(() => {
        const listener = shared.on((value: T) => setValue(value));
        return () => shared.off(listener);
    }, [shared]);
    return [ value, (value: T) => shared.set(value) ];
}
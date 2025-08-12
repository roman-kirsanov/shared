import { useSyncExternalStore } from 'react'

export type SharedListener<T> = (value: T) => void;

export type Shared<T> = {
    get: () => T;
    set: (value: T) => void;
    on: (listener: SharedListener<T>) => SharedListener<T>;
    off: (listener: SharedListener<T>) => void;
    subscribe: (listener: SharedListener<T>) => () => void;
}

export const createShared = <T>(defaultValue: T): Shared<T> => {
    let _value: T = defaultValue;
    let _subs: Set<SharedListener<T>> = new Set<SharedListener<T>>();
    const get = () => _value;
    const set = (value: T) => {
        if (_value !== value) {
            _value = value;
            for (const listener of _subs) {
                listener(_value);
            }
        }
    }
    const on = (listener: SharedListener<T>) => {
        _subs.add(listener);
        return listener;
    }
    const off = (listener: SharedListener<T>) => {
        _subs.delete(listener);
    }
    const subscribe = (listener: SharedListener<T>) => {
        on(listener);

        return () => {
            off(listener);
        }
    }
    return { get, set, on, off, subscribe }
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

export type SharedHook<T> = [T, (value: T) => void ];

export const useShared = <T>(shared: Shared<T>): SharedHook<T> => {
    const value = useSyncExternalStore(shared.subscribe, shared.get);

    return [ value, (value: T) => shared.set(value) ];
}

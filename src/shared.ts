import { useEffect, useState } from 'react'

export type SharedListener<T> = (value: T) => void;

export type Shared<T> = {
    get: () => T;
    set: (value: T) => void;
    on: (listener: SharedListener<T>) => SharedListener<T>;
    off: (listener: SharedListener<T>) => void;
}

export const createShared = <T>(defaultValue: T): Shared<T> => {
    let _listeners: SharedListener<T>[] = [];
    let _value: T = defaultValue;
    const get = () => _value;
    const set = (value: T) => {
        _value = value;
        _listeners.forEach(listener => listener(_value));
    }
    const on = (listener: SharedListener<T>) => {
        _listeners.push(listener);
        return listener;
    }
    const off = (listener: SharedListener<T>) => {
        _listeners = _listeners.filter(l => l != listener);
    }
    return { get, set, on, off }
}

export type SharedHook<T> = [ T, (value: T) => void ];

export const useShared = <T>(shared: Shared<T>): SharedHook<T> => {
    const [ value, setValue ] = useState<T>(shared.get());
    useEffect(() => {
        const listener = shared.on((value: T) => setValue(value));
        return () => shared.off(listener);
    }, []);
    return [ value, (value: T) => shared.set(value) ];
}
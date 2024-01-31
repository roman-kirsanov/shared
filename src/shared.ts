import { useEffect, useState } from 'react'

export type SharedListener<T> = (value: T) => void;

export type Shared<T> = {
    get: () => T;
    set: (value: T) => void;
    on: (listener: SharedListener<T>) => SharedListener<T>;
    off: (listener: SharedListener<T>) => void;
}

export const createShared = <T>(default_: T): Shared<T> => {
    let _value: T = default_;
    let _subs: SharedListener<T>[] = [];
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
        _subs = [ ..._subs, listener ];
        return listener;
    }
    const off = (listener: SharedListener<T>) => {
        _subs = _subs.filter(l => l !== listener);
    }
    return { get, set, on, off }
}

export type SharedHook<T> = [T, (value: T) => void ];

export const useShared = <T>(shared: Shared<T>): SharedHook<T> => {
    const [ , setDummy ] = useState<number>(0);
    useEffect(() => {
        const listener = shared.on(() => setDummy(prev => prev + 1));
        return () => shared.off(listener);
    }, [shared]);
    return [
        shared.get(),
        (value: T) => shared.set(value)
    ];
}

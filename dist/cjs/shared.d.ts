export type SharedListener<T> = (value: T) => void;
export type Shared<T> = {
    get: () => T;
    set: (value: T) => void;
    on: (listener: SharedListener<T>) => SharedListener<T>;
    off: (listener: SharedListener<T>) => void;
    subscribe: (listener: SharedListener<T>) => () => void;
};
export declare const createShared: <T>(defaultValue: T) => Shared<T>;
export declare const createStorageShared: <T>(storage: Storage, key: string, defaultValue: T) => Shared<T>;
export type SharedHook<T> = [T, (value: T) => void];
export declare const useShared: <T>(shared: Shared<T>) => SharedHook<T>;

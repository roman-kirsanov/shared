export declare type SharedListener<T> = (value: T) => void;
export declare type Shared<T> = {
    get: () => T;
    set: (value: T) => void;
    on: (listener: SharedListener<T>) => SharedListener<T>;
    off: (listener: SharedListener<T>) => void;
};
export declare const createShared: <T>(defaultValue: T) => Shared<T>;
export declare const createStorageShared: <T>(storage: Storage, key: string, defaultValue: T) => Shared<T>;
export declare type SharedHook<T> = [T, (value: T) => void];
export declare const useShared: <T>(shared: Shared<T>) => SharedHook<T>;

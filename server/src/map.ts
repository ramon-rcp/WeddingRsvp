// TODO (Q5): 
//  a) Copy over your mutable map interface from HW7
//  b) Add a function that gets all the keys from the map
//  c) Create a class that implements the interface with a TS Map as its field
//  d) Implement a factory function that creates a new instance of the class

/**
 * Interface to a mutable map
 */
export interface MutableMap<T> {
    /**
     * Determines if the given key is within a pair in the given list
     * @param x key to determine if list contains
     * @returns contains-key(x, obj)
     */
    contains: (x: string) => boolean;

    /**
     * Gets the value paired with the first instance of the given key 
     * in the given list
     * @param x key to find the corresponding value for
     * @returns get-value(x, obj)
     * @throws Error when !contains-key(x, obj)
     */
    get: (x: string) => T;

    /**
     * Sets a value for a given key in the map. 
     * @param x : key to associate the value to
     * @param y : value
     * @returns : contains-key(x, obj_0)
     * @modifies obj
     * @effects If contains-key(x, obj_0), the value in the pair is replaced. 
     *          Otherwise, a new key-value pair is added. 
     */
    set: (x:string, y: T) => boolean;

    /**
     * Clears the map 
     * @modifies obj
     * @effects obj is now empty
     */
    clear: () => void;

    /**
     * Get a list of the keys
     * @returns get-keys(obj)
     */
    getKeys: () => Array<string>;

    /**
     * Get list of values
     * @returns all the values from obj in an array
     */
    getAllValues: () => Array<T>;
}

class MutableMapImpl<T> implements MutableMap<T> {
    //AF: obj = this.map
    map: Map<string, T>;

    constructor(){
        this.map = new Map;
    }

    contains = (x: string): boolean =>{
        return this.map.has(x)
    };

    get = (x: string): T => {
        const value: T | undefined = this.map.get(x);
        if(value === undefined){
            throw new Error(`Key ${x} doesn't exist`)
        }
        return value
    }

    set = (x: string, y: T): boolean => {
        const res: boolean = this.contains(x)
        this.map = this.map.set(x, y)
        return res
    };

    clear = (): void => {
        this.map = new Map;
    };

    getKeys = (): string[] => {
        return Array.from(this.map.keys())
    };

    getAllValues = (): T[] => {
        return Array.from(this.map.values());
    };
}

/**
 * Factory function
 * @returns an empty mutable map
 */
export const makeMap = <A>(): MutableMap<A> => {
    return new MutableMapImpl<A>
}
  
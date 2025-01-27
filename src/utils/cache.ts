export class Cache<K extends unknown[], V> {
    private map = new Map<string, V>();
    /**
     * Store previous fetched data
     */
    public data: V[] = [];

    get(...key: K): V | undefined {
        return this.map.get(JSON.stringify(key));
    }

    has(...key: K): boolean {
        return this.map.has(JSON.stringify(key));
    }

    set(key: K, value: V): void {
        this.map.set(JSON.stringify(key), value);
    }
}

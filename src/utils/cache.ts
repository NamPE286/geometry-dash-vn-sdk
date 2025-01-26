export class Cache<K extends unknown[], V> {
    private map = new Map<string, V>();
    public data: V[] = [];

    get(...key: K): V | undefined {
        return this.map.get(JSON.stringify(key));
    }

    set(key: K, value: V): void {
        this.map.set(JSON.stringify(key), value);
    }
}

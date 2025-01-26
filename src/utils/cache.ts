export class Cache<K extends unknown[], V> {
    private map = new Map<string, V>();
    private data: V[] = [];

    get(...key: K): V | undefined {
        return this.map.get(JSON.stringify(key));
    }

    set(key: K, value: V): void {
        this.map.set(JSON.stringify(key), value);
    }

    all(): V[] {
        return this.data;
    }
}

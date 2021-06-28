const objectHash = require('object-hash');

class LRU {
  constructor(max = 10) {
    this.max = max;
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (item) {
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key, val) {
    // refresh key
    if (this.cache.has(key)) this.cache.delete(key);
    // evict oldest
    else if (this.cache.size === this.max) this.cache.delete(this.first());
    this.cache.set(key, val);
  }

  first() {
    return this.cache.keys().next().value;
  }

  setFromParams(params, val) {
    this.set(objectHash(params), val);
  }

  getFromParams(params) {
    return this.get(objectHash(params));
  }
}

export default LRU;

export class TtlCache {
  constructor({ now = Date.now } = {}) {
    this.now = now;
    this.entries = new Map();
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry) return null;

    return {
      value: entry.value,
      storedAt: entry.storedAt,
      isFresh: this.now() - entry.storedAt < entry.ttlMs,
    };
  }

  set(key, value, ttlMs) {
    this.entries.set(key, {
      value,
      ttlMs,
      storedAt: this.now(),
    });
  }
}

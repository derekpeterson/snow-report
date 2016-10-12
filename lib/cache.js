module.exports = createCache

function createCache () {
  return new Cache()
}

function Cache () {
  this.cache = new Map()

  return this
}

Cache.prototype.put = function put (key, value, ttl) {
  const staleAt = new Date(ttl)
  const diff = staleAt - Date.now()

  if (diff > 0) {
    const timeout = setTimeout(() => {
      this.cache.delete(key)
    }, diff)

    this.cache.set(key, {
      item: value,
      timeout: timeout
    })
  }
}

Cache.prototype.get = function get (key) {
  const value = this.cache.get(key)
  return value ? value.item : null
}

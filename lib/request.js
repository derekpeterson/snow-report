'use strict'

const request = require('request')
const cache = require('./cache')()

const api = request.defaults({
  baseUrl: process.env.NOAA_API_BASE,
  json: true,
  headers: {
    token: process.env.NOAA_TOKEN
  },
  useQuerystring: true
})

module.exports = {
  snow: function getSnowData (log, id, cb) {
    log.info('request started for snow data', { id: id })

    const cachedResults = cache.get(id)

    if (cachedResults) {
      log.info('served response from cache', {
        id: id,
        retrieved: cachedResults.retrieved
      })
      return cb(cachedResults)
    }

    const now = new Date()
    const then = new Date(now)
    then.setDate(now.getDate() - 7)

    api({
      url: '/data',
      qs: {
        stationid: id,
        datasetid: 'GHCND',
        datatypeid: ['PRCP', 'SNOW', 'SNWD'],
        startdate: then.toJSON(),
        enddate: now.toJSON(),
        units: 'standard'
      }
    }, function getCallback (err, data) {
      if (err) {
        log.error('request failed', { error: err })
        throw err
      }

      log.info('request succeeded', { id: id })

      const results = Object.assign({}, data.body, {
        retrieved: now,
        units: 'inches'
      })
      // Cache aggressively because these summaries are created once daily
      const ttl = new Date()
      ttl.setHours(ttl.getHours() + 8)
      cache.put(id, results, ttl)

      cb(results)
    })
  }
}

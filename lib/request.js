'use strict'

const request = require('request')

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

    const now = new Date()
    const then = new Date(now)
    then.setDate(then.getDate() - 7)

    api({
      url: '/data',
      qs: {
        stationid: id,
        datasetid: 'GHCND',
        datatypeid: ['PRCP', 'SNOW', 'SNWD'],
        startdate: then.toJSON(),
        enddate: now.toJSON()
      }
    }, function getCallback (err, data) {
      if (err) {
        log.error('request failed', { error: err })
        throw err
      }

      log.info('request succeeded', { id: id })

      cb(Object.assign({}, data.body, {
        retrieved: now,
        units: 'inches'
      }))
    })
  }
}

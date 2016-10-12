'use strict'

const express = require('express')

const constants = require('../constants')
const errors = require('../errors')
const munger = require('../mungers/snow')

const stations = constants.stations

module.exports = snowRouter

function snowRouter (request) {
  const router = express.Router({
    caseSensitive: false,
    mergeParams: true,
    strict: false
  })

  router.get('/', function snowIndex (req, res) {
    const snowStations = [...stations.entries()].map((entry) => {
      const [ id, station ] = entry
      return {
        href: `/snow/${id}`,
        name: id,
        title: station.title
      }
    })

    res.json({
      _links: {
        self: {
          href: '/snow',
          name: 'snow',
          title: 'Snow station list'
        },
        snowStation: snowStations
      },
      name: 'Snow station list'
    })
  })

  router.get('/:id', function snowStation (req, res, next) {
    const id = req.params.id

    if (!id) {
      return next(new errors.BadRequest('no station ID'))
    }

    req.log.verbose('looking for snow station', {
      id: id
    })

    const station = stations.get(id)

    if (!station) {
      return next(new errors.NotFound('no station matching station ID'))
    }

    req.log.verbose('making request for snow data', {
      type: 'snow',
      id: id,
      station: station.id
    })

    request.snow(req.log, station.id, data => {
      res.json(Object.assign({}, munger(data.results || []), {
        _links: {
          self: {
            href: `/snow/${id}`,
            name: id,
            title: station.title
          }
        },
        title: station.title,
        retrieved: data.retrieved
      }))
    })
  })

  return router
}

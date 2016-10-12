'use strict'

const express = require('express')
const uuid = require('uuid')

const routes = require('./routes')

module.exports = createServer

function createServer (log, request) {
  const app = express()

  app.set('x-powered-by', false)

  app.use(function requestStart (req, res, next) {
    req.log = log(uuid.v1())
    req.log.info('starting request', {
      path: req.path
    })
    next()
  })

  app.get('/', function rootRoute (req, res, next) {
    res.json({
      _links: {
        self: {
          href: '/'
        },
        snowStations: {
          href: '/snow',
          title: 'Snow station list'
        },
        snowStation: {
          href: '/snow{/id}',
          templated: true,
          title: 'Snow station by name'
        }
      },
      name: 'Snow Report API'
    })
  })

  for (let route of routes) {
    app.use(route.path, route.router(request))
  }

  app.use(function errorHandler (err, req, res, next) {
    if (err.statusCode) {
      req.log.warn(err.message, {
        params: req.params
      })

      res.status(err.statusCode).json({
        error: err.message
      })
    } else {
      req.log.error('error handling request', {
        error: err
      })

      res.status(500).json({
        error: 'error handling request'
      })
    }

    next()
  })

  app.use(function requestEnd (req, res, next) {
    req.log.info('ending request', {
      path: req.path
    })
    next()
  })

  return function startServer (logger, port) {
    logger.info('server starting', { port: port })

    const server = app.listen(port, function serverListen () {
      const port = server.address().port
      logger.info('server listening', { port: port })
    })
  }
}

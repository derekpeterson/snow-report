'use strict'

const winston = require('winston')

module.exports = init

function init (options) {
  const transports = [
    new winston.transports.File({
      filename: options.filename,
      json: true
    }),
    options.useConsole ? new winston.transports.Console({
      json: false,
      level: 'silly'
    }) : null
  ].filter(function (transport) {
    return transport
  })
  const logger = new winston.Logger({
    transports: transports
  })

  return (id) => {
    return [
      'error',
      'warn',
      'info',
      'verbose',
      'debug',
      'silly'
    ].reduce((obj, level) => {
      obj[level] = log(id, logger[level])
      return obj
    }, {})
  }
}

function log (id, logLevel) {
  return (message, event) => {
    logLevel(message, {
      event: event || {},
      _transactionId: id
    })
  }
}

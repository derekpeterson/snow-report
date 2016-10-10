require('dotenv').config({
  silent: true
})

const log = require('./lib/log')({
  filename: process.env.LOG_FILE || '/dev/null',
  useConsole: process.env.NODE_ENV === 'development'
})
const request = require('./lib/request')
const server = require('./lib/server')(log, request)

server.start('server', process.env.PORT)

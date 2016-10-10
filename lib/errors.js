function NotFoundError (msg) {
  const error = Error.call(this, msg)
  this.name = 'NotFound'
  this.statusCode = 404
  this.message = error.message
  this.stack = error.stack

  return this
}

function BadRequestError (msg) {
  const error = Error.call(this, msg)
  this.name = 'BadRequest'
  this.statusCode = 400
  this.message = error.message
  this.stack = error.stack

  return this
}

function buildErrorType (type) {
  type.prototype = Object.create(Error.prototype)
  type.prototype.constructor = type

  return type
}

module.exports = {
  BadRequest: buildErrorType(BadRequestError),
  NotFound: buildErrorType(NotFoundError)
}

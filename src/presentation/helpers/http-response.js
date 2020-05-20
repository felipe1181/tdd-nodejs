const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
module.exports = class httpResponse {
  static badRequest (paramName) {
    return { statusCode: 400, body: new MissingParamError(paramName) }
  }

  static serverError () {
    return { statusCode: 500 }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static unauthorizedError () {
    return { statusCode: 401, body: new UnauthorizedError() }
  }
}

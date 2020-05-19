const httpResponse = require('../helpers/http-response')
module.exports = class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) return httpResponse.serverError()

    const { email, senha } = httpRequest.body
    if (!email) return httpResponse.badRequest('email')
    if (!senha) return httpResponse.badRequest('senha')
  }
}

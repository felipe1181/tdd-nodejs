const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) return httpResponse.serverError()

    const { email, senha } = httpRequest.body
    if (!email) return httpResponse.badRequest('email')
    if (!senha) return httpResponse.badRequest('senha')

    this.authUseCase.auth(email, senha)
    return httpResponse.unauthorizedError()
  }
}

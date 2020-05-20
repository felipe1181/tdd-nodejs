const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    try {
      const { email, senha } = httpRequest.body
      if (!email) return httpResponse.badRequest('email')
      if (!senha) return httpResponse.badRequest('senha')

      const tokenDeAcesso = this.authUseCase.auth(email, senha)
      if (!tokenDeAcesso) return httpResponse.unauthorizedError()
      return httpResponse.ok({ tokenDeAcesso })
    } catch (err) {
      // console.error(err)
      return httpResponse.serverError()
    }
  }
}

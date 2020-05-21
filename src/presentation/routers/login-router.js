const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, senha } = httpRequest.body
      if (!email) return httpResponse.badRequest('email')
      if (!senha) return httpResponse.badRequest('senha')

      const tokenDeAcesso = await this.authUseCase.auth(email, senha)
      if (!tokenDeAcesso) return httpResponse.unauthorizedError()
      return httpResponse.ok({ tokenDeAcesso })
    } catch (err) {
      // console.error(err)
      return httpResponse.serverError()
    }
  }
}

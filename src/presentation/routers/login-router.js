const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, senha } = httpRequest.body
      if (!email) return httpResponse.badRequestMissing('email')
      if (!this.emailValidator.isValid(email)) return httpResponse.badRequestInvalid('email')
      if (!senha) return httpResponse.badRequestMissing('senha')

      const tokenDeAcesso = await this.authUseCase.auth(email, senha)
      if (!tokenDeAcesso) return httpResponse.unauthorizedError()
      return httpResponse.ok({ tokenDeAcesso })
    } catch (err) {
      // console.error(err)
      return httpResponse.serverError()
    }
  }
}

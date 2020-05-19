class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) return httpResponse.serverError()

    const { email, senha } = httpRequest.body
    if (!email) return httpResponse.badRequest('email')
    if (!senha) return httpResponse.badRequest('senha')
  }
}
class httpResponse {
  static badRequest (paramName) {
    return { statusCode: 400, body: new MissingParamError(paramName) }
  }

  static serverError () {
    return { statusCode: 500 }
  }
}

class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
describe('Login router', () => {
  test('retornar erro 400 se email não existir', () => {
    const sut = new LoginRouter() // System under test
    const httpRequest = {
      body: {
        senha: 'minha_senha'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('retornar erro 400 se senha não existir ', () => {
    const sut = new LoginRouter() // System under test
    const httpRequest = {
      body: {
        email: 'meu_email@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('senha'))
  })

  test('retornar erro 500 se não haver httprequest', () => {
    const sut = new LoginRouter() // System under test
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('retornar erro 500 se body não existir', () => {
    const sut = new LoginRouter() // System under test
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})

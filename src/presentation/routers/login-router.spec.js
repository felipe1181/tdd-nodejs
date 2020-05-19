const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')

function makeFactorySut () {
  class AuthUseCaseSpy {
    auth (email, senha) {
      this.email = email
      this.senha = senha
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)
  return { authUseCaseSpy, sut }
}

describe('Login router', () => {
  test('vememos retornar erro 400 se email não existir', () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {
      body: {
        senha: 'minha_senha'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('devemos retornar erro 400 se senha não existir ', () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {
      body: {
        email: 'meu_email@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('senha'))
  })

  test('devemos retornar erro 500 se não haver httprequest', () => {
    const { sut } = makeFactorySut() // System under test
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('devemos retornar erro 500 se body não existir', () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('devemos chamar authUseCase com os parametros corretos', () => {
    const { sut, authUseCaseSpy } = makeFactorySut() // System under test
    const httpRequest = {
      body: {
        email: 'meu_email@email.com',
        senha: 'minha_senha'
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.senha).toBe(httpRequest.body.senha)
  })
  test('devemos retornar 401 caso tenha credenciais inválidas', () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {
      body: {
        email: 'email_invalido@email.com',
        senha: 'senha_invalida'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
})

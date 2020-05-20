const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const ServerError = require('../helpers/server-error')

function makeFactorySut () {
  const authUseCaseSpy = makeFactoryAuthUseCase()
  authUseCaseSpy.tokenDeAcesso = 'token_valido'
  const sut = new LoginRouter(authUseCaseSpy)
  return { authUseCaseSpy, sut }
}
function makeFactoryAuthUseCase () {
  class AuthUseCaseSpy {
    auth (email, senha) {
      this.email = email
      this.senha = senha
      return this.tokenDeAcesso
    }
  }
  return new AuthUseCaseSpy()
}

function makeFactoryAuthUseCaseError () {
  class AuthUseCaseSpy {
    auth (email, senha) {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
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

  test('deve retornar erro 400 se senha não existir ', () => {
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

  test('deve retornar erro 500 se não haver httprequest', () => {
    const { sut } = makeFactorySut() // System under test
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar erro 500 se body não existir', () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve chamar authUseCase com os parametros corretos', () => {
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
  test('deve retornar 401 caso tenha credenciais inválidas', () => {
    const { sut, authUseCaseSpy } = makeFactorySut() // System under test
    authUseCaseSpy.tokenDeAcesso = null

    const httpRequest = {
      body: {
        email: 'email_invalido@email.com',
        senha: 'senha_invalida'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('deve retornar 200 caso as credenciais estejam corretas', () => {
    const { sut, authUseCaseSpy } = makeFactorySut() // System under test

    const httpRequest = {
      body: {
        email: 'email_valido@email.com',
        senha: 'senha_valida'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.tokenDeAcesso).toEqual(authUseCaseSpy.tokenDeAcesso)
  })

  test('deve retornar 500 caso authUseCase não existir', () => {
    const sut = new LoginRouter({}) // spy authUseCase vazio
    const httpRequest = {
      body: {
        email: 'meu_email@email.com',
        senha: 'minha_senha'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar 500 caso authUseCase disparar uma throw', () => {
    const authUseCaseSpyError = makeFactoryAuthUseCaseError()
    const sut = new LoginRouter(authUseCaseSpyError) // spy authUseCase irá disparar uma throw
    const httpRequest = {
      body: {
        email: 'meu_email@email.com',
        senha: 'minha_senha'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})

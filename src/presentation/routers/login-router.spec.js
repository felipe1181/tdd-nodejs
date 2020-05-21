const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const InvalidParamError = require('../helpers/invalid-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const ServerError = require('../helpers/server-error')

function makeFactorySut () {
  const authUseCaseSpy = makeFactoryAuthUseCase()
  const emailValidatorSpy = makeFactoryEmailValidatorSpy()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}
function makeFactoryAuthUseCase () {
  class AuthUseCaseSpy {
    async auth (email, senha) {
      this.email = email
      this.senha = senha
      return this.tokenDeAcesso
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.tokenDeAcesso = 'token_valido'
  return authUseCaseSpy
}

function makeFactoryAuthUseCaseError () {
  class AuthUseCaseSpy {
    async auth (email, senha) {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

function makeFactoryEmailValidatorSpy () {
  class EmailValidatorSpy {
    isValid (email) {
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

describe('Login router', () => {
  test('deve retornar erro 400 se email não existir', async () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {
      body: {
        senha: 'minha_senha'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('deve retornar erro 400 se senha não existir', async () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {
      body: {
        email: 'meu_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('senha'))
  })
  test('deve retornar erro 500 se não haver httprequest', async () => {
    const { sut } = makeFactorySut() // System under test
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('deve retornar erro 500 se body não existir', async () => {
    const { sut } = makeFactorySut() // System under test
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('deve chamar authUseCase com os parametros corretos', async () => {
    const { sut, authUseCaseSpy } = makeFactorySut() // System under test
    const httpRequest = {
      body: {
        email: 'meu_email@email.com',
        senha: 'minha_senha'
      }
    }
    await sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.senha).toBe(httpRequest.body.senha)
  })
  test('deve retornar 401 caso tenha credenciais inválidas', async () => {
    const { sut, authUseCaseSpy } = makeFactorySut() // System under test
    authUseCaseSpy.tokenDeAcesso = null

    const httpRequest = {
      body: {
        email: 'email_invalido@email.com',
        senha: 'senha_invalida'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
  test('deve retornar 200 caso as credenciais estejam corretas', async () => {
    const { sut, authUseCaseSpy } = makeFactorySut() // System under test

    const httpRequest = {
      body: {
        email: 'email_valido@email.com',
        senha: 'senha_valida'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.tokenDeAcesso).toEqual(authUseCaseSpy.tokenDeAcesso)
  })
  test('deve retornar 500 caso authUseCase não existir', async () => {
    const sut = new LoginRouter({}) // spy authUseCase vazio
    const httpRequest = {
      body: {
        email: 'meu_email@email.com',
        senha: 'minha_senha'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('deve retornar 500 caso authUseCase disparar uma throw', async () => {
    const authUseCaseSpyError = makeFactoryAuthUseCaseError()
    const sut = new LoginRouter(authUseCaseSpyError) // spy authUseCase irá disparar uma throw
    const httpRequest = {
      body: {
        email: 'meu_email@email.com',
        senha: 'minha_senha'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
  test('deve retornar erro 400 se email não for válido', async () => {
    const { sut, emailValidatorSpy } = makeFactorySut() // System under test
    emailValidatorSpy.isEmailValid = false

    const httpRequest = {
      body: {
        email: 'email_invalido',
        senha: 'minha_senha'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})

class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.email) return { statusCode: 400 }
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
  })
})

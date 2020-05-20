module.exports = class ServerError extends Error {
  constructor () {
    super('Aconteceu um problema no servidor')
    this.name = 'ServerError'
  }
}

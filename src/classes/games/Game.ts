export default class Game {
  id: number

  static id = 0

  constructor () {
    this.id = ++Game.id
  }
}

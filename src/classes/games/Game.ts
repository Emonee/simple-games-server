import User from "../User"

export default class Game {
  id: number
  players: Array<User>

  static id = 0

  constructor () {
    this.id = ++Game.id
    this.players = []
  }

  joinGame (player: User) {
    if (this.players.includes(player)) return
    this.players.push(player)
  }
  leaveGame (player: User) {
    if (!this.players.includes(player)) return
    const playersSet = new Set(this.players)
    playersSet.delete(player)
    this.players = [...playersSet]
  }
}

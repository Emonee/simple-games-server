import User from "../../../User";
import RPSResult from "./RPSResult";

export enum Plays {
  None,
  Rock,
  Paper,
  Sissors
}

export default class RPS {
  readonly id: number
  readonly name: string
  players: Array<User>
  firstPlayerPlay: Plays
  secondPlayerPlay: Plays
  firstPlayerVictories: number
  secondPlayerVictories: number
  results: Array<RPSResult>

  static id = 0
  static description = 'The classic Rock, Paper & Scissor game.'
  static imgURL = 'https://media.istockphoto.com/id/1056840214/vector/rock-paper-scissors-vector-illustration.jpg?s=612x612&w=0&k=20&c=6KEBfon5f9BXXhLiu9JfOk6EHsM193SiWMcqDjN1jqM='

  constructor () {
    this.id = ++RPS.id
    this.name = RPS.name
    this.players = []
    this.firstPlayerPlay = Plays.None
    this.secondPlayerPlay = Plays.None
    this.firstPlayerVictories = 0
    this.secondPlayerVictories = 0
    this.results = []
  }

  joinGame(player: User) {
    const playersIsFull = this.players.length > 2
    const playerAlreadyInGame = this.players.includes(player)
    if (playersIsFull || playerAlreadyInGame) return
    this.players.push(player)
  }
  leaveGame (player: User) {
    if (!this.players.includes(player)) return
    const playersSet = new Set(this.players)
    playersSet.delete(player)
    this.players = [...playersSet]
  }
  setMove (move: Plays, user: User) {
    const playerIndex = this.players.indexOf(user)
    if (playerIndex < 0 || playerIndex > 1) return
    if (playerIndex === 0 && !this.firstPlayerPlay) this.firstPlayerPlay = move
    if (playerIndex === 1 && !this.secondPlayerPlay) this.secondPlayerPlay = move
    this.handleGameResult()
  }
  resetGame () {
    this.firstPlayerPlay = Plays.None
    this.secondPlayerPlay = Plays.None
    this.firstPlayerVictories = 0
    this.secondPlayerVictories = 0
  }
  firstPlayerWin () {
    this.results.push(new RPSResult(false, this.players[0]))
    this.firstPlayerVictories++
  }
  secondPlayerWin () {
    this.results.push(new RPSResult(false, this.players[1]))
    this.secondPlayerVictories++
  }
  isTie () {
    this.results.push(new RPSResult(true))
    this.firstPlayerPlay = Plays.None
    this.secondPlayerPlay = Plays.None
  }
  handleGameResult () {
    if (
      this.firstPlayerPlay === Plays.None ||
      this.secondPlayerPlay === Plays.None
    ) return
    if (this.firstPlayerPlay === this.secondPlayerPlay) return this.isTie()
    const firstPlayerWin = (
      this.firstPlayerPlay === Plays.Rock && this.secondPlayerPlay === Plays.Sissors ||
      this.firstPlayerPlay === Plays.Paper && this.secondPlayerPlay === Plays.Rock ||
      this.firstPlayerPlay === Plays.Sissors && this.secondPlayerPlay === Plays.Paper
    )
    firstPlayerWin
      ? this.firstPlayerWin()
      : this.secondPlayerWin()
    this.firstPlayerPlay = Plays.None
    this.secondPlayerPlay = Plays.None
  }
}

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
  firstPlayerSeat?: User
  secondPlayerSeat?: User
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
    this.firstPlayerPlay = Plays.None
    this.secondPlayerPlay = Plays.None
    this.firstPlayerVictories = 0
    this.secondPlayerVictories = 0
    this.results = []
  }

  joinGame(player: User) {
    if (!this.firstPlayerSeat) return this.firstPlayerSeat = player
    if (!this.secondPlayerSeat) return this.secondPlayerSeat = player
  }
  leaveGame (player: User) {
    if (this.firstPlayerSeat === player) delete this.firstPlayerSeat
    if (this.secondPlayerSeat === player) delete this.secondPlayerSeat
  }
  joinGameSeat (player: User, seat: 1 | 2) {
    if (seat === 1) this.firstPlayerSeat ??= player
    if (seat === 2) this.secondPlayerSeat ??= player
  }
  setMove (move: Plays, user: User) {
    const userIsValid = this.firstPlayerSeat === user || this.secondPlayerSeat === user
    if (!userIsValid) return
    this.firstPlayerSeat === user
      ? this.firstPlayerPlay = move
      : this.secondPlayerPlay = move
    this.handleGameResult()
  }
  resetGame () {
    this.firstPlayerPlay = Plays.None
    this.secondPlayerPlay = Plays.None
    this.firstPlayerVictories = 0
    this.secondPlayerVictories = 0
  }
  firstPlayerWin () {
    this.results.push(new RPSResult(false, this.firstPlayerSeat))
    this.firstPlayerVictories++
  }
  secondPlayerWin () {
    this.results.push(new RPSResult(false, this.secondPlayerSeat))
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

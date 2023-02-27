import User from "../../../User";
import Game from "../../Game";
import Result from "./Result";

export enum Plays {
  None,
  Rock,
  Paper,
  Sissors
}

enum GameState {
  WaintingPlays,
  ShowingResults
}

export default class RPS extends Game {
  readonly name: string
  firstPlayerPlay: Plays
  secondPlayerPlay: Plays
  firstPlayerVictories: number
  secondPlayerVictories: number
  state: GameState
  results: Array<Result>

  constructor () {
    super()
    this.name = 'RPS'
    this.firstPlayerPlay = Plays.None
    this.secondPlayerPlay = Plays.None
    this.firstPlayerVictories = 0
    this.secondPlayerVictories = 0
    this.state = GameState.WaintingPlays
    this.results = []
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
    this.results.push(new Result(false, this.players[0]))
    this.firstPlayerVictories++
  }
  secondPlayerWin () {
    this.results.push(new Result(false, this.players[1]))
    this.secondPlayerVictories++
  }
  isTie () {
    this.results.push(new Result(true))
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

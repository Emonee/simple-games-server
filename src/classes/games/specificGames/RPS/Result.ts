import User from "../../../User"

export default class Result {
  readonly id: number
  readonly createdAt: Date
  readonly isTie: boolean
  readonly winnerUser?: User

  static id = 0

  constructor (isTie: boolean, winnerUser?: User) {
    this.id = ++Result.id
    this.createdAt = new Date()
    this.isTie = isTie
    if (winnerUser) this.winnerUser = winnerUser
  }
}

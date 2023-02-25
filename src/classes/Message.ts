import User from "./User"

export default class Message {
  readonly id: number
  readonly createdAt: Date
  readonly user: User
  readonly message: string

  static id = 0

  constructor (user: User, message: string) {
    this.id = ++Message.id
    this.createdAt = new Date()
    this.user = user
    this.message = message
  }
}
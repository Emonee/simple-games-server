import { Message } from "../types"
import Game from "./games/Game"
import User from "./User"


export default class Room {
  readonly id: number
  readonly createdAt: Date
  name: string
  readonly game: Game
  readonly ownerUser: User
  participants: Set<User>
  chat: Array<Message>

  static id = 0
  
  constructor (name: string, ownerUser: User, game: Game) {
    this.id = ++Room.id
    this.createdAt = new Date()
    this.name = name
    this.game = game
    this.ownerUser = ownerUser
    this.participants = new Set([ownerUser])
    this.chat = []
  }

  addUser (user: User) {
    return this.participants.add(user)
  }
  removeUser (user: User) {
    return this.participants.delete(user)
  }
  sendMessage (user: User, message: string) {
    this.chat.push({ createdAt: new Date(), user, message })
  }
}

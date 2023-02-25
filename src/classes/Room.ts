import Game from "./games/Game"
import Message from "./Message"
import User from "./User"


export default class Room {
  readonly id: number
  readonly createdAt: Date
  name: string
  readonly game: Game
  ownerUser?: User
  participants: Set<User>
  chat: Array<Message>

  static id = 0
  
  constructor (name: string, game: Game) {
    this.id = ++Room.id
    this.createdAt = new Date()
    this.name = name
    this.game = game
    this.participants = new Set()
    this.chat = []
  }

  addUser (user: User) {
    return this.participants.add(user)
  }
  removeUser (user: User) {
    return this.participants.delete(user)
  }
  sendMessage (user: User, message: string) {
    const newMessage = new Message(user, message)
    this.chat.push(newMessage)
  }
}

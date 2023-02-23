import User from "../classes/User"

export type Message = {
  createdAt: Date,
  user: User,
  value: string,
}

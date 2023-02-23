export default class User {
  id: number
  nickName: string

  static id = 0

  constructor (nickName: string) {
    this.id = ++User.id
    this.nickName = nickName
  }
}
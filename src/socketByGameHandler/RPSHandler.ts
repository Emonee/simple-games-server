import { Namespace, Socket } from "socket.io";
import RPS, { Plays } from "../classes/games/specificGames/RPS/RPS";
import Room from "../classes/Room";
import User from "../classes/User";
import { rooms } from "../rooms";

export default function (roomNamespace: Namespace, socket: Socket, room: Room) {
  const game: RPS = room.game

  let user: User

  socket.join(room.id.toString())
  socket.once('joinGameRoom', (userNickName) => {
    user = new User(userNickName)
    room.addUser(user)
    if (room.participants.size === 1) room.ownerUser = user
    socket.emit('getUserData', user)
    socket.emit('getGeneralRoomData', { name: room.name, ownerUser: room.ownerUser })
    socket.emit('getGame', room.game)
    socket.emit('getChat', room.chat)
    roomNamespace.to(room.id.toString()).emit('getParticipants', [...room.participants])
  })
  socket.on('disconnect', () => {
    room.removeUser(user)
    if (room.participants.size < 1) return rooms.delete(room)
    roomNamespace.to(room.id.toString()).emit('getGame', room.game)
    roomNamespace.to(room.id.toString()).emit('getParticipants', [...room.participants])
  })
  socket.on('sendMessage', (message: string) => {
    room.sendMessage(user, message)
    roomNamespace.to(room.id.toString()).emit('getChat', room.chat)
  })
  socket.on('joinGame', () => {
    if (game.players.includes(user)) return
    game.joinGame(user)
    roomNamespace.to(room.id.toString()).emit('getGame', game)
  })
  socket.on('leaveGame', () => {
    if (!game.players.includes(user)) return
    game.leaveGame(user)
    roomNamespace.to(room.id.toString()).emit('getGame', game)
  })
  socket.on('move', (move: Plays) => {  
    game.setMove(move, user)
    roomNamespace.to(room.id.toString()).emit('getGame', game)
  })
  socket.on('resetGame', () => {
    game.resetGame()
    roomNamespace.to(room.id.toString()).emit('getGame', game)
  })
}

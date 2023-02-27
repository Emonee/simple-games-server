import { Server } from 'socket.io'
import { httpServer, CORS_URL } from './server'
import { rooms } from './rooms'
import Room from './classes/Room'
import User from './classes/User'
import { Plays } from './classes/games/specificGames/RPS/RPS'

const io = new Server(httpServer, {
  cors: {
    origin: CORS_URL
  }
})

const roomNamespace = io.of(/^\/rooms\/\d/)

roomNamespace.on('connection', function (socket) {
  const roomId = socket.nsp.name.slice(7)
  const room: Room = rooms.find((room: Room) => room.id === +roomId)
  if (!room) return socket.disconnect()

  let user: User
  socket.join(roomId)

  socket.once('joinGameRoom', (userNickName) => {
    user = new User(userNickName)
    room.addUser(user)
    if (room.participants.size === 1) room.ownerUser = user
    socket.emit('getUserData', user)
    socket.emit('getGeneralRoomData', { name: room.name, ownerUser: room.ownerUser })
    socket.emit('getGame', room.game)
    socket.emit('getChat', room.chat)
    roomNamespace.to(roomId).emit('getParticipants', [...room.participants])
  })
  socket.on('sendMessage', (message: string) => {
    room.sendMessage(user, message)
    roomNamespace.to(roomId).emit('getChat', room.chat)
  })
  socket.on('joinGame', () => {
    if (room.game.players.includes(user)) return
    room.game.joinGame(user)
    roomNamespace.to(roomId).emit('getGame', room.game)
  })
  socket.on('leaveGame', () => {
    if (!room.game.players.includes(user)) return
    room.game.leaveGame(user)
    roomNamespace.to(roomId).emit('getGame', room.game)
  })
  socket.on('move', (move: Plays) => {
    room.game.setMove(move, user)
    roomNamespace.to(roomId).emit('getGame', room.game)
  })
  socket.on('resetGame', () => {
    room.game.resetGame()
    roomNamespace.to(roomId).emit('getGame', room.game)
  })

  socket.on('disconnect', () => {
    room.removeUser(user)
    if (room.participants.size < 1) return rooms.delete(room)
    roomNamespace.to(roomId).emit('getGame', room.game)
    roomNamespace.to(roomId).emit('getParticipants', [...room.participants])
  })
})

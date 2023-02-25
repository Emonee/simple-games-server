import { Server } from 'socket.io'
import { httpServer, CORS_URL } from './server'
import { rooms } from './rooms'
import Room from './classes/Room'
import User from './classes/User'

const io = new Server(httpServer, {
  cors: {
    origin: CORS_URL
  }
})

const roomNamespace = io.of(/^\/rooms\/\d/)

roomNamespace.on('connection', function (socket) {
  const roomId = socket.nsp.name.slice(7)
  const room = getRoomById(+roomId)
  if (!room) return socket.disconnect()

  let user: User
  socket.join(roomId)
  socket.emit('getRoom', room)

  socket.once('joinGameRoom', (userNickName) => {
    user = new User(userNickName)
    room.addUser(user)
    if (room.participants.size === 1) room.ownerUser = user
    socket.emit('getChat', room.chat)
    socket.emit('getGeneralRoomData', { name: room.name, ownerUser: room.ownerUser })
    roomNamespace.to(roomId).emit('getParticipants', [...room.participants])
  })
  socket.on('sendMessage', (message: string) => {
    room.sendMessage(user, message)
    roomNamespace.to(roomId).emit('getChat', room.chat)
  })

  socket.on('disconnect', () => {
    room.removeUser(user)
    if (room.participants.size < 1) return rooms.delete(room)
    roomNamespace.to(roomId).emit('getParticipants', [...room.participants])
  })
})

function getRoomById(roomId: number): Room {
  return rooms.find((room: Room) => room.id === roomId)
}

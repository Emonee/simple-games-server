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
    
  })
  socket.on('sendMessage', (message: string) => {
    rooms.sendMessageToRoom(+roomId, user, message)
    roomNamespace.to(roomId).emit('getRoom', room)
  })

  socket.on('disconnect', () => {
    room.removeUser(user)
    if (room.participants.size < 1) rooms.delete(room)
  })
})

function getRoomById(roomId: number): Room {
  return rooms.find((room: Room) => room.id === roomId)
}

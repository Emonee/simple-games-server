import { Server } from 'socket.io'
import { httpServer, CORS_URL } from './server'
import { rooms } from './rooms'
import Room from './classes/Room'

const io = new Server(httpServer, {
  cors: {
    origin: CORS_URL
  }
})

const roomNamespace = io.of(/^\/rooms\/\d/)

roomNamespace.on('connection', function (socket) {
  const roomId = socket.nsp.name.slice(7)
  socket.join(roomId)
  socket.emit('getRoom', getRoomById(+roomId))

  socket.on('changeRoomName', (newRoomName: string) => {
    rooms.changeRoomName(+roomId, newRoomName)
    roomNamespace.to(roomId).emit('getRoom', getRoomById(+roomId))
  })
})

function getRoomById(roomId: number) {
  return rooms.find((room: Room) => room.id === roomId)
}

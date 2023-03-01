import { Server } from 'socket.io'
import { httpServer, CORS_URL } from './server'
import { rooms } from './rooms'
import Room from './classes/Room'
import socketByGameHandler from './socketByGameHandler'

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
  socketByGameHandler(roomNamespace, socket, room)
})

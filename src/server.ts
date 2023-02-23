import { createServer } from 'http'
import Game from './classes/games/Game'
import Room from './classes/Room'
import User from './classes/User'
import { rooms } from './rooms'

const PORT = process.env.PORT || 8080
export const CORS_URL = process.env.CORS_URL || 'http://localhost:3000'

export const httpServer = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_URL)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.end()
  if (req.url === '/rooms/new' && req.method === 'POST') {
    let body: { roomName: string, userNickName: string }
    req.on('data', (chunk) => body = JSON.parse(chunk.toString()))
    req.on('end', () => {
      const { roomName, userNickName } = body
      const user = new User(userNickName)
      const newRoom = new Room(roomName, user, new Game())
      rooms.add(newRoom)
      res.end(newRoom.id.toString())
    })
    return
  }
  res.writeHead(404)
  res.end()
})

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

import { createServer } from 'http'
import RPS from './classes/games/specificGames/RPS/RPS'
import Room from './classes/Room'
import { rooms } from './rooms'

const PORT = process.env.PORT || 8080
export const CORS_URL = process.env.CORS_URL || 'http://localhost:3000'

export const httpServer = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_URL)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.end()
  if (req.url === '/rooms/new' && req.method === 'POST') {
    let body: { roomName: string, userNickName: string, roomsGame: string }
    req.on('data', (chunk) => body = JSON.parse(chunk.toString()))
    req.on('end', () => {
      const { roomName, roomsGame } = body
      const game: any = 
        roomsGame === 'RPS' ? new RPS() :
        undefined
      if (!game) {
        res.writeHead(404, 'game not found')
        return res.end()
      }
      const newRoom = new Room(roomName, game)
      rooms.add(newRoom)
      res.end(newRoom.id.toString())
    })
    return
  }
  res.writeHead(404, 'resource not found')
  res.end()
})

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}, with cors url: ${CORS_URL}`))

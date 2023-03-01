import { IncomingMessage, ServerResponse } from 'http'
import RPS from '../classes/games/specificGames/RPS/RPS'
import Room from '../classes/Room'
import { rooms } from '../rooms'

const GAME_CLASSES = [RPS]

export default function (req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req
  if (req.method === 'OPTIONS') {
    res.end()
    return
  }
  if (url === '/rooms/new' && method === 'POST') {
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
      const jsonRes = JSON.stringify({
        newRoomId: newRoom.id.toString()
      })
      res.end(jsonRes)
    })
    return
  }
  if (url === '/games' && method === 'GET') {
    const games = GAME_CLASSES.map(({ name, description, imgURL }) => ({ name, description, imgURL }))
    const data = { games }
    res.write(JSON.stringify(data))
    res.end()
    return
  }
  res.writeHead(404, 'not found')
  res.end()
}

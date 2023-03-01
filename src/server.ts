import { createServer } from 'http'
import routerHandler from './router'

const PORT = process.env.PORT || 8080
export const CORS_URL = process.env.CORS_URL || 'http://localhost:3000'

export const httpServer = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_URL)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  routerHandler(req, res)
})

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}, with cors url: ${CORS_URL}`))

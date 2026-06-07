import '../../../env-loader.cjs'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Redis } from 'ioredis'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: process.env.NEXT_PUBLIC_APP_URL!, methods: ['GET', 'POST'], credentials: true },
})

// We only need Redis if we are scaling across multiple socket servers
// const redis = new Redis(process.env.REDIS_URL!)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join:conversation', (conversationId: string) => {
    socket.join(`conversation:${conversationId}`)
  })

  socket.on('join:user', (userId: string) => {
    socket.join(`user:${userId}`)
  })

  socket.on('message:send', async (data: { conversationId: string; message: object }) => {
    io.to(`conversation:${data.conversationId}`).emit('message:received', data.message)
  })

  socket.on('typing:start', (data: { conversationId: string; userId: string }) => {
    socket
      .to(`conversation:${data.conversationId}`)
      .emit('typing:update', { userId: data.userId, isTyping: true })
  })

  socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
    socket
      .to(`conversation:${data.conversationId}`)
      .emit('typing:update', { userId: data.userId, isTyping: false })
  })

  socket.on('notification:send', (data: { userId: string; notification: object }) => {
    io.to(`user:${data.userId}`).emit('notification:received', data.notification)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.SOCKET_PORT || 3001
httpServer.listen(PORT, () => console.log(`🔌 Socket.io server running on port ${PORT}`))

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const typeDefs = require('./schema/typeDefs')
const { resolvers } = require('./schema/resolvers')

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

// ==================== CONNECT DB ====================
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err))

// ==================== AUTH MIDDLEWARE ====================
const getUser = (token) => {
  if (!token) return null
  try {
    const bearer = token.startsWith('Bearer ') ? token.slice(7) : token
    return jwt.verify(bearer, process.env.JWT_SECRET || 'alexhub_secret')
  } catch {
    return null
  }
}

// ==================== SETUP ====================
async function startServer() {
  const app = express()
  const httpServer = createServer(app)

  // Build schema
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  // WebSocket Server (for Subscriptions)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const serverCleanup = useServer({
    schema,
    context: async (ctx) => {
      const token = ctx.connectionParams?.Authorization || ctx.connectionParams?.authorization
      const user = getUser(token)
      return { user }
    },
  }, wsServer)

  // Apollo Server
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
    introspection: true,
  })

  await server.start()

  // Express Middleware
  app.use(cors({ origin: '*', credentials: true }))
  app.use(express.json())

  // Health Check
  app.get('/', (req, res) => {
    res.json({
      status: '🚀 AlexHub Backend Running!',
      version: '1.0.0',
      graphql: `http://localhost:${PORT}/graphql`,
      ws: `ws://localhost:${PORT}/graphql`
    })
  })

  // GraphQL Endpoint
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization
      const user = getUser(token)
      return { user }
    },
  }))

  // Start
  httpServer.listen(PORT, () => {
    console.log(`\n🚀 AlexHub Backend Ready!`)
    console.log(`📡 GraphQL:  http://localhost:${PORT}/graphql`)
    console.log(`⚡ WebSocket: ws://localhost:${PORT}/graphql`)
    console.log(`🏥 Health:   http://localhost:${PORT}/\n`)
  })
}

startServer().catch(console.error)

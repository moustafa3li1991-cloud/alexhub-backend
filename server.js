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

const app = express()
const httpServer = createServer(app)
const schema = makeExecutableSchema({ typeDefs, resolvers })

// Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
  introspection: true,
})

async function init() {
  await server.start()

  app.use(cors({ origin: '*', credentials: true }))
  app.use(express.json())

  app.get('/', (req, res) => {
    res.json({
      status: '🚀 AlexHub Backend Running on Vercel!',
      version: '1.0.0'
    })
  })

  app.get('/ping', (req, res) => {
    res.send('I am awake!');
  });

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization
      const user = getUser(token)
      return { user }
    },
  }))
}

// Handle Local Development
if (process.env.NODE_ENV !== 'production') {
  init().then(() => {
    // WebSocket only for local
    const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' })
    useServer({ schema }, wsServer)

    httpServer.listen(PORT, () => {
      console.log(`\n🚀 AlexHub Local Ready at http://localhost:${PORT}/graphql`)
    })
  })
}

// For Vercel
init().catch(console.error)
module.exports = app

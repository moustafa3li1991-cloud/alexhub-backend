# AlexHub Backend

GraphQL API Server for AlexHub Super Delivery App

## Tech Stack
- Node.js + Express
- Apollo Server 4 (GraphQL)
- MongoDB + Mongoose
- WebSocket (Real-time Subscriptions)
- JWT Authentication

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Seed database (optional)
npm run seed

# 4. Start server
npm run dev
```

## Endpoints
- GraphQL: `http://localhost:4000/graphql`
- WebSocket: `ws://localhost:4000/graphql`
- Health: `http://localhost:4000/`

## Test Credentials
- Email: `test@alexhub.app`
- Password: `test123`
- Test OTP: `111111`

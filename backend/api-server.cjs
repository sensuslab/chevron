/**
 * Chevron Backend API Server
 *
 * This server provides secure API endpoints for the Chevron application,
 * including a proxy for OpenAI API calls to keep API keys secure.
 */

const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(express.json())

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:8000']

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,
  message: {
    error: {
      code: 'rate_limit_exceeded',
      message: 'Too many requests, please try again later.'
    }
  }
})

app.use('/api/', limiter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// OpenAI Chat Completion Proxy
app.post('/api/chat/completions', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return res.status(500).json({
      error: {
        code: 'configuration_error',
        message: 'OpenAI API key not configured on server. Please contact the administrator.'
      }
    })
  }

  const { messages, temperature = 0.4, model = 'gpt-4' } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: {
        code: 'invalid_request',
        message: 'Messages array is required'
      }
    })
  }

  try {
    const fetch = (await import('node-fetch')).default

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true,
        max_tokens: 16384,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return res.status(response.status).json(errorData)
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Pipe the streaming response
    response.body.pipe(res)

  } catch (error) {
    console.error('Error proxying to OpenAI:', error)
    res.status(500).json({
      error: {
        code: 'proxy_error',
        message: error.message || 'An error occurred while processing your request'
      }
    })
  }
})

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')))

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: {
      code: 'internal_error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An internal error occurred'
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Chevron server running on port ${PORT}`)
  console.log(`   API endpoint: http://localhost:${PORT}/api`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set in environment variables')
    console.warn('   Please create a .env file in the backend directory')
  }
})

module.exports = app

# Chevron Backend API

This backend server provides secure API endpoints for the Chevron application, including a proxy for OpenAI API calls.

## Features

- **Secure API Key Management**: OpenAI API keys are stored server-side only
- **CORS Protection**: Configurable allowed origins
- **Rate Limiting**: Prevents abuse with configurable limits
- **Streaming Support**: Efficient streaming of AI responses
- **Health Monitoring**: Health check endpoint for status verification

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.template .env
```

Edit the `.env` file with your configuration:

```env
# Required: Your OpenAI API Key
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: Server Configuration
PORT=8000
NODE_ENV=production

# Optional: CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

### 3. Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev:server
```

**Development Mode** (frontend + backend):
```bash
npm run dev:all
```

**Production Mode**:
```bash
npm start
```

## API Endpoints

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-11-06T10:00:00.000Z"
}
```

### Chat Completion

```
POST /api/chat/completions
```

**Request Body:**
```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant" },
    { "role": "user", "content": "Hello!" }
  ],
  "temperature": 0.4,
  "model": "gpt-4"
}
```

**Response:**
Streaming response in Server-Sent Events format

## Security Notes

1. **Never commit your `.env` file** - It contains sensitive API keys
2. **API keys are server-side only** - The client never sees or transmits API keys
3. **Rate limiting is enabled** - Default: 30 requests per minute
4. **CORS is configured** - Only allowed origins can access the API

## Troubleshooting

### Server won't start

- Check that port 8000 is not already in use
- Verify all dependencies are installed: `npm install`
- Check the `.env` file exists and has valid values

### API calls failing

- Verify the `OPENAI_API_KEY` is set correctly in `.env`
- Check the backend server is running
- Verify CORS origins include your frontend URL
- Check rate limiting hasn't been exceeded

### Streaming not working

- Ensure you're using a modern browser that supports ReadableStream
- Check network tab for connection issues
- Verify the backend response headers include proper streaming headers

## Development

The backend uses:
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting middleware
- **dotenv** - Environment variable management
- **node-fetch** - Fetch API for Node.js

## Migration from Client-Side API

If you were previously using client-side API calls:

1. The API key in the UI settings is now ignored
2. Move your API key to the backend `.env` file
3. The client will automatically use the backend proxy
4. No code changes needed in the frontend

## Support

For issues or questions:
- Check the main [README.md](../README.md)
- Review the [Enhancement Plan](../chevron_comprehensive_enhancement_plan.md)
- Check logs in the console for error messages

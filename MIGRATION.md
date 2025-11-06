# Migration Guide

This guide helps you migrate from previous versions of Chevron to the latest version with enhanced security and customization features.

## Overview of Changes

### Major Changes
1. **API Key Storage**: Moved from client-side to server-side
2. **Backend Proxy**: New Express server for secure API calls
3. **Wallpaper System**: New customization features
4. **Enhanced Dependencies**: Additional packages for backend functionality

## Step-by-Step Migration

### For All Users

#### 1. Update Dependencies

```bash
npm install
```

This will install the new backend dependencies:
- express
- cors
- express-rate-limit
- dotenv
- node-fetch
- nodemon
- concurrently

#### 2. Set Up Backend Configuration

Create your backend environment file:

```bash
cp backend/.env.template backend/.env
```

Edit `backend/.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=8000
NODE_ENV=production
```

**Important**: Your API key should be the same one you were previously using in the UI settings.

#### 3. Update Your Workflow

**Development:**
```bash
# Old way
npm run dev

# New way (frontend only)
npm run dev

# New way (frontend + backend)
npm run dev:all
```

**Production:**
```bash
# Old way
npm run build
# Serve dist folder

# New way
npm run build
npm start
# Server handles both API and static files
```

### For Static Installation Users

If you were using the static installation method:

1. Follow steps 1-2 above
2. You can continue using static files, but you'll need to:
   - Run the backend server: `npm start`
   - Update your browser extension to point to `http://localhost:8000`

### For Hosted Installation Users

If you were using the hosted method:

1. Follow steps 1-2 above
2. Update `backend/register.cjs` if needed (no changes required for most users)
3. Re-register the service:
   ```bash
   # Windows
   npm run register_windows

   # Linux
   npm run register_linux

   # Mac
   npm run register_mac
   ```

### For GitHub Pages Users

GitHub Pages users will need to:

1. Set up a backend server separately (cannot run Node.js on GitHub Pages)
2. Options:
   - Use Vercel/Netlify for the backend
   - Host backend on your own server
   - Use the static method with a local backend
3. Update the API client URL in your deployment configuration

## Configuration Changes

### API Key Migration

**Before:**
- API key stored in: UI Settings → Query → AI → Api key
- Transmitted with every request from browser

**After:**
- API key stored in: `backend/.env` file
- Never transmitted from browser
- UI setting still visible but ignored (will be removed in future version)

### New Features Available

#### Wallpaper Customization

The new wallpaper system is automatically available. To use it:

1. Access through Settings (UI will be added in future update)
2. Or programmatically:
   ```javascript
   import { useWallpaper, useSetWallpaper } from './contexts/Wallpaper'

   // In your component
   const wallpaper = useWallpaper()
   const setWallpaper = useSetWallpaper()

   // Set a color
   setWallpaper({ type: 'color', color: '#1a1a1a' })

   // Set a gradient
   setWallpaper({
     type: 'gradient',
     gradient: {
       type: 'linear',
       angle: 135,
       colors: ['#667eea', '#764ba2']
     }
   })
   ```

## Troubleshooting

### Backend Won't Start

**Problem**: `Error: Cannot find module 'express'`

**Solution**:
```bash
npm install
```

### API Calls Failing

**Problem**: AI completions not working

**Solution**:
1. Check backend is running: `npm run dev:server`
2. Verify API key in `backend/.env`
3. Check browser console for errors
4. Verify backend health: `curl http://localhost:8000/api/health`

### CORS Errors

**Problem**: `Access to fetch has been blocked by CORS policy`

**Solution**:
Add your frontend URL to `ALLOWED_ORIGINS` in `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000
```

### Rate Limiting

**Problem**: Getting `rate_limit_exceeded` errors

**Solution**:
Adjust rate limits in `backend/.env`:
```env
RATE_LIMIT_WINDOW_MS=60000  # Time window (ms)
RATE_LIMIT_MAX_REQUESTS=50  # Max requests per window
```

## Rollback Instructions

If you need to rollback to the previous version:

1. Checkout previous git version:
   ```bash
   git checkout <previous-commit-hash>
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

3. You can continue using client-side API keys with the old version

## Security Recommendations

### Do's ✅
- Store API keys in `backend/.env` only
- Add `backend/.env` to `.gitignore` (already done)
- Use environment-specific configurations
- Keep dependencies updated
- Monitor rate limit logs

### Don'ts ❌
- Never commit `.env` files
- Don't store API keys in client code
- Don't disable CORS in production
- Don't share your `.env` file

## Getting Help

If you encounter issues during migration:

1. Check the [backend README](./backend/README.md)
2. Review the [enhancement plan](./chevron_comprehensive_enhancement_plan.md)
3. Check the console for error messages
4. Verify all environment variables are set correctly

## What's Next?

See the [CHANGELOG.md](./CHANGELOG.md) for all new features and the [enhancement plan](./chevron_comprehensive_enhancement_plan.md) for upcoming features.

### Upcoming Features
- Settings UI for wallpaper management
- Theme presets
- Widget system integration
- Component modularity improvements
- And more!

---

**Migration completed successfully?**

You should now have:
- ✅ Secure backend API proxy running
- ✅ API key stored server-side
- ✅ Wallpaper system available
- ✅ Enhanced development workflow

Enjoy the enhanced Chevron experience! 🎉

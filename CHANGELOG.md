# Changelog

All notable changes to the Chevron project will be documented in this file.

## [Unreleased] - 2025-11-06

### Added

#### Security Enhancements
- **Backend API Proxy**: Secure server-side API proxy for OpenAI calls
  - API keys now stored server-side only in `.env` file
  - Rate limiting (30 requests/minute by default)
  - CORS protection with configurable allowed origins
  - Health check endpoint at `/api/health`

- **Environment Configuration**:
  - `.env.template` for easy setup
  - Backend README with detailed setup instructions

#### New Features
- **Wallpaper System**: Complete customization system for backgrounds
  - Support for solid colors, gradients, images, and videos
  - Adjustable effects: opacity, blur, brightness, contrast, saturation
  - Persistent storage using localStorage
  - `WallpaperProvider` context for global state management
  - `useWallpaperUpload` hook for easy wallpaper management

- **Enhanced Theme System**:
  - Improved theme token structure
  - Better integration with existing settings
  - Preparation for theme presets

#### Developer Experience
- New npm scripts:
  - `npm run dev:server` - Run backend in development mode
  - `npm run dev:all` - Run frontend and backend concurrently
  - `npm start` - Run backend in production mode

- Better project structure:
  - `/src/api/` - Backend communication layer
  - `/src/hooks/` - Enhanced with wallpaper hooks
  - `/backend/` - Organized API server with middleware

### Changed

#### Breaking Changes
- **API Key Management**:
  - API keys must now be stored in `backend/.env` file
  - Client-side API key setting in UI is now deprecated (still visible but unused)
  - See [MIGRATION.md](./MIGRATION.md) for upgrade instructions

#### Improvements
- **AI Integration**:
  - Refactored `createCompletion.js` to use backend proxy
  - Better error handling and user feedback
  - Streaming response improvements
  - Model changed from 'gpt-5' to 'gpt-4' (more stable)

- **Code Quality**:
  - Modularized API client logic
  - Improved separation of concerns
  - Better documentation and comments

### Security
- API keys no longer exposed in client-side code
- Server-side validation of all API requests
- Rate limiting to prevent abuse
- CORS protection against unauthorized origins

### Dependencies Added
- `express` - Web framework for backend
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting middleware
- `dotenv` - Environment variable management
- `node-fetch` - Fetch API for Node.js
- `nodemon` - Development auto-reload
- `concurrently` - Run multiple npm scripts

### Documentation
- [chevron_comprehensive_enhancement_plan.md](./chevron_comprehensive_enhancement_plan.md) - Complete technical implementation plan
- [backend/README.md](./backend/README.md) - Backend setup and API documentation
- [MIGRATION.md](./MIGRATION.md) - Migration guide for existing users

## [2.2.0] - Previous Release

See git history for previous changes.

---

## Migration Guide

For existing users upgrading to this version, please see [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

## Future Roadmap

See [chevron_comprehensive_enhancement_plan.md](./chevron_comprehensive_enhancement_plan.md) for the complete roadmap including:
- Widget system integration (Anori)
- Enhanced component modularity
- Storybook integration
- Additional wallpaper presets
- Theme marketplace
- And more...

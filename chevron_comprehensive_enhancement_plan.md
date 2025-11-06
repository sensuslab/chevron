# Chevron Homepage Enhancement Plan

## Executive Summary

This document outlines a comprehensive technical implementation plan for enhancing the Chevron homepage application. The plan covers a detailed system analysis, modernization of the AI system, component architecture enhancements, a phased implementation roadmap, and technical specifications for customization, widget integration, and quality assurance.

## 1. System Analysis

### 1.1. Current Codebase Review

**Framework and Dependencies:**
- React 18.2.0 with Vite as build tool
- State Management: Custom Context API implementation (Store.jsx, Settings.jsx)
- Styling: CSS Modules with Emotion/MUI Joy UI
- Animation: Framer Motion
- Current bundle: Single-file distribution via vite-plugin-singlefile

**Mode Handling:**
- Light/dark mode via ColorSchemeContext
- Theme system managed through ThemeContext
- Settings persistence via localStorage

**State Management:**
- Custom optimized context implementation in `src/contexts/createOptimisedContext.jsx`
- Store context with mode, redirected, and timestamp state
- Settings context with nested configuration structure

**Code Quality Findings:**
- Well-structured component hierarchy
- Good separation of concerns with hooks and utilities
- Security concern: API key exposed in client-side code (createCompletion.js:23)
- Opportunity for better modularity in larger components

### 1.2. AI Component Analysis

**Analysis of `src/components/AIcompletion/AIcompletion.jsx`:**

**UI/UX:**
- Clean markdown rendering with ReactMarkdown
- Streaming response display with real-time updates
- Error handling with formatted error messages
- Chat history maintained in component ref

**Context Management:**
- Chat log stored in useRef to persist across renders
- System message configuration with date/time and language
- Streaming state management via setCompletion

**Performance Considerations:**
- Abort controller for cleanup on unmount
- Efficient re-render control with proper dependencies

**Current Issues:**
- API key stored and transmitted from client
- No retry mechanism for failed requests
- Limited error user feedback options

### 1.3. Existing Functionality

**Feature List:**
1. **Smart Query System**: Parse queries, detect macros, and redirect to appropriate URLs
2. **AI Integration**: GPT-5 powered chat completion with streaming responses
3. **Macros System**: Customizable shortcuts for frequently visited sites
4. **Commands**: Advanced URL templating for search and navigation
5. **History & Autocomplete**: Google autocomplete and local history
6. **Macros Menu**: Visual carousel of pinned macros with keyboard navigation
7. **Theming**: Light/dark mode with customizable colors
8. **Settings Panel**: Comprehensive configuration UI
9. **Interactive Background**: Animated visual elements
10. **Time Display**: Customizable clock widget
11. **Currency Converter**: Built-in currency conversion
12. **Calculator**: Inline calculation support
13. **Keyboard Shortcuts**: Hotkeys for quick macro access

## 2. AI System Documentation

### 2.1. GPT-5 Integration Analysis

**Analysis of `src/chatGPT/createCompletion.js`:**

**API Interaction:**
- Direct fetch to OpenAI API (https://api.openai.com/v1/chat/completions)
- Streaming response handling with ReadableStream API
- Parameters: model='gpt-5', temperature=0.4, max_tokens=16384

**Error Handling:**
- Basic error parsing from API responses
- No retry logic for network failures
- Limited user-facing error messages

**Security Issues:**
- API key passed directly from client (Line 23)
- No rate limiting
- No request validation

**Performance:**
- Efficient streaming with custom parser
- Proper cleanup with AbortController
- Minimal overhead in data processing

### 2.2. Recommendations for Modernization

**Priority 1: Security**
1. Create backend proxy endpoint for OpenAI API
2. Store API key server-side only
3. Implement request validation and rate limiting
4. Add CORS protection

**Priority 2: Reliability**
1. Add exponential backoff retry logic
2. Implement request timeout handling
3. Add connection status indicators
4. Cache responses for repeated queries

**Priority 3: Features**
1. Support for multiple AI providers (abstraction layer)
2. Conversation persistence across sessions
3. Export chat history
4. Token usage tracking and cost estimation

**Priority 4: Performance**
1. Request queuing for concurrent queries
2. Response caching with LRU strategy
3. Lazy loading of AI component
4. Code splitting for AI features

## 3. Component Architecture

### 3.1. Existing Component Structure

**Component Tree:**
```
App
├── Settings
│   ├── Category
│   ├── Property
│   ├── ColorPicker
│   ├── Buttons
│   ├── Header
│   └── HelpTooltip
├── ActiveElements
│   ├── Time
│   ├── Chevron
│   ├── MacrosMenu
│   │   └── Card (multiple)
│   ├── Suggestions
│   └── InteractiveBackground
├── QueryField
│   ├── AIcompletion
│   └── TextareaAutosize
└── LayoutButton (Settings & Macros Menu toggles)
```

**Data Flow:**
- Settings flow down via SettingsContext
- Theme values via ThemeContext
- ColorScheme via ColorSchemeContext
- Store state via custom Store context with selectors

### 3.2. Proposed Enhancements

**Modularization:**
1. Split AIcompletion into:
   - `ChatInput` - User input handling
   - `MessageList` - Conversation display
   - `Message` - Individual message rendering
   - `StreamingIndicator` - Loading state

2. Split Settings into:
   - `SettingsPanel` - Main container
   - `SettingSection` - Collapsible sections
   - `SettingControl` - Individual setting inputs
   - `SettingsSearch` - Find settings quickly

3. Extract common patterns:
   - `Modal` - Reusable modal wrapper
   - `IconButton` - Consistent icon buttons
   - `Tooltip` - Unified tooltip component
   - `ColorInput` - Standardized color picker

**Component Library Structure:**
```
src/components/
├── common/           # Reusable primitives
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   └── Tooltip/
├── layout/           # Layout components
│   ├── Container/
│   ├── Panel/
│   └── Grid/
├── features/         # Feature components
│   ├── AI/
│   ├── MacrosMenu/
│   ├── QueryField/
│   └── Settings/
└── widgets/          # Widget system
    ├── Time/
    ├── Weather/
    └── ...
```

**Theming and Styling:**
- Leverage existing Emotion/MUI Joy UI
- Create comprehensive theme tokens
- Implement CSS custom properties for dynamic theming
- Add theme presets (minimal, classic, vibrant, etc.)

## 4. Implementation Roadmap

### Phase 1: Foundation and Security (Week 1-2)

**Week 1:**
- [ ] **Task 1.1**: Create backend API proxy endpoint
  - Set up Express server in `/backend`
  - Create `/api/chat/completions` endpoint
  - Implement API key validation
  - Add request logging

- [ ] **Task 1.2**: Secure API key management
  - Create `.env` template
  - Update backend to read from environment
  - Add API key rotation documentation

- [ ] **Task 1.3**: Refactor client AI integration
  - Update `createCompletion.js` to use proxy
  - Remove hardcoded API key
  - Add error boundary for AI component

**Week 2:**
- [ ] **Task 1.4**: Enhanced error handling
  - Implement retry logic with exponential backoff
  - Add user-friendly error messages
  - Create error recovery UI

- [ ] **Task 1.5**: Component preparation
  - Audit existing components for modularity
  - Create component documentation
  - Set up component testing structure

### Phase 2: Customization Features (Week 3-4)

**Week 3:**
- [ ] **Task 2.1**: Wallpaper system
  - Create `WallpaperProvider` context
  - Implement wallpaper upload/selection UI
  - Add wallpaper storage (localStorage/IndexedDB)
  - Create wallpaper effects (blur, opacity, filters)

- [ ] **Task 2.2**: Enhanced theme system
  - Extend existing theme with more tokens
  - Create theme preset system
  - Implement theme import/export
  - Add theme editor UI

**Week 4:**
- [ ] **Task 2.3**: Shortcut management
  - Create shortcut CRUD operations
  - Build shortcut editor UI
  - Implement drag-and-drop reordering
  - Add shortcut categories/folders

- [ ] **Task 2.4**: Settings enhancement
  - Reorganize settings structure
  - Add settings search
  - Implement settings import/export
  - Create settings presets

### Phase 3: Widget System Foundation (Week 5-6)

**Week 5:**
- [ ] **Task 3.1**: Widget architecture
  - Design widget API interface
  - Create widget lifecycle management
  - Implement widget state persistence
  - Build widget container system

- [ ] **Task 3.2**: Anori integration analysis
  - Review anori-master codebase
  - Document widget compatibility
  - Create integration strategy
  - Identify required adapters

**Week 6:**
- [ ] **Task 3.3**: Core widgets
  - Refactor existing Time widget
  - Create Weather widget skeleton
  - Build Quick Links widget
  - Implement Notes widget

- [ ] **Task 3.4**: Widget marketplace preparation
  - Create widget manifest format
  - Build widget loader system
  - Design widget discovery UI
  - Document widget development guide

### Phase 4: Polish and Documentation (Week 7-8)

**Week 7:**
- [ ] **Task 4.1**: Performance optimization
  - Implement code splitting
  - Add lazy loading for widgets
  - Optimize bundle size
  - Profile and optimize re-renders

- [ ] **Task 4.2**: Accessibility
  - Add ARIA labels
  - Implement keyboard navigation
  - Test with screen readers
  - Add focus management

**Week 8:**
- [ ] **Task 4.3**: Testing
  - Write unit tests for core functions
  - Add integration tests for features
  - Create E2E test suite
  - Set up CI/CD testing

- [ ] **Task 4.4**: Documentation
  - Update README with new features
  - Create user guide
  - Write developer documentation
  - Document API endpoints

## 5. Technical Specifications

### 5.1. File Structure

**Proposed Enhanced Structure:**
```
chevron/
├── backend/
│   ├── server.cjs           # Main server
│   ├── api/
│   │   ├── chat.cjs         # OpenAI proxy
│   │   └── auth.cjs         # API key validation
│   ├── middleware/
│   │   ├── cors.cjs
│   │   ├── rateLimit.cjs
│   │   └── logger.cjs
│   └── .env.template
├── src/
│   ├── api/                 # Backend communication
│   │   ├── chat.js
│   │   └── client.js
│   ├── components/
│   │   ├── common/          # Reusable UI
│   │   ├── layout/          # Layout components
│   │   ├── features/        # Feature components
│   │   └── widgets/         # Widget system
│   ├── contexts/            # React contexts
│   │   ├── Store.jsx
│   │   ├── Settings.jsx
│   │   ├── Theme.jsx
│   │   ├── Wallpaper.jsx
│   │   └── Widgets.jsx
│   ├── hooks/               # Custom hooks
│   │   ├── useSettings.js
│   │   ├── useTheme.js
│   │   ├── useWallpaper.js
│   │   └── useWidget.js
│   ├── lib/                 # Third-party adapters
│   │   └── anori/
│   ├── styles/              # Global styles
│   │   ├── theme.js
│   │   ├── tokens.js
│   │   └── global.css
│   ├── utils/               # Utilities
│   │   ├── storage.js
│   │   ├── validation.js
│   │   └── format.js
│   ├── types/               # TypeScript types (future)
│   └── App.jsx
├── public/
│   ├── wallpapers/          # Default wallpapers
│   └── icons/
└── docs/
    ├── api.md
    ├── widgets.md
    └── customization.md
```

### 5.2. Security Considerations

**API Key Management:**
- NEVER store API keys in client code
- Use environment variables with `.env` file
- Implement API key rotation mechanism
- Add key usage monitoring and alerts

**Input Sanitization:**
- Validate all user inputs on both client and server
- Sanitize queries before sending to AI
- Implement rate limiting per session
- Add CSRF protection for backend endpoints

**XSS Prevention:**
- Sanitize all markdown rendering
- Use DOMPurify for HTML sanitization
- Implement Content Security Policy (CSP)
- Escape user-generated content

**Data Privacy:**
- Keep chat history local only
- Implement data encryption for stored settings
- Add clear data deletion options
- Create privacy policy for API usage

### 5.3. Performance Optimizations

**Code Splitting:**
```javascript
// Lazy load AI component
const AIcompletion = lazy(() => import('./components/AI/AIcompletion'))

// Route-based splitting
const Settings = lazy(() => import('./components/Settings/Settings'))
```

**Lazy Loading:**
- Defer widget loading until needed
- Implement intersection observer for images
- Progressive wallpaper loading
- Defer non-critical scripts

**Memoization:**
```javascript
// Prevent unnecessary re-renders
const MemoizedMessage = memo(Message, (prev, next) =>
  prev.content === next.content && prev.role === next.role
)

// Optimize expensive calculations
const filteredMacros = useMemo(() =>
  macros.filter(m => m.category === selectedCategory),
  [macros, selectedCategory]
)
```

**Bundle Optimization:**
- Tree shake unused dependencies
- Use production builds
- Enable gzip compression
- Implement asset caching strategy

## 6. Customization Framework

### 6.1. Wallpaper and Theme Management

**Wallpaper System:**

```javascript
// WallpaperContext.jsx
const WallpaperContext = createContext()

export function WallpaperProvider({ children }) {
  const [wallpaper, setWallpaper] = useState({
    type: 'image', // 'image' | 'color' | 'gradient' | 'video'
    source: null,
    opacity: 1,
    blur: 0,
    filter: 'none'
  })

  const updateWallpaper = (updates) => {
    setWallpaper(prev => ({ ...prev, ...updates }))
    localStorage.setItem('wallpaper', JSON.stringify({ ...wallpaper, ...updates }))
  }

  return (
    <WallpaperContext.Provider value={{ wallpaper, updateWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  )
}
```

**Enhanced Theme System:**

```javascript
// theme.js - Theme tokens
export const themeTokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  }
}

// Theme presets
export const presets = {
  minimal: { /* minimal theme tokens */ },
  vibrant: { /* vibrant theme tokens */ },
  nature: { /* nature theme tokens */ }
}
```

### 6.2. Shortcut Management

**Data Structure:**
```javascript
// shortcuts.js
const shortcutSchema = {
  id: 'uuid',
  name: 'string',
  url: 'string',
  icon: 'string', // URL or icon identifier
  category: 'string',
  hotkey: 'string?',
  color: 'string',
  order: 'number'
}
```

**CRUD Operations:**
```javascript
// useShortcuts.js
export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState([])

  const addShortcut = (shortcut) => {
    const newShortcut = { ...shortcut, id: generateId() }
    setShortcuts(prev => [...prev, newShortcut])
    saveToStorage([...shortcuts, newShortcut])
  }

  const updateShortcut = (id, updates) => {
    setShortcuts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    saveToStorage(shortcuts.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteShortcut = (id) => {
    setShortcuts(prev => prev.filter(s => s.id !== id))
    saveToStorage(shortcuts.filter(s => s.id !== id))
  }

  return { shortcuts, addShortcut, updateShortcut, deleteShortcut }
}
```

## 7. Widget System Integration

### 7.1. Anori Widget System Analysis

**Anori Directory Structure:**
```
anori-master/
├── src/
│   ├── widgets/         # Widget implementations
│   ├── components/      # Shared components
│   └── utils/          # Widget utilities
```

**Integration Strategy:**

1. **Phase 1: Analysis**
   - Map Anori widget API to Chevron architecture
   - Identify shared dependencies
   - Document widget communication patterns

2. **Phase 2: Adapter Development**
   - Create widget wrapper component
   - Implement state synchronization
   - Build event bridge

3. **Phase 3: Widget Migration**
   - Port high-priority widgets
   - Test integration
   - Optimize performance

4. **Phase 4: Documentation**
   - Create widget development guide
   - Document API differences
   - Provide migration examples

**Widget Communication:**
```javascript
// WidgetBridge.jsx
export function WidgetBridge({ widget, config }) {
  const [state, setState] = useState({})

  // Bridge events from widget to app
  const handleWidgetEvent = (event) => {
    switch (event.type) {
      case 'navigate':
        // Handle navigation
        break
      case 'settings':
        // Open settings
        break
    }
  }

  return (
    <WidgetContainer
      widget={widget}
      config={config}
      state={state}
      onEvent={handleWidgetEvent}
    />
  )
}
```

## 8. Quality Assurance

### 8.1. Testing Strategies

**Unit Tests (Jest + React Testing Library):**
```javascript
// Example: AIcompletion.test.jsx
describe('AIcompletion', () => {
  it('renders markdown response correctly', () => {
    render(<AIcompletion query="test" />)
    // assertions
  })

  it('handles errors gracefully', () => {
    // mock error response
    // verify error UI
  })
})
```

**Integration Tests:**
- Test Settings → Theme → Component flow
- Verify AI query → Backend → Response pipeline
- Test widget lifecycle and state management

**E2E Tests (Cypress/Playwright):**
```javascript
// e2e/ai-chat.spec.js
describe('AI Chat Flow', () => {
  it('completes a full conversation', () => {
    cy.visit('/')
    cy.get('input').type('Hello AI')
    cy.get('input').type(' ') // double space trigger
    cy.get('.ai-response').should('be.visible')
  })
})
```

### 8.2. Compatibility Considerations

**Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Responsive Design:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Performance Targets:**
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: > 90

## 9. Migration and Deployment

### 9.1. Migration Guide

**For Existing Users:**
1. Backup current settings (localStorage export)
2. Update to new version
3. Import settings (automatic migration)
4. Configure new features as needed

**Breaking Changes:**
- API key must be moved to backend `.env`
- Settings structure updated (automatic migration)
- Widget system requires new configuration

### 9.2. Deployment Checklist

**Pre-deployment:**
- [ ] Run full test suite
- [ ] Check bundle size
- [ ] Verify browser compatibility
- [ ] Test migration path
- [ ] Update documentation

**Deployment:**
- [ ] Build production bundle
- [ ] Deploy backend updates
- [ ] Deploy frontend
- [ ] Verify health checks
- [ ] Monitor error rates

**Post-deployment:**
- [ ] Monitor performance metrics
- [ ] Check error logging
- [ ] Gather user feedback
- [ ] Plan next iteration

---

## Appendix

### A. API Reference

**Backend Endpoints:**
```
POST /api/chat/completions
  Body: { messages, temperature }
  Returns: Stream of completion chunks

GET /api/health
  Returns: { status: 'ok', version }
```

### B. Configuration Schema

**Settings Object:**
```javascript
{
  general: {
    tabTitle: string,
    language: string
  },
  query: {
    AI: {
      enabled: boolean,
      temperature: number,
      language: string
    }
  },
  theme: {
    preset: string,
    custom: object
  },
  wallpaper: {
    type: string,
    source: string,
    effects: object
  }
}
```

### C. Development Setup

**Prerequisites:**
- Node.js 16+
- npm 8+

**Setup:**
```bash
git clone https://github.com/sensuslab/chevron.git
cd chevron
npm install
cp backend/.env.template backend/.env
# Edit backend/.env with your API key
npm run dev
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-06
**Status:** Implementation In Progress

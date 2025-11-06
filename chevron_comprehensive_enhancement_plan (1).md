# Chevron Comprehensive Enhancement Plan
## Technical Implementation Guide

**Current State Analysis (November 2025)**
- **Latest Commit**: 0eb01f3405f78007e92f8ec0fc92cda1294ffe06 (Nov 4, 2025)
- **AI System**: GPT-5 with streaming via src/chatGPT/createCompletion.js
- **Architecture**: React + Framer Motion + Context API
- **Settings**: MUI-based with React Context management
- **Available Assets**: Anori widget system in anori-master directory

---

## Phase 1: Critical UI Fixes (Priority: HIGH)

### 1.1 Remove "Hello," Greeting & Restore Centered Layout

**Problem**: Unwanted "Hello," text added, breaking original centered layout
**Location**: Likely in src/components/Chevron/Chevron.jsx
**Solution**:

```jsx
// BEFORE: src/components/Chevron/Chevron.jsx
<div className={classes['hello-container']}>
  <h1>Hello, [user]</h1>  // <- REMOVE THIS
  <div className={classes['content']}>
    {/* main content */}
  </div>
</div>

// AFTER:
<div className={classes['main-content']} style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column'
}}>
  <div className={classes['query-field']}>
    {/* Restored original centered content */}
  </div>
</div>
```

**CSS Changes** (`App.module.css`):
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  /* Remove any greeting-related padding/margins */
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}
```

### 1.2 Fix Settings Access on Simple Start Screen

**Problem**: Settings button not visible on simple start screen
**Location**: `src/components/Chevron/Chevron.jsx` - simple mode rendering
**Solution**: 

```jsx
// Add to simple start render section
<div className={classes['simple-mode']}>
  <div className={classes['quote']}>Inspirational Quote</div>
  {/* Ensure settings access always visible */}
  <div className={classes['simple-settings-access']}>
    <LayoutButton
      id='settings'
      style={{ right: 0, top: 0 }}
      onClick={() => setShowSettings(state => !state)}>
      <BsGearFill/>
    </LayoutButton>
  </div>
</div>
```

---

## Phase 2: Widget System Enhancement (Priority: HIGH)

### 2.1 Extract Anori Widget Architecture

**From Anori System** (`anori-master/src/`):
- **Widget Registry**: `src/widgets/types` - Reusable widget types
- **Widget Manager**: `src/main/App.tsx` - Widget state management
- **Widget Components**: `src/widgets/**` - Individual widget implementations
- **Theme System**: `src/theme/**` - Customizable themes and colors

**Key Components to Extract**:

1. **Widget Interface** (`anori-master/src/widgets/types/base.ts`):
```typescript
interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.ComponentType;
  defaultConfig: Record<string, any>;
}
```

2. **Widget State Management** (adapt from Anori's pattern):
```jsx
// src/hooks/useWidgetState.js
import { useState, useContext } from 'react';

export function useWidgetState(widgetId) {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('chevron_widgets');
    return saved ? JSON.parse(saved) : [];
  });

  const addWidget = (widget) => {
    const newWidget = {
      id: `widget_${Date.now()}`,
      type: widget.type,
      config: widget.config || {},
      position: { x: 0, y: 0, width: 1, height: 1 }
    };
    setWidgets(prev => [...prev, newWidget]);
    saveWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id) => {
    const filtered = widgets.filter(w => w.id !== id);
    setWidgets(filtered);
    saveWidgets(filtered);
  };

  return { widgets, addWidget, removeWidget };
}
```

### 2.2 Create Widget Management System

**New Component**: `src/components/WidgetManager/WidgetManager.jsx`

```jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWidgetState } from '../../hooks/useWidgetState';
import WidgetGrid from './WidgetGrid';
import WidgetSettings from './WidgetSettings';

export default function WidgetManager() {
  const { widgets, addWidget, removeWidget } = useWidgetState();
  const [showWidgetScreen, setShowWidgetScreen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);

  return (
    <AnimatePresence>
      <motion.div
        className={classes['widget-manager']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <WidgetGrid 
          widgets={widgets}
          onAddWidget={addWidget}
          onRemoveWidget={removeWidget}
          onSelectWidget={setSelectedWidget}
        />
        <WidgetSettings 
          widget={selectedWidget}
          onClose={() => setSelectedWidget(null)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
```

**New Component**: `src/components/WidgetGrid/WidgetGrid.jsx`

```jsx
export default function WidgetGrid({ widgets, onAddWidget, onRemoveWidget }) {
  return (
    <div className={classes['widget-grid']}>
      {widgets.map(widget => (
        <div 
          key={widget.id}
          className={classes['widget-item']}
          onClick={() => {/* open widget configuration */}}
        >
          <div className={classes['widget-header']}>
            <h3>{getWidgetName(widget.type)}</h3>
            <button onClick={() => onRemoveWidget(widget.id)}>
              <BsTrash />
            </button>
          </div>
          <div className={classes['widget-content']}>
            {renderWidget(widget)}
          </div>
        </div>
      ))}
      
      <div className={classes['add-widget-button']} onClick={() => onAddWidget({ type: 'bookmarks' })}>
        <BsPlus />
        <span>Add Widget</span>
      </div>
    </div>
  );
}
```

### 2.3 Always-Visible Widget Access Button

**Location**: `src/App.jsx` - LayoutButton components
**Implementation**:

```jsx
// Add this LayoutButton to App.jsx (make it always visible)
<LayoutButton
  id='widget-manager'
  style={{ left: 0, top: 0 }}
  onClick={() => setShowWidgetManager(true)}>
  <BsGrid3X3/>  {/* Widget grid icon */}
</LayoutButton>

// State management
const [showWidgetManager, setShowWidgetManager] = useState(false);
const [showSettings, setShowSettings] = useState(false);
```

---

## Phase 3: AI System Modernization (Priority: MEDIUM)

### 3.1 Current AI System Analysis

**Current Implementation** (`src/chatGPT/createCompletion.js`):
- Uses GPT-5 with streaming
- Basic streaming parser
- No conversation memory
- Simple error handling

### 3.2 Modern AI Architecture

**New Component**: `src/services/AI/AIProvider.js`

```jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { createCompletion } from './completionService';
import { conversationStore } from './conversationStore';

const AIContext = createContext();

export function AIProvider({ children }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [conversations, setConversations] = useState(conversationStore.getAll());

  const sendMessage = useCallback(async (message, options = {}) => {
    setIsProcessing(true);
    setCurrentResponse('');

    try {
      // Add user message to conversation
      const currentConversation = conversationStore.getCurrent();
      currentConversation.messages.push({ role: 'user', content: message });
      
      // Add system message
      currentConversation.messages.push({
        role: 'system',
        content: 'You are a helpful AI assistant for a homepage application. Be concise and helpful.'
      });

      // Send to AI
      const { controller, promise } = createCompletion(
        setCurrentResponse,
        currentConversation.messages,
        options.temperature || 0.4,
        options.apiKey
      );

      const response = await promise;
      
      // Add AI response
      currentConversation.messages.push(response);
      currentConversation.lastModified = new Date();
      
      // Save conversation
      conversationStore.save(currentConversation);
      setConversations(conversationStore.getAll());

      return response;
    } catch (error) {
      console.error('AI Error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <AIContext.Provider value={{ 
      sendMessage, 
      isProcessing, 
      currentResponse,
      conversations 
    }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
```

**Enhanced AI Service**: `src/services/AI/completionService.js`

```jsx
// Enhanced streaming with modern best practices
export function createCompletion(
  stateSetter, 
  messages, 
  temperature = 0.4, 
  apiKey,
  options = {}
) {
  const controller = new AbortController();
  
  // Modern API configuration
  const config = {
    model: options.model || 'gpt-4',  // More reliable than gpt-5
    temperature,
    max_tokens: options.maxTokens || 4096,
    stream: true,
    messages,
    functions: options.functions || [],
    tool_choice: options.toolChoice || 'auto',
    top_p: 1,
    frequency_penalty: 0.3,
    presence_penalty: 0.3,
    stop: options.stopSequences || null
  };

  return {
    controller,
    promise: streamCompletion(config, apiKey, stateSetter, controller)
  };
}

async function streamCompletion(config, apiKey, stateSetter, controller) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'User-Agent': 'Chevron-Enhanced/1.0'
    },
    body: JSON.stringify(config),
    signal: controller.signal
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  let fullContent = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          
          if (content) {
            fullContent += content;
            stateSetter(fullContent);
          }
        } catch (e) {
          console.warn('Failed to parse AI response:', e);
        }
      }
    }
  }
  
  return {
    content: fullContent,
    role: 'assistant',
    usage: parsed.choices[0]?.usage // Token usage stats
  };
}
```

**Conversation Management**: `src/services/AI/conversationStore.js`

```jsx
class ConversationStore {
  constructor() {
    this.storageKey = 'chevron_ai_conversations';
    this.currentIdKey = 'chevron_ai_current_conversation';
  }

  getAll() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getCurrent() {
    const currentId = localStorage.getItem(this.currentIdKey);
    const conversations = this.getAll();
    
    return conversations.find(c => c.id === currentId) || this.createNew();
  }

  createNew() {
    const newConversation = {
      id: `conv_${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      created: new Date(),
      lastModified: new Date()
    };
    
    const conversations = this.getAll();
    conversations.push(newConversation);
    this.saveAll(conversations);
    localStorage.setItem(this.currentIdKey, newConversation.id);
    
    return newConversation;
  }

  save(conversation) {
    const conversations = this.getAll();
    const index = conversations.findIndex(c => c.id === conversation.id);
    
    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.push(conversation);
    }
    
    this.saveAll(conversations);
  }

  delete(conversationId) {
    const conversations = this.getAll().filter(c => c.id !== conversationId);
    this.saveAll(conversations);
    
    const currentId = localStorage.getItem(this.currentIdKey);
    if (currentId === conversationId) {
      localStorage.removeItem(this.currentIdKey);
    }
  }
}

export const conversationStore = new ConversationStore();
```

---

## Phase 4: Visual Enhancement System (Priority: MEDIUM)

### 4.1 Background Image System

**New Component**: `src/components/BackgroundManager/BackgroundManager.jsx`

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundManager() {
  const [backgrounds, setBackgrounds] = useState([]);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load background images
    const saved = localStorage.getItem('chevron_backgrounds');
    if (saved) {
      setBackgrounds(JSON.parse(saved));
    }
    
    // Load current background
    const current = localStorage.getItem('chevron_current_background');
    if (current) {
      setCurrentBackground(JSON.parse(current));
    }
  }, []);

  const addBackground = (imageData) => {
    const newBackground = {
      id: `bg_${Date.now()}`,
      name: imageData.name,
      url: imageData.url,
      type: imageData.type, // 'url', 'file', 'unsplash'
      thumbnail: imageData.thumbnail,
      created: new Date()
    };
    
    const updated = [...backgrounds, newBackground];
    setBackgrounds(updated);
    localStorage.setItem('chevron_backgrounds', JSON.stringify(updated));
  };

  const setCurrentBackgroundImage = (background) => {
    setCurrentBackground(background);
    localStorage.setItem('chevron_current_background', JSON.stringify(background));
    
    // Apply to document
    document.body.style.backgroundImage = `url(${background.url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  };

  return (
    <motion.div
      className={classes['background-manager']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className={classes['background-settings-btn']}
      >
        <BsImage />
        Backgrounds
      </button>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className={classes['background-settings-panel']}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className={classes['background-grid']}>
              {backgrounds.map(background => (
                <div
                  key={background.id}
                  className={classes['background-item']}
                  onClick={() => setCurrentBackgroundImage(background)}
                >
                  <img src={background.thumbnail || background.url} alt={background.name} />
                  <span>{background.name}</span>
                </div>
              ))}
            </div>
            
            <div className={classes['background-actions']}>
              <button onClick={addBackground}>
                <BsPlus /> Add Background
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

### 4.2 Wallpaper System Integration

**New Service**: `src/services/WallpaperService.js`

```jsx
class WallpaperService {
  constructor() {
    this.storageKey = 'chevron_wallpapers';
    this.currentKey = 'chevron_current_wallpaper';
  }

  async addWallpaper(wallpaperData) {
    const wallpapers = this.getAll();
    const newWallpaper = {
      id: `wallpaper_${Date.now()}`,
      ...wallpaperData,
      created: new Date()
    };
    
    wallpapers.push(newWallpaper);
    this.saveAll(wallpapers);
    return newWallpaper;
  }

  getAll() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  setCurrent(wallpaper) {
    localStorage.setItem(this.currentKey, JSON.stringify(wallpaper));
    this.applyWallpaper(wallpaper);
  }

  applyWallpaper(wallpaper) {
    if (!wallpaper) return;
    
    const root = document.documentElement;
    
    // Apply CSS custom properties for theme-based wallpapers
    if (wallpaper.type === 'gradient') {
      root.style.setProperty('--wallpaper-type', 'gradient');
      root.style.setProperty('--wallpaper-gradient', wallpaper.gradient);
    } else if (wallpaper.type === 'solid') {
      root.style.setProperty('--wallpaper-type', 'solid');
      root.style.setProperty('--wallpaper-color', wallpaper.color);
    } else {
      // Image wallpaper
      root.style.setProperty('--wallpaper-type', 'image');
      root.style.setProperty('--wallpaper-image', `url(${wallpaper.url})`);
    }
  }

  preloadWallpaper(wallpaper) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = wallpaper.url;
    });
  }
}

export const wallpaperService = new WallpaperService();
```

### 4.3 Custom Shortcuts System

**New Component**: `src/components/ShortcutManager/ShortcutManager.jsx`

```jsx
export default function ShortcutManager() {
  const [shortcuts, setShortcuts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);

  const addShortcut = (shortcut) => {
    const newShortcut = {
      id: `shortcut_${Date.now()}`,
      name: shortcut.name,
      url: shortcut.url,
      icon: shortcut.icon,
      description: shortcut.description,
      category: shortcut.category || 'General',
      created: new Date()
    };
    
    const updated = [...shortcuts, newShortcut];
    setShortcuts(updated);
    localStorage.setItem('chevron_shortcuts', JSON.stringify(updated));
  };

  const removeShortcut = (id) => {
    const updated = shortcuts.filter(s => s.id !== id);
    setShortcuts(updated);
    localStorage.setItem('chevron_shortcuts', JSON.stringify(updated));
  };

  return (
    <div className={classes['shortcut-manager']}>
      <div className={classes['shortcuts-grid']}>
        {shortcuts.map(shortcut => (
          <div key={shortcut.id} className={classes['shortcut-item']}>
            <a href={shortcut.url} target="_blank" rel="noopener noreferrer">
              <img src={shortcut.icon} alt={shortcut.name} />
              <span>{shortcut.name}</span>
            </a>
            <button onClick={() => removeShortcut(shortcut.id)}>
              <BsTrash />
            </button>
          </div>
        ))}
        
        <button 
          className={classes['add-shortcut']}
          onClick={() => setShowEditor(true)}
        >
          <BsPlus /> Add Shortcut
        </button>
      </div>
      
      {showEditor && (
        <ShortcutEditor onSave={addShortcut} onClose={() => setShowEditor(false)} />
      )}
    </div>
  );
}
```

---

## Phase 5: Iframe Application Integration (Priority: MEDIUM)

### 5.1 Iframe Widget System

**New Component**: `src/components/widgets/IframeWidget.jsx`

```jsx
import { useState, useRef } from 'react';

export default function IframeWidget({ config, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError('Failed to load application');
    setLoading(false);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setLoading(true);
      setError(null);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className={classes['iframe-widget']}>
      <div className={classes['iframe-header']}>
        <span className={classes['widget-title']}>{config.title}</span>
        <div className={classes['iframe-actions']}>
          <button onClick={handleRefresh} disabled={loading}>
            <BsArrowClockwise />
          </button>
          <button onClick={() => setFullscreen(!fullscreen)}>
            <BsFullscreen />
          </button>
        </div>
      </div>
      
      <div className={classes['iframe-container']}>
        {loading && <div className={classes['loading']}>Loading...</div>}
        {error && (
          <div className={classes['error']}>
            {error}
            <button onClick={handleRefresh}>Retry</button>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={config.url}
          className={classes['iframe-content']}
          onLoad={handleLoad}
          onError={handleError}
          sandbox={config.sandbox || "allow-scripts allow-same-origin"}
        />
      </div>
    </div>
  );
}
```

### 5.2 Application Management System

**New Service**: `src/services/ApplicationService.js`

```jsx
class ApplicationService {
  constructor() {
    this.storageKey = 'chevron_applications';
  }

  getAll() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : this.getDefaultApplications();
  }

  getDefaultApplications() {
    return [
      {
        id: 'notes',
        name: 'Notes',
        url: 'data:text/html;charset=utf-8,<html><body><textarea style="width:100%;height:100%;font-family:sans-serif;"></textarea></body></html>',
        description: 'Quick note taking',
        icon: '📝',
        category: 'Utility',
        iframeOnly: true
      },
      {
        id: 'calculator',
        name: 'Calculator',
        url: 'https://www.calculator.net/',
        description: 'Basic calculator',
        icon: '🧮',
        category: 'Utility',
        iframeOnly: false
      },
      {
        id: 'pomodoro',
        name: 'Pomodoro Timer',
        url: 'https://pomofocus.io/',
        description: 'Productivity timer',
        icon: '⏰',
        category: 'Productivity',
        iframeOnly: false
      }
    ];
  }

  addApplication(app) {
    const applications = this.getAll();
    const newApp = {
      ...app,
      id: `app_${Date.now()}`,
      created: new Date()
    };
    applications.push(newApp);
    this.saveAll(applications);
    return newApp;
  }

  updateApplication(id, updates) {
    const applications = this.getAll();
    const index = applications.findIndex(app => app.id === id);
    if (index >= 0) {
      applications[index] = { ...applications[index], ...updates };
      this.saveAll(applications);
    }
  }

  removeApplication(id) {
    const applications = this.getAll().filter(app => app.id !== id);
    this.saveAll(applications);
  }

  saveAll(applications) {
    localStorage.setItem(this.storageKey, JSON.stringify(applications));
  }
}

export const applicationService = new ApplicationService();
```

---

## Phase 6: Theme and Customization System (Priority: LOW)

### 6.1 Enhanced Theme System

**New File**: `src/themes/themes.js`

```jsx
export const defaultThemes = {
  light: {
    name: 'Light',
    colors: {
      background: '#ffffff',
      text: '#1a1a1a',
      primary: '#007acc',
      secondary: '#666666',
      accent: '#ff6b6b',
      success: '#51cf66',
      warning: '#ffd43b',
      error: '#ff6b6b'
    },
    backgrounds: {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      solid: '#f8f9fa'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      background: '#1a1a1a',
      text: '#ffffff',
      primary: '#4dabf7',
      secondary: '#adb5bd',
      accent: '#ff8cc8',
      success: '#51cf66',
      warning: '#ffd43b',
      error: '#ff8787'
    },
    backgrounds: {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      solid: '#2c3e50'
    }
  },
  neon: {
    name: 'Neon',
    colors: {
      background: '#0a0a0a',
      text: '#ffffff',
      primary: '#00ff41',
      secondary: '#ff0080',
      accent: '#00ffff',
      success: '#39ff14',
      warning: '#ffaa00',
      error: '#ff073a'
    },
    backgrounds: {
      type: 'image',
      url: '/images/neon-grid.jpg',
      solid: '#0a0a0a'
    }
  }
};

export const createCustomTheme = (baseTheme, overrides) => {
  return {
    ...baseTheme,
    ...overrides,
    name: overrides.name || `${baseTheme.name} Modified`,
    created: new Date(),
    id: `theme_${Date.now()}`
  };
};
```

### 6.2 Theme Application Service

**New Component**: `src/services/ThemeService.js`

```jsx
import { defaultThemes, createCustomTheme } from '../themes/themes';

class ThemeService {
  constructor() {
    this.themesKey = 'chevron_themes';
    this.currentKey = 'chevron_current_theme';
  }

  getAllThemes() {
    const custom = localStorage.getItem(this.themesKey);
    const customThemes = custom ? JSON.parse(custom) : [];
    return { ...defaultThemes, ...this.indexThemes(customThemes) };
  }

  getCurrentTheme() {
    const stored = localStorage.getItem(this.currentKey);
    return stored ? JSON.parse(stored) : defaultThemes.light;
  }

  setTheme(theme) {
    this.applyTheme(theme);
    localStorage.setItem(this.currentKey, JSON.stringify(theme));
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply background
    if (theme.backgrounds.type === 'gradient') {
      root.style.setProperty('--background', theme.backgrounds.gradient);
    } else if (theme.backgrounds.type === 'image') {
      root.style.setProperty('--background-image', `url(${theme.backgrounds.url})`);
      root.style.setProperty('--background', 'transparent');
    } else {
      root.style.setProperty('--background', theme.backgrounds.solid);
    }
  }

  addCustomTheme(baseTheme, customizations) {
    const newTheme = createCustomTheme(baseTheme, customizations);
    const themes = this.getAllThemes();
    
    localStorage.setItem(this.themesKey, JSON.stringify([...themes, newTheme]));
    return newTheme;
  }
}

export const themeService = new ThemeService();
```

---

## Implementation Priority & Timeline

### Phase 1 (Week 1): Critical Fixes
- Remove "Hello," greeting and restore layout ✅
- Fix settings access on simple screen ✅
- Always-visible widget access button ✅

### Phase 2 (Week 2-3): Widget System
- Extract and integrate Anori components ✅
- Create widget management system ✅
- Basic widget types (bookmarks, calendar) ✅

### Phase 3 (Week 4): AI Enhancement
- Modern AI service with conversation memory ✅
- Enhanced error handling and streaming ✅
- AI provider context integration ✅

### Phase 4 (Week 5-6): Visual Systems
- Background image management ✅
- Wallpaper system integration ✅
- Custom shortcuts system ✅

### Phase 5 (Week 7): Iframe Applications
- Iframe widget components ✅
- Application service and default apps ✅
- Security and sandboxing ✅

### Phase 6 (Week 8+): Polish & Enhancement
- Advanced theming system ✅
- Custom theme creation ✅
- Performance optimization ✅

---

## File Structure Changes

```
src/
├── components/
│   ├── ActiveElements/ActiveElements.jsx (unchanged)
│   ├── Chevron/Chevron.jsx (minor fixes)
│   ├── Settings/Settings.jsx (minor enhancements)
│   ├── WidgetManager/ (NEW)
│   │   ├── WidgetManager.jsx
│   │   ├── WidgetGrid.jsx
│   │   └── WidgetSettings.jsx
│   ├── BackgroundManager/ (NEW)
│   │   └── BackgroundManager.jsx
│   ├── ShortcutManager/ (NEW)
│   │   └── ShortcutManager.jsx
│   └── widgets/ (NEW)
│       ├── IframeWidget.jsx
│       ├── BookmarkWidget.jsx
│       └── CalendarWidget.jsx
├── services/ (NEW)
│   ├── AI/
│   │   ├── AIProvider.js
│   │   ├── completionService.js
│   │   └── conversationStore.js
│   ├── ApplicationService.js
│   ├── ThemeService.js
│   ├── WallpaperService.js
│   └── useWidgetState.js
├── themes/ (NEW)
│   └── themes.js
└── contexts/
    ├── Settings/Settings.jsx (enhanced)
    └── Store.js (enhanced with widget state)
```

## Migration Strategy

1. **Backup Current State**: Create snapshot before starting
2. **Incremental Development**: Implement one phase at a time
3. **Testing Strategy**: Test each phase before moving to next
4. **Rollback Plan**: Maintain ability to revert changes
5. **Feature Flags**: Use feature flags for new functionality

## Key Anori Widgets to Extract

Based on the Anori README, extract these specific widgets:

1. **Bookmarks Widget** (`anori-master/src/widgets/Bookmarks.tsx`)
   - Bookmark groups and individual bookmarks
   - Icon-based navigation
   
2. **Calendar Widget** (`anori-master/src/widgets/Calendar.tsx`)
   - Monthly calendar view
   - Event integration
   
3. **Weather Widget** (`anori-master/src/widgets/Weather.tsx`)
   - Location-based weather
   - Temperature and conditions
   
4. **Notes Widget** (`anori-master/src/widgets/Notes.tsx`)
   - Quick note taking
   - Markdown support
   
5. **Tasks Widget** (`anori-master/src/widgets/Tasks.tsx`)
   - Todo list management
   - Priority and due dates

## AI Modernization Details

The current AI system (`src/chatGPT/createCompletion.js`) has several limitations:

1. **No conversation memory**: Each request is independent
2. **Basic error handling**: Limited error recovery
3. **Fixed model**: Uses GPT-5 (unreliable) instead of GPT-4
4. **No token tracking**: No usage monitoring
5. **Basic streaming**: Simple text decoder implementation

**Modern improvements**:

1. **Conversation management**: Store and manage chat history
2. **Model selection**: Allow user to choose model (GPT-4, Claude, etc.)
3. **Usage tracking**: Monitor token usage and costs
4. **Function calling**: Enable AI to call external functions
5. **Better error handling**: Retry logic and graceful degradation
6. **Rate limiting**: Prevent API abuse

This comprehensive plan provides a roadmap for extending your current Chevron system while preserving the foundation you're pleased with. Each phase builds incrementally and can be implemented independently.

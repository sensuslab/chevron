# Two-Mode Customization System

A next-generation start page extension featuring dual interface modes and a powerful widget system.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.2.0-green.svg)

## 🌟 Overview

This implementation extends the Chevron start page with a comprehensive two-mode system that caters to different user preferences:

- **Simple Start**: A minimalist, search-focused interface inspired by Mue
- **Bold Start**: A command-driven power user interface (enhanced Chevron)
- **Widget System**: A flexible, grid-based dashboard with customizable widgets

## ✨ Features

### 🎨 Two Distinct Modes

#### Simple Start
- Clean, centered search interface
- Custom wallpaper support (Unsplash, custom URL, or solid color)
- Inspirational quote display
- Distraction-free design
- Perfect for users who prefer minimalism

#### Bold Start
- Command palette with AI integration
- "Hello," greeting display
- Full macro system support
- All existing Chevron features preserved
- Ideal for power users

### 🧩 Widget System

#### Available Widgets

1. **Clock Widget**
   - Real-time clock display
   - Full date information
   - No permissions required

2. **Notes Widget**
   - Quick note-taking
   - Auto-save to local storage
   - Simple textarea interface

3. **Bookmarks Widget**
   - Browser bookmarks integration
   - On-demand permission request
   - Favicon display
   - Click to open in new tab

4. **Weather Widget**
   - Current weather conditions
   - Temperature, humidity, wind speed
   - Location-based via geolocation
   - Requires OpenWeatherMap API key

#### Widget Features
- Grid-based layout system
- Persistent configuration
- Individual widget settings
- Permission management
- Easy to extend

### 🎯 Key Capabilities

- **Seamless Mode Switching**: Toggle between Simple and Bold modes instantly
- **Universal Widget Access**: Widget panel accessible from both modes
- **State Persistence**: All settings and layouts saved to local storage
- **Smooth Animations**: Framer Motion powered transitions
- **Theme Support**: Respects existing Chevron theme system
- **Privacy First**: Permissions requested only when needed

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sensuslab/chevron.git
cd chevron

# Checkout the feature branch
git checkout claude/two-mode-customization-system-011CUoTu5gPNnCLb5NFTSd33

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Output will be in dist/ directory
```

## 📖 Usage Guide

### Switching Modes

1. Click the **Settings** button (gear icon, top-right corner)
2. At the top of the settings panel, you'll see the **"Start Mode"** selector
3. Choose between **Simple Start** or **Bold Start**
4. The mode change takes effect immediately

### Using Widgets

1. Click the **Widget Panel** button (grid icon, top-left corner)
2. The widget overlay will appear showing all active widgets
3. Interact with widgets as needed:
   - **Clock**: View current time and date
   - **Notes**: Type and auto-save notes
   - **Bookmarks**: Click to open bookmarks (grant permission if prompted)
   - **Weather**: View current weather (set API key in Settings first)
4. Close panel with **X** button or click outside

### Configuring Weather Widget

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Open Settings → Query → AI section
3. Add your weather API key
4. The Weather widget will now display your local weather

### Customizing Simple Start

Simple Start wallpaper and quote settings are configured via the atoms in `src/store/atoms.js`. Future versions will include a UI for these settings.

**Current options:**
```javascript
// Wallpaper types: 'unsplash', 'custom', 'color'
// Unsplash categories: 'nature', 'city', 'space', etc.
```

## 🏗️ Architecture

### Directory Structure

```
src/
├── store/
│   └── atoms.js                    # Jotai state management
├── features/
│   ├── simple-start/               # Simple Start mode
│   │   ├── SimpleStart.jsx
│   │   └── SimpleStart.module.css
│   └── bold-start/                 # Bold Start mode
│       ├── BoldStart.jsx
│       └── BoldStart.module.css
├── widgets/
│   ├── registry.js                 # Widget registry
│   ├── Clock/
│   ├── Notes/
│   ├── Bookmarks/
│   └── Weather/
├── components/
│   ├── WidgetPanel/                # Widget overlay
│   └── Settings/
│       └── ModeSelector/           # Mode selection UI
├── lib/
│   └── permissions.js              # Permission utilities
└── App.jsx                         # Main app with mode switching
```

### State Management

The application uses **Jotai** for state management with the following atoms:

- `currentModeAtom` - Current mode ('simple' | 'bold')
- `widgetPanelVisibleAtom` - Widget panel visibility
- `activeWidgetsAtom` - List of active widget IDs
- `widgetLayoutAtom` - Widget grid layout configuration
- `wallpaperSettingsAtom` - Simple Start wallpaper settings
- `quoteSettingsAtom` - Simple Start quote settings
- `apiKeysAtom` - API keys for integrations

### Widget Plugin System

Each widget exports a configuration object:

```javascript
export default {
  id: 'widget-id',
  name: 'Widget Name',
  description: 'Widget description',
  component: WidgetComponent,
  defaultLayout: { w: 2, h: 1 },
  requiredPermissions: ['permission']
};
```

## 🛠️ Development

### Adding a New Widget

1. Create widget directory: `src/widgets/MyWidget/`
2. Create widget component: `MyWidget.jsx`
3. Create widget styles: `MyWidget.module.css`
4. Create widget definition: `index.js`
5. Register in `src/widgets/registry.js`
6. Add to default active widgets in `src/store/atoms.js`

**Example:**

```javascript
// src/widgets/MyWidget/MyWidget.jsx
export default function MyWidget() {
  return (
    <div className={styles.widget}>
      <h3>My Widget</h3>
    </div>
  );
}

// src/widgets/MyWidget/index.js
import MyWidget from './MyWidget';

export default {
  id: 'my-widget',
  name: 'My Widget',
  description: 'My custom widget',
  component: MyWidget,
  defaultLayout: { w: 2, h: 2 },
  requiredPermissions: []
};
```

### Permission Handling

Use the permission utilities from `src/lib/permissions.js`:

```javascript
import { hasPermission, requestPermission } from '../../lib/permissions';

// Check permission
const hasAccess = await hasPermission('bookmarks');

// Request permission
const granted = await requestPermission('bookmarks');
```

### Styling Widgets

Widgets inherit theme variables from the main app:

```css
.widget {
  background: var(--background, rgba(255, 255, 255, 0.05));
  color: var(--text-primary, #ffffff);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
```

## 🎨 Theming

The system respects Chevron's existing theme configuration. Themes are managed in:

- `settings/settings.js` - Theme definitions
- Supports light/dark modes
- Custom color schemes
- Theme variables accessible via `var(--variable-name)`

## 🔒 Privacy & Permissions

### Permission Strategy

- **On-Demand Only**: Permissions requested only when widget is used
- **User Control**: Clear permission prompts with explanations
- **Optional**: All permissioned widgets are optional
- **No Data Collection**: All data stays local

### Required Permissions

- **Bookmarks Widget**: `bookmarks` permission
- **Weather Widget**: Browser geolocation API (no extension permission)

## 📦 Dependencies

### Added Dependencies

```json
{
  "jotai": "^latest",
  "@dnd-kit/core": "^latest",
  "@dnd-kit/sortable": "^latest",
  "@dnd-kit/utilities": "^latest"
}
```

### Existing Dependencies (Preserved)

- React 18.2.0
- Vite 3.2.4
- Framer Motion 7.8.0
- MUI Joy
- And all original Chevron dependencies

## 🗺️ Roadmap

### Phase 2 (In Progress)
- ✅ Bookmarks widget
- ✅ Weather widget
- ⏳ Command palette widget commands
- ⏳ Universal AI trigger for Simple Start

### Phase 3 (Planned)
- Full drag-and-drop grid implementation
- Widget configuration UI in Settings
- Additional widgets (Tasks, Calendar, RSS)
- Quote API integration

### Phase 4 (Planned)
- Multi-browser build system
- Manifest V3 packaging
- Chrome Web Store submission
- Firefox Add-ons submission

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow existing code style
4. Test thoroughly
5. Submit a pull request

### Widget Contributions

We're especially interested in new widget implementations! See "Adding a New Widget" above.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

Based on [Chevron](https://github.com/kholmogorov27/chevron) by kholmogorov27 (MIT License)

## 🙏 Acknowledgments

- **Chevron**: Foundation and command palette system
- **Mue**: Design inspiration for Simple Start mode
- **Anori**: Widget system architecture reference
- **OpenWeatherMap**: Weather data API
- **Unsplash**: Wallpaper images

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation
- Review the implementation status document

## 🔗 Links

- [Chevron Original](https://github.com/kholmogorov27/chevron)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [OpenWeatherMap API](https://openweathermap.org/api)

---

**Built with ❤️ by the Chevron community**

*Last Updated: November 4, 2025*

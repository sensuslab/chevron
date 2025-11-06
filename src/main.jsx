import React from 'react'
import ReactDOM from 'react-dom/client'
import SettingsProvider from './contexts/Settings'
import { StoreProvider } from './contexts/Store'
import { WallpaperProvider } from './contexts/Wallpaper'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <WallpaperProvider>
        <StoreProvider>
          <App/>
        </StoreProvider>
      </WallpaperProvider>
    </SettingsProvider>
  </React.StrictMode>
)

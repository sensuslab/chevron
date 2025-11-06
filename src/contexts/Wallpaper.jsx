import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Wallpaper Context
 *
 * Manages wallpaper state including images, colors, gradients, and effects
 */

const WallpaperContext = createContext(null)
const SetWallpaperContext = createContext(null)

const DEFAULT_WALLPAPER = {
  type: 'color', // 'color' | 'gradient' | 'image' | 'video'
  color: '#1a1a1a',
  gradient: {
    type: 'linear',
    angle: 135,
    colors: ['#667eea', '#764ba2']
  },
  image: {
    source: null,
    fit: 'cover', // 'cover' | 'contain' | 'fill'
    position: 'center'
  },
  effects: {
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1
  }
}

export function WallpaperProvider({ children }) {
  const [wallpaper, setWallpaperState] = useState(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem('chevron-wallpaper')
      return stored ? { ...DEFAULT_WALLPAPER, ...JSON.parse(stored) } : DEFAULT_WALLPAPER
    } catch (error) {
      console.error('Failed to load wallpaper from localStorage:', error)
      return DEFAULT_WALLPAPER
    }
  })

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chevron-wallpaper', JSON.stringify(wallpaper))
    } catch (error) {
      console.error('Failed to save wallpaper to localStorage:', error)
    }
  }, [wallpaper])

  const setWallpaper = (updates) => {
    setWallpaperState(prev => ({ ...prev, ...updates }))
  }

  return (
    <WallpaperContext.Provider value={wallpaper}>
      <SetWallpaperContext.Provider value={setWallpaper}>
        {children}
      </SetWallpaperContext.Provider>
    </WallpaperContext.Provider>
  )
}

export function useWallpaper() {
  const context = useContext(WallpaperContext)
  if (context === null) {
    throw new Error('useWallpaper must be used within WallpaperProvider')
  }
  return context
}

export function useSetWallpaper() {
  const context = useContext(SetWallpaperContext)
  if (context === null) {
    throw new Error('useSetWallpaper must be used within WallpaperProvider')
  }
  return context
}

export { WallpaperContext, SetWallpaperContext }

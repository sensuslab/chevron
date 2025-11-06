import { useState, useCallback } from 'react'
import { useSetWallpaper } from '../contexts/Wallpaper'

/**
 * Hook for handling wallpaper uploads and management
 */
export function useWallpaperUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const setWallpaper = useSetWallpaper()

  /**
   * Upload an image file and set it as wallpaper
   */
  const uploadImage = useCallback((file) => {
    setUploading(true)
    setError(null)

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      setUploading(false)
      return
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 10MB')
      setUploading(false)
      return
    }

    // Read file
    const reader = new FileReader()

    reader.onload = (e) => {
      const dataUrl = e.target.result

      // Store in localStorage (if it fits)
      try {
        setWallpaper({
          type: 'image',
          image: {
            source: dataUrl,
            fit: 'cover',
            position: 'center'
          }
        })
        setUploading(false)
      } catch (error) {
        console.error('Failed to save wallpaper:', error)
        setError('Failed to save wallpaper. File might be too large.')
        setUploading(false)
      }
    }

    reader.onerror = () => {
      setError('Failed to read file')
      setUploading(false)
    }

    reader.readAsDataURL(file)
  }, [setWallpaper])

  /**
   * Set a solid color wallpaper
   */
  const setColor = useCallback((color) => {
    setWallpaper({
      type: 'color',
      color
    })
  }, [setWallpaper])

  /**
   * Set a gradient wallpaper
   */
  const setGradient = useCallback((type, angle, colors) => {
    setWallpaper({
      type: 'gradient',
      gradient: {
        type,
        angle,
        colors
      }
    })
  }, [setWallpaper])

  /**
   * Update wallpaper effects
   */
  const updateEffects = useCallback((effects) => {
    setWallpaper({ effects })
  }, [setWallpaper])

  /**
   * Reset to default wallpaper
   */
  const reset = useCallback(() => {
    setWallpaper({
      type: 'color',
      color: '#1a1a1a',
      effects: {
        opacity: 1,
        blur: 0,
        brightness: 1,
        contrast: 1,
        saturation: 1
      }
    })
  }, [setWallpaper])

  return {
    uploading,
    error,
    uploadImage,
    setColor,
    setGradient,
    updateEffects,
    reset
  }
}

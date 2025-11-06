import { useWallpaper } from '../../contexts/Wallpaper'
import classes from './Wallpaper.module.css'

/**
 * Wallpaper Component
 *
 * Renders the background wallpaper with various types and effects
 */
function Wallpaper() {
  const wallpaper = useWallpaper()

  const getBackgroundStyle = () => {
    const { type, color, gradient, image, effects } = wallpaper

    let background = ''

    switch (type) {
      case 'color':
        background = color
        break

      case 'gradient': {
        const { type: gradType, angle, colors } = gradient
        if (gradType === 'linear') {
          background = `linear-gradient(${angle}deg, ${colors.join(', ')})`
        } else if (gradType === 'radial') {
          background = `radial-gradient(circle, ${colors.join(', ')})`
        }
        break
      }

      case 'image':
        if (image.source) {
          background = `url(${image.source})`
        } else {
          background = color // Fallback to color
        }
        break

      case 'video':
        // Video will be handled separately with <video> element
        background = color
        break

      default:
        background = color
    }

    return {
      background,
      backgroundSize: type === 'image' ? image.fit : undefined,
      backgroundPosition: type === 'image' ? image.position : undefined,
      backgroundRepeat: type === 'image' ? 'no-repeat' : undefined,
      opacity: effects.opacity,
      filter: `
        blur(${effects.blur}px)
        brightness(${effects.brightness})
        contrast(${effects.contrast})
        saturate(${effects.saturation})
      `.trim()
    }
  }

  return (
    <>
      <div className={classes.wallpaper} style={getBackgroundStyle()} />
      {wallpaper.type === 'video' && wallpaper.image.source && (
        <video
          className={classes.wallpaperVideo}
          src={wallpaper.image.source}
          autoPlay
          loop
          muted
          playsInline
          style={{
            opacity: wallpaper.effects.opacity,
            filter: `
              blur(${wallpaper.effects.blur}px)
              brightness(${wallpaper.effects.brightness})
              contrast(${wallpaper.effects.contrast})
              saturate(${wallpaper.effects.saturation})
            `.trim()
          }}
        />
      )}
    </>
  )
}

export default Wallpaper

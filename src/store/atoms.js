import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Mode atom - stores current mode ('simple' or 'bold')
export const currentModeAtom = atomWithStorage('chevron_current_mode', 'bold');

// Widget panel visibility atom
export const widgetPanelVisibleAtom = atom(false);

// Active widgets atom - stores array of active widget IDs
export const activeWidgetsAtom = atomWithStorage('chevron_active_widgets', [
  'clock',
  'notes'
]);

// Widget layout atom - stores layout configuration for the grid
// Format: { widgetId: { x, y, w, h } }
export const widgetLayoutAtom = atomWithStorage('chevron_widget_layout', {
  'clock': { x: 0, y: 0, w: 2, h: 1 },
  'notes': { x: 2, y: 0, w: 3, h: 2 }
});

// Wallpaper settings for Simple Start mode
export const wallpaperSettingsAtom = atomWithStorage('chevron_wallpaper_settings', {
  type: 'unsplash', // 'unsplash', 'custom', or 'color'
  customUrl: '',
  color: '#1a1a1a',
  unsplashCategory: 'nature'
});

// Quote settings for Simple Start mode
export const quoteSettingsAtom = atomWithStorage('chevron_quote_settings', {
  enabled: true,
  source: 'quotable' // API source for quotes
});

// API keys atom
export const apiKeysAtom = atomWithStorage('chevron_api_keys', {
  openai: '',
  weather: '' // OpenWeatherMap or similar
});

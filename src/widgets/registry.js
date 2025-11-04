/**
 * Widget Registry
 *
 * This file serves as the central registry for all available widgets.
 * Each widget should export a default object with the following structure:
 * {
 *   id: string,              // Unique identifier
 *   name: string,            // Display name
 *   description: string,     // Brief description
 *   component: React.Component,
 *   defaultLayout: { w: number, h: number },
 *   requiredPermissions: string[] // Browser permissions needed
 * }
 */

// Import widgets as they're implemented
import ClockWidget from './Clock';
import NotesWidget from './Notes';
import BookmarksWidget from './Bookmarks';
import WeatherWidget from './Weather';

const widgets = [
  ClockWidget,
  NotesWidget,
  BookmarksWidget,
  WeatherWidget,
];

// Create a map for easy lookup
export const widgetMap = new Map(
  widgets.map(widget => [widget.id, widget])
);

export default widgets;

import Weather from './Weather';

export default {
  id: 'weather',
  name: 'Weather',
  description: 'Current weather and forecast',
  component: Weather,
  defaultLayout: { w: 2, h: 2 },
  requiredPermissions: [] // Uses browser geolocation API, no extension permission needed
};

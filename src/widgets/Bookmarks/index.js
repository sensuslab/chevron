import Bookmarks from './Bookmarks';

export default {
  id: 'bookmarks',
  name: 'Bookmarks',
  description: 'Quick access to your browser bookmarks',
  component: Bookmarks,
  defaultLayout: { w: 2, h: 3 },
  requiredPermissions: ['bookmarks']
};

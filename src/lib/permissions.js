/**
 * Permission Management Utilities
 *
 * Handles browser extension permissions on-demand
 */

/**
 * Check if a permission is granted
 * @param {string} permission - Permission name (e.g., 'bookmarks', 'tabs')
 * @returns {Promise<boolean>}
 */
export async function hasPermission(permission) {
  if (!chrome?.permissions) {
    console.warn('Permissions API not available');
    return false;
  }

  try {
    const result = await chrome.permissions.contains({ permissions: [permission] });
    return result;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Request a permission from the user
 * @param {string} permission - Permission name
 * @returns {Promise<boolean>} - True if granted
 */
export async function requestPermission(permission) {
  if (!chrome?.permissions) {
    console.warn('Permissions API not available');
    return false;
  }

  try {
    const granted = await chrome.permissions.request({ permissions: [permission] });
    return granted;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
}

/**
 * Request multiple permissions at once
 * @param {string[]} permissions - Array of permission names
 * @returns {Promise<boolean>} - True if all granted
 */
export async function requestPermissions(permissions) {
  if (!chrome?.permissions || permissions.length === 0) {
    return permissions.length === 0;
  }

  try {
    const granted = await chrome.permissions.request({ permissions });
    return granted;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
}

/**
 * Remove a permission
 * @param {string} permission - Permission name
 * @returns {Promise<boolean>}
 */
export async function removePermission(permission) {
  if (!chrome?.permissions) {
    return false;
  }

  try {
    const removed = await chrome.permissions.remove({ permissions: [permission] });
    return removed;
  } catch (error) {
    console.error('Error removing permission:', error);
    return false;
  }
}

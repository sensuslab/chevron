import { createChatCompletion } from '../api/client'

/**
 * Create a chat completion using the backend API proxy
 *
 * DEPRECATED: This function now uses the backend API proxy for security.
 * The API key parameter is ignored - keys are stored server-side.
 *
 * @param {Function} stateSetter - Function to update state with streaming content
 * @param {Array} messages - Array of message objects
 * @param {Number} temperature - Temperature setting for the model
 * @param {String} _apiKey - DEPRECATED: API key (now stored server-side)
 * @returns {Object} Object with controller and promise
 */
function createCompletion(stateSetter, messages, temperature, _apiKey) {
  // Note: API key is now stored server-side and not needed here
  // Using gpt-4 as default model (more stable than gpt-5)
  return createChatCompletion(stateSetter, messages, temperature, 'gpt-4')
}

export default createCompletion
/**
 * API Client for Chevron Backend
 *
 * Handles communication with the backend API server
 */

// Determine API URL based on environment
const getApiUrl = () => {
  // In development, use the dev server
  if (import.meta.env.DEV) {
    return 'http://localhost:8000'
  }

  // In production, use the same origin
  return window.location.origin
}

const API_BASE_URL = getApiUrl()

/**
 * Check if the backend is available
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    if (!response.ok) throw new Error('Health check failed')
    return await response.json()
  } catch (error) {
    console.error('Backend health check failed:', error)
    return { status: 'error', error: error.message }
  }
}

/**
 * Create a chat completion request to the backend
 *
 * @param {Function} stateSetter - Function to update state with streaming content
 * @param {Array} messages - Array of message objects
 * @param {Number} temperature - Temperature setting for the model
 * @param {String} model - Model to use (default: gpt-4)
 * @returns {Object} Object with controller and promise
 */
export function createChatCompletion(stateSetter, messages, temperature = 0.4, model = 'gpt-4') {
  const controller = new AbortController()

  return {
    controller,
    promise: new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/api/chat/completions`, {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, temperature, model })
      })
        .then(result => {
          if (!result.ok) {
            // Handle HTTP errors
            return result.json().then(errorData => {
              throw errorData
            })
          }

          return fetchStream(
            result.body,
            dataParser(stateSetter)
          )
            .then(content => {
              resolve({ content, role: 'assistant' })
            })
        })
        .catch(error => {
          // Handle network errors and API errors
          if (error.name === 'AbortError') {
            reject({ code: 'aborted', message: 'Request was cancelled' })
          } else if (error.error) {
            // API error with structured format
            reject(error.error)
          } else {
            // Network or other error
            reject({
              code: 'network_error',
              message: error.message || 'Failed to connect to the server'
            })
          }
        })
    })
  }
}

/**
 * Fetch and process a streaming response
 */
function fetchStream(stream, parser) {
  let content = null
  const reader = stream.getReader()

  return reader.read().then(
    function processText({ done, value }) {
      if (done) return content

      const decoded = new TextDecoder('utf-8').decode(value)
      content = parser(decoded, content)

      return reader.read().then(processText)
    }
  )
}

/**
 * Parse streaming data chunks
 */
function dataParser(stateSetter) {
  return (data, acc) => {
    for (const entry of data.split('\n')) {
      if (entry) {
        const text = entry.slice(entry.indexOf(':') + 2)
        let response

        try {
          response = JSON.parse(text)
        } catch (error) {
          // Skip malformed JSON
          continue
        }

        if (response && response.choices && response.choices[0]?.delta?.content) {
          if (typeof acc === 'string') {
            acc += response.choices[0].delta.content
          } else {
            acc = response.choices[0].delta.content
          }

          stateSetter(acc)
        }
      }
    }

    return acc
  }
}

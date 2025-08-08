// Lima Voice Assistant Backend API Service
export class AssistantApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://fea4d9ce67a0.ngrok-free.app/api/assistant/query'
  }

  /**
   * Send query to assistant API
   * @param {string} message - User message to send
   * @returns {Promise<Object>} - API response
   */
  async sendQuery(message, signal = null) {
    try {
      console.log('📤 Sending query to assistant:', message)

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Skip ngrok browser warning
        },
        body: JSON.stringify({
          message: message
        })
      }
      
      // Add abort signal if provided
      if (signal) {
        fetchOptions.signal = signal
      }

      const response = await fetch(this.baseUrl, fetchOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API Error: ${response.status} ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      console.log('📥 Assistant response:', result)
      
      // Clean up response text - replace \r\n with actual line breaks
      if (result.response) {
        result.response = result.response.replace(/\\r\\n/g, '\n').replace(/\r\n/g, '\n')
      }
      if (result.message) {
        result.message = result.message.replace(/\\r\\n/g, '\n').replace(/\r\n/g, '\n')
      }
      
      return result
    } catch (error) {
      // Don't log AbortError as error - it's intentional cancellation
      if (error.name === 'AbortError') {
        console.log('⚠️ API request was cancelled')
        throw error
      }
      
      console.error('❌ Assistant API error:', error)
      throw error
    }
  }

  /**
   * Check if API is available
   * @returns {Promise<boolean>} - True if API is reachable
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
      return response.ok
    } catch (error) {
      console.warn('API health check failed:', error)
      return false
    }
  }
}
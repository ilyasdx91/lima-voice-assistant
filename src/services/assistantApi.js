// Lima Voice Assistant Backend API Service
export class AssistantApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL
  }

  /**
   * Send query to assistant API
   * @param {string} message - User message to send
   * @returns {Promise<Object>} - API response
   */
  async sendQuery(message) {
    try {
      console.log('📤 Sending query to assistant:', message)

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Skip ngrok browser warning
        },
        body: JSON.stringify({
          message: message
        })
      })

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
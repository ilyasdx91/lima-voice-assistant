// OpenAI Whisper Speech-to-Text Service
export class SpeechToTextService {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.openai.com/v1/audio/transcriptions'
  }

  /**
   * Convert audio blob to text using OpenAI Whisper
   * @param {Blob} audioBlob - The audio data to transcribe
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - The transcribed text
   */
  async transcribeAudio(audioBlob, options = {}) {
    try {
      // Prepare FormData for the API request
      const formData = new FormData()
      
      // Convert blob to file with proper extension
      const audioFile = new File([audioBlob], 'audio.webm', {
        type: audioBlob.type
      })
      
      formData.append('file', audioFile)
      formData.append('model', options.model || 'whisper-1')
      formData.append('language', options.language || 'ru') // Russian by default
      formData.append('response_format', options.format || 'text')
      
      // Add optional parameters
      if (options.prompt) {
        formData.append('prompt', options.prompt)
      }
      
      if (options.temperature !== undefined) {
        formData.append('temperature', options.temperature.toString())
      }

      console.log('🔊 Sending audio to Whisper API...')

      // Make API request
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Whisper API error: ${response.status} ${errorData.error?.message || response.statusText}`)
      }

      const result = await response.text()
      console.log('✅ Transcription completed:', result)
      
      return result.trim()
    } catch (error) {
      console.error('❌ Speech-to-text error:', error)
      throw error
    }
  }

  /**
   * Get transcription with JSON response format (includes confidence, segments, etc.)
   * @param {Blob} audioBlob - The audio data to transcribe
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Detailed transcription data
   */
  async transcribeAudioDetailed(audioBlob, options = {}) {
    const detailedOptions = {
      ...options,
      format: 'json'
    }
    
    const response = await this.transcribeAudio(audioBlob, detailedOptions)
    return JSON.parse(response)
  }

  /**
   * Validate API key format
   * @param {string} apiKey - OpenAI API key
   * @returns {boolean} - True if format is valid
   */
  static validateApiKey(apiKey) {
    return typeof apiKey === 'string' && apiKey.startsWith('sk-') && apiKey.length > 20
  }
}
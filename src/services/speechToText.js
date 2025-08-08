// OpenAI Whisper Speech-to-Text Service
import medicineTerms from '@/data/medicine-terms.json'

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
      
      // Convert blob to file with proper extension for Whisper
      let fileName = 'audio.webm'
      let mimeType = 'audio/webm'
      
      // Determine file format based on blob type
      if (audioBlob.type.includes('mp4')) {
        fileName = 'audio.mp4'
        mimeType = 'audio/mp4'
      } else if (audioBlob.type.includes('wav')) {
        fileName = 'audio.wav'
        mimeType = 'audio/wav'
      }
      
      const audioFile = new File([audioBlob], fileName, {
        type: mimeType
      })
      
      formData.append('file', audioFile)
      formData.append('model', 'whisper-1')
      formData.append('language', options.language || 'ru') // Russian by default
      formData.append('response_format', options.format || 'text')
      
      // Добавляем temperature для более точного распознавания
      formData.append('temperature', '0.0')
      
      // Создаем prompt с медицинскими терминами для улучшения распознавания
      const prompt = this.createMedicalPrompt(options.prompt)
      if (prompt) {
        formData.append('prompt', prompt)
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
   * Создает prompt с медицинскими терминами для улучшения распознавания
   * @param {string} customPrompt - Дополнительный пользовательский prompt
   * @returns {string} - Готовый prompt для Whisper
   */
  createMedicalPrompt(customPrompt = '') {
    // Берем случайные 20 терминов для prompt (ограничение Whisper API)
    const randomTerms = medicineTerms
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .join(', ')
    
    const medicalContext = `Медицинские препараты: ${randomTerms}.`
    
    return customPrompt ? `${medicalContext} ${customPrompt}` : medicalContext
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
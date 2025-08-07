// OpenAI Text-to-Speech Service
export class TextToSpeechService {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.openai.com/v1/audio/speech'
    this.audioContext = null
    this.currentAudio = null
  }

  /**
   * Convert text to speech using OpenAI TTS
   * @param {string} text - Text to convert to speech
   * @param {Object} options - TTS options
   * @returns {Promise<void>} - Plays the audio
   */
  async speakText(text, options = {}) {
    try {
      console.log('🔊 Converting text to speech:', text)

      const requestBody = {
        model: options.model || 'tts-1', // tts-1 is faster, tts-1-hd is higher quality
        input: text,
        voice: options.voice || 'alloy', // alloy, echo, fable, onyx, nova, shimmer
        response_format: options.format || 'mp3',
        speed: options.speed || 1.0 // 0.25 to 4.0
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`TTS API error: ${response.status} ${errorData.error?.message || response.statusText}`)
      }

      // Get audio data as array buffer
      const audioData = await response.arrayBuffer()
      
      // Play the audio
      await this.playAudioBuffer(audioData)
      
      console.log('✅ Text-to-speech completed')
    } catch (error) {
      console.error('❌ Text-to-speech error:', error)
      throw error
    }
  }

  /**
   * Play audio buffer
   * @param {ArrayBuffer} audioData - Audio data to play
   */
  async playAudioBuffer(audioData) {
    try {
      // Stop current audio if playing
      this.stopCurrentAudio()

      // Create audio context if not exists
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      }

      // Resume audio context if suspended (required by browser policies)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Create audio buffer from data
      const audioBuffer = await this.audioContext.decodeAudioData(audioData)
      
      // Create and configure buffer source
      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.audioContext.destination)
      
      // Store reference for stopping
      this.currentAudio = source
      
      // Play audio
      source.start(0)
      
      // Clean up when finished
      return new Promise((resolve) => {
        source.onended = () => {
          this.currentAudio = null
          resolve()
        }
      })
    } catch (error) {
      console.error('Error playing audio:', error)
      throw error
    }
  }

  /**
   * Stop current audio playback
   */
  stopCurrentAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.stop()
        this.currentAudio = null
      } catch (error) {
        console.warn('Error stopping audio:', error)
      }
    }
  }

  /**
   * Check if TTS is currently playing
   * @returns {boolean}
   */
  isSpeaking() {
    return this.currentAudio !== null
  }

  /**
   * Get available voices for TTS
   * @returns {Array<string>} - List of available voice names
   */
  static getAvailableVoices() {
    return ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
  }

  /**
   * Get available models for TTS
   * @returns {Array<string>} - List of available model names
   */
  static getAvailableModels() {
    return ['tts-1', 'tts-1-hd']
  }
}
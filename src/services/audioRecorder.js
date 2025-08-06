// Audio Recording Service using MediaRecorder API
export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null
    this.audioChunks = []
    this.stream = null
    this.isRecording = false
  }

  async startRecording() {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000, // Whisper works well with 16kHz
          channelCount: 1,   // Mono
          echoCancellation: true,
          noiseSuppression: true
        }
      })

      // Create MediaRecorder with optimal format for Whisper
      const options = {
        mimeType: 'audio/webm;codecs=opus'
      }
      
      // Fallback for Safari
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/mp4'
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options)
      this.audioChunks = []

      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      // Start recording
      this.mediaRecorder.start(100) // Collect data every 100ms
      this.isRecording = true
      
      console.log('🎤 Recording started')
      return true
    } catch (error) {
      console.error('❌ Failed to start recording:', error)
      throw new Error('Microphone access denied or not available')
    }
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording found'))
        return
      }

      this.mediaRecorder.onstop = () => {
        try {
          // Create audio blob from chunks
          const audioBlob = new Blob(this.audioChunks, {
            type: this.mediaRecorder.mimeType
          })

          // Stop all audio tracks
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop())
          }

          this.isRecording = false
          console.log('🛑 Recording stopped', audioBlob)
          resolve(audioBlob)
        } catch (error) {
          reject(error)
        }
      }

      this.mediaRecorder.stop()
    })
  }

  // Check if browser supports audio recording
  static isSupported() {
    return !!(navigator.mediaDevices && 
              navigator.mediaDevices.getUserMedia && 
              window.MediaRecorder)
  }

  // Get recording duration in seconds
  getRecordingDuration() {
    // This would need to be calculated based on start/stop times
    // For now, return estimate based on chunks
    return this.audioChunks.length * 0.1 // 100ms per chunk
  }

  // Clean up resources
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
    this.audioChunks = []
    this.isRecording = false
  }
}
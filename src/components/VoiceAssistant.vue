<template>
  <div class="voice-assistant">
    <h1>Привет! я Limа</h1>
    <h3>ваш голосовой помощник</h3>

    <div class="robots">
      <img 
        src="@/assets/voice-assistant-1.png" 
        alt=""
        :class="{ active: !isRecording }"
        class="robot-img robot-idle"
      >
      <img 
        src="@/assets/voice-assistant-2.png" 
        alt=""
        :class="{ active: isRecording }"
        class="robot-img robot-recording"
      >

      <div class="speaker" :class="{ active: isRecording }">
        <div class="pulse-ring ring-1"></div>
        <div class="pulse-ring ring-2"></div>
        <div class="pulse-ring ring-3"></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="none">
            <path
                d="M15 4.25c0-1.08-1.274-1.651-2.08-.935L8.427 7.31a.75.75 0 0 1-.498.19H4.25A2.25 2.25 0 0 0 2 9.748v4.497a2.25 2.25 0 0 0 2.25 2.25h3.68a.75.75 0 0 1 .498.19l4.491 3.993c.806.717 2.081.145 2.081-.934V4.25zM9.425 8.43L13.5 4.806v14.382l-4.075-3.623a2.25 2.25 0 0 0-1.495-.569H4.25a.75.75 0 0 1-.75-.75V9.748a.75.75 0 0 1 .75-.75h3.68a2.25 2.25 0 0 0 1.495-.568zm9.567-2.533a.75.75 0 0 1 1.049.156A9.959 9.959 0 0 1 22 12a9.96 9.96 0 0 1-1.96 5.947a.75.75 0 1 1-1.205-.893A8.459 8.459 0 0 0 20.5 12a8.459 8.459 0 0 0-1.665-5.053a.75.75 0 0 1 .157-1.05zm-1.849 2.472a.75.75 0 0 1 1.017.302c.536.991.84 2.125.84 3.329a6.973 6.973 0 0 1-.84 3.328a.75.75 0 0 1-1.32-.714c.42-.777.66-1.667.66-2.615c0-.947-.24-1.837-.66-2.614a.75.75 0 0 1 .303-1.016z"
                fill="currentColor"></path>
          </g>
        </svg>
      </div>
    </div>

    <div class="robot-txt" :class="{ speaking: isSpeaking }">
      <div v-if="isSpeaking" class="speaking-indicator">🔊</div>
      
      <p v-if="!transcribedText && !errorMessage && !isProcessing && !assistantResponse">✨ Готов помочь! О чём поговорим?</p>
      <p v-else-if="isProcessing" class="processing">🔄 Обрабатываю запись...</p>
      <p v-else-if="errorMessage" class="error">❌ {{ errorMessage }}</p>
      <div v-else-if="assistantResponse" class="assistant-response">
        <pre>{{ assistantResponse }}</pre>
      </div>
      <p v-else-if="transcribedText" class="transcribed">💬 {{ transcribedText }}</p>
    </div>

    <button 
      class="btn btn-voice" 
      :class="{ recording: isRecording, pressed: isButtonPressed }"
      @mousedown="handleButtonPress" 
      @mouseup="handleButtonRelease"
      @mouseleave="handleButtonRelease"
      @touchstart.prevent="handleButtonPress"
      @touchend.prevent="handleButtonRelease"
      @touchcancel.prevent="handleButtonRelease"
      @contextmenu.prevent
      @selectstart.prevent
    >
      <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.00001 12C6.16668 12 5.45835 11.7083 4.87501 11.125C4.29168 10.5417 4.00001 9.83333 4.00001 9V3C4.00001 2.16667 4.29168 1.45833 4.87501 0.875C5.45835 0.291667 6.16668 0 7.00001 0C7.83335 0 8.54168 0.291667 9.12501 0.875C9.70835 1.45833 10 2.16667 10 3V9C10 9.83333 9.70835 10.5417 9.12501 11.125C8.54168 11.7083 7.83335 12 7.00001 12ZM6.00001 18V15.925C4.46668 15.7083 3.15418 15.0583 2.06251 13.975C0.970847 12.8917 0.308347 11.575 0.0750141 10.025C0.0416808 9.74167 0.116681 9.5 0.300014 9.3C0.483347 9.1 0.716681 9 1.00001 9C1.28335 9 1.52085 9.09583 1.71251 9.2875C1.90418 9.47917 2.03335 9.71667 2.10001 10C2.33335 11.1667 2.91251 12.125 3.83751 12.875C4.76251 13.625 5.81668 14 7.00001 14C8.20001 14 9.25835 13.6208 10.175 12.8625C11.0917 12.1042 11.6667 11.15 11.9 10C11.9667 9.71667 12.0958 9.47917 12.2875 9.2875C12.4792 9.09583 12.7167 9 13 9C13.2833 9 13.5167 9.1 13.7 9.3C13.8833 9.5 13.9583 9.74167 13.925 10.025C13.6917 11.5417 13.0333 12.85 11.95 13.95C10.8667 15.05 9.55001 15.7083 8.00001 15.925V18C8.00001 18.2833 7.90418 18.5208 7.71251 18.7125C7.52085 18.9042 7.28335 19 7.00001 19C6.71668 19 6.47918 18.9042 6.28751 18.7125C6.09585 18.5208 6.00001 18.2833 6.00001 18ZM7.00001 10C7.28335 10 7.52085 9.90417 7.71251 9.7125C7.90418 9.52083 8.00001 9.28333 8.00001 9V3C8.00001 2.71667 7.90418 2.47917 7.71251 2.2875C7.52085 2.09583 7.28335 2 7.00001 2C6.71668 2 6.47918 2.09583 6.28751 2.2875C6.09585 2.47917 6.00001 2.71667 6.00001 3V9C6.00001 9.28333 6.09585 9.52083 6.28751 9.7125C6.47918 9.90417 6.71668 10 7.00001 10Z"
            fill="#F3F3F3"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
})
import { AudioRecorder } from '@/services/audioRecorder.js'
import { SpeechToTextService } from '@/services/speechToText.js'
import { AssistantApiService } from '@/services/assistantApi.js'
import { TextToSpeechService } from '@/services/textToSpeech.js'

const isRecording = ref(false)
const isProcessing = ref(false)
const isSpeaking = ref(false)
const transcribedText = ref('')
const assistantResponse = ref('')
const errorMessage = ref('')

// Abort controller for canceling previous requests
let currentAbortController = null
let requestCounter = 0 // Counter to track requests

// Recording state management
let recordingTimeout = null
let isButtonPressed = ref(false)

// Initialize services
const audioRecorder = new AudioRecorder()

// Helper function to get API key from settings or env
const getApiKey = () => {
  return props.settings?.openaiApiKey || import.meta.env.VITE_OPENAI_API_KEY
}

const getApiUrl = () => {
  const url = props.settings?.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'https://fea4d9ce67a0.ngrok-free.app/api/assistant/query'
  console.log('🎯 Settings API URL:', props.settings?.apiBaseUrl)
  console.log('🌍 ENV API URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('✅ Final API URL:', url)
  return url
}

const speechService = new SpeechToTextService()
const assistantApi = new AssistantApiService(import.meta.env.VITE_API_BASE_URL || 'https://fea4d9ce67a0.ngrok-free.app/api/assistant/query')
const ttsService = new TextToSpeechService()

const startRecording = async () => {
  try {
    // Stop current TTS if playing
    if (isSpeaking.value) {
      ttsService.stopCurrentAudio()
      isSpeaking.value = false
      console.log('🔇 Stopped current TTS playback')
    }
    
    // Cancel previous API requests
    if (currentAbortController) {
      currentAbortController.abort()
      console.log('⚠️ Cancelled previous request')
    }
    
    // Clear previous responses
    assistantResponse.value = ''
    transcribedText.value = ''
    errorMessage.value = ''
    
    // Prevent duplicate calls
    if (isRecording.value || isProcessing.value || !isButtonPressed.value) return
    
    if (!AudioRecorder.isSupported()) {
      throw new Error('Audio recording not supported in this browser')
    }

    // Задержка 0.3 секунды перед началом записи
    recordingTimeout = setTimeout(async () => {
      // Проверяем что кнопка все еще зажата
      if (!isButtonPressed.value) return
      
      await audioRecorder.startRecording()
      isRecording.value = true
      console.log('🎤 Recording started (after 0.3s delay)')
    }, 300)
    
    console.log('⏳ Recording will start in 0.3s...')
  } catch (error) {
    console.error('Failed to start recording:', error)
    errorMessage.value = error.message
  }
}

const stopRecording = async () => {
  try {
    // Очищаем timeout если кнопку отпустили до начала записи
    if (recordingTimeout) {
      clearTimeout(recordingTimeout)
      recordingTimeout = null
    }
    
    // Если запись еще не началась, просто выходим
    if (!audioRecorder.isRecording) {
      console.log('📋 Recording cancelled (button released too early)')
      return
    }
    
    // Prevent duplicate calls
    if (isProcessing.value) return

    isRecording.value = false
    isProcessing.value = true
    
    // Create new abort controller and increment counter for this request
    currentAbortController = new AbortController()
    const signal = currentAbortController.signal
    const thisRequestId = ++requestCounter
    console.log(`🆔 Starting request #${thisRequestId}`)
    
    console.log('🛑 Recording stopped, processing...')

    // Stop recording and get audio blob
    const audioBlob = await audioRecorder.stopRecording()
    
    // Send to Whisper API for transcription
    speechService.apiKey = getApiKey()
    const text = await speechService.transcribeAudio(audioBlob, {
      language: props.settings?.language || 'ru',
      model: 'whisper-1'
    })

    transcribedText.value = text
    console.log('✅ Transcription:', text)

    // Check if request was cancelled or superseded by newer request
    if (signal.aborted || thisRequestId !== requestCounter) {
      console.log(`⚠️ Request #${thisRequestId} was cancelled or superseded (current: ${requestCounter})`)
      return
    }

    // Send transcribed text to assistant API
    console.log('🤖 Sending to assistant API...')
    const apiUrl = getApiUrl()
    console.log('🔗 API URL:', apiUrl)
    console.log('🔗 AssistantApi baseUrl BEFORE:', assistantApi.baseUrl)
    if (apiUrl) {
      assistantApi.baseUrl = apiUrl
    }
    console.log('🔗 AssistantApi baseUrl AFTER:', assistantApi.baseUrl)
    const apiResponse = await assistantApi.sendQuery(text, signal)
    
    const responseText = apiResponse.response || apiResponse.message || 'Получен ответ от ассистента'
    
    // Check if this is still the latest request before showing response
    if (thisRequestId !== requestCounter) {
      console.log(`⚠️ Request #${thisRequestId} superseded before showing response (current: ${requestCounter})`)
      isProcessing.value = false
      return
    }
    
    assistantResponse.value = responseText
    isProcessing.value = false // Stop processing indicator immediately after getting response
    console.log(`✅ Assistant response for request #${thisRequestId}:`, responseText)

    // Check if request was cancelled or superseded before TTS
    if (signal.aborted || thisRequestId !== requestCounter) {
      console.log(`⚠️ Request #${thisRequestId} was cancelled or superseded before TTS (current: ${requestCounter})`)
      return
    }

    // Convert response to speech (if enabled)
    if (props.settings?.enableTTS !== false) { // Default to true if not set
      // Stop any current TTS before starting new one
      if (isSpeaking.value) {
        ttsService.stopCurrentAudio()
        console.log('🔇 Stopped previous TTS for new response')
      }
      
      isSpeaking.value = true
      try {
        ttsService.apiKey = getApiKey()
        await ttsService.speakText(responseText, {
          voice: props.settings?.voice || 'shimmer',
          model: props.settings?.ttsModel || 'tts-1',
          speed: props.settings?.speechSpeed || 1.0
        })
      } catch (ttsError) {
        console.error('TTS error:', ttsError)
        // Don't throw - show text response even if speech fails
      } finally {
        // Only set to false if TTS wasn't interrupted by new request and this is still the latest
        if (!signal.aborted && thisRequestId === requestCounter) {
          isSpeaking.value = false
        }
      }
    }

  } catch (error) {
    // Don't show error if request was just cancelled
    if (error.name === 'AbortError') {
      console.log('⚠️ Request was cancelled by user')
      isProcessing.value = false
      return
    }
    
    console.error('Failed to process recording:', error)
    errorMessage.value = error.message
    isProcessing.value = false
  }
}

// Новые обработчики для кнопки
const handleButtonPress = async () => {
  isButtonPressed.value = true
  console.log('🔘 Button pressed')
  await startRecording()
}

const handleButtonRelease = async () => {
  isButtonPressed.value = false
  console.log('🔘 Button released')
  await stopRecording()
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/main.scss' as *;

.voice-assistant {
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  contain: layout;

  h1 {
    background: linear-gradient(90deg, #1788D8 0%, #71BBF0 50%, #408CFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 500;
    font-size: clamp(2rem, 5vw, 3rem);
    margin: 0;
    word-break: break-word;
  }

  h3 {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: #f5f5f5;
    margin: 0;
    word-break: break-word;
    font-weight: 400;
  }

  .robots {
    position: relative;
    max-width: 170px;
    margin: 0 auto;
    animation: gentle-sway 4s ease-in-out infinite;

    .robot-img {
      width: 100%;
      max-width: 100%;
      height: auto;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transform: rotateY(90deg);
      transition: all $transition-slow;
      
      &.active {
        opacity: 1;
        transform: rotateY(0deg);
      }
      
      &.robot-idle {
        position: relative;
      }
    }

    .speaker {
      position: absolute;
      top: 60px;
      right: -16px;
      width: 60px;
      height: 60px;
      opacity: 0;
      visibility: hidden;
      transition: all $transition-normal;
      
      &.active {
        opacity: 1;
        visibility: visible;
      }

      svg {
        width: 24px;
        height: 24px;
        color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
      }

      .pulse-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 2px solid $accent;
        border-radius: $radius-full;
        animation: pulse 1.5s infinite;

        &.ring-1 {
          width: 40px;
          height: 40px;
          animation-delay: 0s;
        }

        &.ring-2 {
          width: 50px;
          height: 50px;
          animation-delay: 0.5s;
        }

        &.ring-3 {
          width: 60px;
          height: 60px;
          animation-delay: 1s;
        }
      }
    }
  }

  .robot-txt {
    width: 100%;
    margin: 0 auto;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 500;
    padding: 16px 24px;
    background: rgba(255, 255, 255, .1);
    border-radius: 50px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, .2);

    max-width: calc(100vw - 64px);
    word-break: break-word;
    position: relative;

    p {
      margin: 0;
      
      &.processing {
        color: #71BBF0;
        animation: pulse-text 1.5s infinite;
      }
      
      &.error {
        color: #ff6b6b;
      }
      
      &.transcribed {
        color: #4ECDC4;
      }
      
    }
  }
  
  .speaking-indicator {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1.2em;
    color: #71BBF0;
    animation: pulse-speaker 0.8s infinite;
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .assistant-response {
    color: $white;
    font-weight: 500;
    text-align: left;
    
    &.speaking {
      animation: pulse-text 1.5s infinite;
    }
    
    pre {
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      white-space: pre-wrap;
      word-break: break-word;
      color: $white;
      text-align: left;
    }
  }

  .btn-voice {
    background: radial-gradient(circle, rgb(174, 219, 242) 0%, rgb(133, 214, 254) 17%, rgb(104, 205, 255) 30%, rgb(74, 195, 255) 43%, rgb(56, 184, 248) 53%, rgb(22, 175, 251) 72%, rgb(4, 169, 251) 84%, rgb(0, 144, 216) 100%);
    border-radius: $radius-full;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition-normal;
    transform: scale(1);

    margin: 24px auto;

    
    // iOS touch optimization
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      transform: scale(1.05);
      background: radial-gradient(circle, rgb(144, 189, 212) 0%, rgb(103, 184, 224) 17%, rgb(74, 175, 225) 30%, rgb(44, 165, 225) 43%, rgb(26, 154, 218) 53%, rgb(0, 145, 221) 72%, rgb(0, 139, 221) 84%, rgb(0, 114, 186) 100%);
      box-shadow: 0 15px 20px rgba(0, 144, 216, 0.3);
    }

    &:active,
    &.recording {
      transform: scale(0.95);
      animation: btn-pulse 0.8s infinite;
      will-change: transform;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
}

// Keyframe animations
@keyframes pulse {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.3);
  }
}

@keyframes btn-pulse {
  0%, 100% {
    transform: scale(0.95);
    box-shadow: 0 0 15px rgba(0, 144, 216, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 25px rgba(0, 144, 216, 0.7), 0 0 40px rgba(0, 144, 216, 0.3);
  }
}

@keyframes pulse-text {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

@keyframes pulse-speaker {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

@keyframes gentle-sway {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-3px) rotate(0.5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-3px) rotate(-0.5deg);
  }
}

</style>
<template>
  <div class="settings-overlay" :class="{ active: isOpen }" @click="closeDrawer">
    <div class="settings-drawer" :class="{ active: isOpen }" @click.stop>
      <div class="settings-header">
        <h3>Настройки</h3>
        <button class="btn btn-close" @click="closeDrawer">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="settings-content">
        <!-- Voice Settings -->
        <div class="setting-group">
          <h4>🎙️ Голос и речь</h4>
          
          <div class="setting-item">
            <label>Голос TTS:</label>
            <select v-model="settings.voice" @change="updateSettings">
              <option value="nova">Nova (Женский)</option>
              <option value="alloy">Alloy (Нейтральный)</option>
              <option value="echo">Echo (Мужской)</option>
              <option value="fable">Fable (Британский)</option>
              <option value="onyx">Onyx (Глубокий)</option>
              <option value="shimmer">Shimmer (Мягкий)</option>
            </select>
          </div>

          <div class="setting-item">
            <label>Скорость речи:</label>
            <div class="slider-container">
              <input 
                type="range" 
                v-model="settings.speechSpeed" 
                min="0.5" 
                max="2.0" 
                step="0.1"
                @input="updateSettings"
                class="slider"
              >
              <span class="slider-value">{{ settings.speechSpeed }}x</span>
            </div>
          </div>

          <div class="setting-item">
            <label>Качество TTS:</label>
            <select v-model="settings.ttsModel" @change="updateSettings">
              <option value="tts-1">Стандартное (быстро)</option>
              <option value="tts-1-hd">HD качество</option>
            </select>
          </div>
        </div>

        <!-- Language Settings -->
        <div class="setting-group">
          <h4>🌍 Язык</h4>
          
          <div class="setting-item">
            <label>Язык распознавания:</label>
            <select v-model="settings.language" @change="updateSettings">
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="uk">Українська</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        <!-- API Settings -->
        <div class="setting-group">
          <h4>🔑 API настройки</h4>
          
          <div class="setting-item">
            <label>OpenAI API ключ:</label>
            <div class="api-key-container">
              <input 
                type="password" 
                v-model="settings.openaiApiKey"
                @input="updateSettings"
                placeholder="sk-..."
                class="api-key-input"
              >
              <button 
                class="btn btn-toggle-visibility"
                @click="toggleApiKeyVisibility"
                type="button"
              >
                <svg v-if="showApiKey" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" fill="none"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="setting-item">
            <label>Backend API URL:</label>
            <input 
              type="url" 
              v-model="settings.apiBaseUrl"
              @input="updateSettings"
              placeholder="https://your-api.com/api/assistant/query"
              class="api-url-input"
            >
          </div>
        </div>

        <!-- About -->
        <div class="setting-group">
          <h4>ℹ️ О приложении</h4>
          <div class="about-info">
            <p><strong>Lima Voice Assistant</strong></p>
            <p>Версия: 1.0.0</p>
            <p>Голосовой ассистент с поддержкой OpenAI</p>
            <div class="tech-stack">
              <span class="tech-badge">Vue 3</span>
              <span class="tech-badge">OpenAI Whisper</span>
              <span class="tech-badge">OpenAI TTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'settingsChanged'])

// State
const showApiKey = ref(false)

// Settings reactive object
const settings = reactive({
  voice: 'nova',
  speechSpeed: 1.0,
  ttsModel: 'tts-1',
  language: 'ru',
  openaiApiKey: '',
  apiBaseUrl: ''
})

// Load settings from localStorage on mount
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('lima-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      Object.assign(settings, parsed)
    }
    
    // Load from env if not in localStorage
    if (!settings.openaiApiKey) {
      settings.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
    }
    if (!settings.apiBaseUrl) {
      settings.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

// Save settings to localStorage
const saveSettings = () => {
  try {
    localStorage.setItem('lima-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

// Methods
const closeDrawer = () => {
  emit('close')
}

const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value
  const input = document.querySelector('.api-key-input')
  if (input) {
    input.type = showApiKey.value ? 'text' : 'password'
  }
}

const updateSettings = () => {
  saveSettings()
  emit('settingsChanged', { ...settings })
}

// Watch for settings changes
watch(settings, () => {
  updateSettings()
}, { deep: true })

// Load settings on component mount
loadSettings()

// Expose settings for parent component
defineExpose({
  settings
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';

.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $bg-modal;
  backdrop-filter: blur(5px);
  z-index: $z-modal;
  opacity: 0;
  visibility: hidden;
  transition: all $transition-normal;
  
  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.settings-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: rgba(42, 112, 155, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateX(100%);
  transition: transform $transition-normal;
  overflow-y: auto;
  
  &.active {
    transform: translateX(0);
  }
  
  @media (max-width: $bp-md) {
    max-width: 100%;
  }
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    margin: 0;
    color: $white;
    font-size: $text-xl;
    font-weight: $font-semibold;
  }
  
  .btn-close {
    padding: $spacing-sm;
    color: $white;
    
    &:hover {
      color: $accent;
    }
  }
}

.settings-content {
  padding: $spacing-lg;
}

.setting-group {
  margin-bottom: $spacing-2xl;
  
  h4 {
    color: $white;
    margin: 0 0 $spacing-lg 0;
    font-size: $text-lg;
    font-weight: $font-medium;
  }
}

.setting-item {
  margin-bottom: $spacing-lg;
  
  label {
    display: block;
    color: $text-secondary;
    font-size: $text-sm;
    margin-bottom: $spacing-sm;
    font-weight: $font-medium;
  }
  
  select, input[type="url"] {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: $radius-md;
    color: $white;
    font-size: $text-sm;
    
    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 2px rgba(23, 136, 216, 0.2);
    }
    
    option {
      background: #2a4a68;
      color: $white;
    }
  }
}

.slider-container {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  
  .slider {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: $radius-sm;
    outline: none;
    
    &::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: $primary;
      border-radius: $radius-full;
      cursor: pointer;
    }
    
    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: $primary;
      border-radius: $radius-full;
      border: none;
      cursor: pointer;
    }
  }
  
  .slider-value {
    color: $text-secondary;
    font-size: $text-sm;
    min-width: 40px;
  }
}

.api-key-container {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  
  .api-key-input {
    flex: 1;
    padding: $spacing-sm $spacing-md;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: $radius-md;
    color: $white;
    font-size: $text-sm;
    
    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 2px rgba(23, 136, 216, 0.2);
    }
  }
  
  .btn-toggle-visibility {
    padding: $spacing-sm;
    color: $text-secondary;
    
    &:hover {
      color: $white;
    }
  }
}

.about-info {
  p {
    margin: 0 0 $spacing-sm 0;
    color: $text-secondary;
    font-size: $text-sm;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    margin-top: $spacing-md;
  }
  
  .tech-badge {
    padding: $spacing-xs $spacing-sm;
    background: rgba(23, 136, 216, 0.2);
    border: 1px solid rgba(23, 136, 216, 0.3);
    border-radius: $radius-sm;
    color: $primary;
    font-size: $text-xs;
    font-weight: $font-medium;
  }
}
</style>
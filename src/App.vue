<script setup>
import { ref } from 'vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import Header from './components/Header.vue'
import VoiceAssistant from './components/VoiceAssistant.vue'
import SettingsDrawer from './components/SettingsDrawer.vue'

const isSettingsOpen = ref(false)
const settings = ref({})


const openSettings = () => {
  isSettingsOpen.value = true
}

const closeSettings = () => {
  isSettingsOpen.value = false
}

const onSettingsChanged = (newSettings) => {
  settings.value = newSettings
}
</script>

<template>
  <div class="container">
    <AnimatedBackground />
    <Header @openSettings="openSettings" />
    <VoiceAssistant :settings="settings" />
    <SettingsDrawer 
      :isOpen="isSettingsOpen" 
      @close="closeSettings"
      @settingsChanged="onSettingsChanged"
    />
  </div>
</template>

<style scoped>

</style>

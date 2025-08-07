<template>
  <div class="animated-background">
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        animationDelay: particle.delay + 's',
        animationDuration: particle.duration + 's',
        width: particle.size + 'px',
        height: particle.size + 'px',
        opacity: particle.opacity
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const particles = ref([])
let animationId = null

// Создание частиц
const createParticles = () => {
  particles.value = []
  const particleCount = 40
  
  for (let i = 0; i < particleCount; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 15,
      duration: 20 + Math.random() * 25, // 20-45 секунд
      vx: (Math.random() - 0.5) * 0.3, // медленнее движение
      vy: (Math.random() - 0.5) * 0.3,
      size: 2 + Math.random() * 3, // случайный размер 2-5px
      opacity: 0.3 + Math.random() * 0.5 // случайная прозрачность
    })
  }
}

// Анимация движения частиц
const animateParticles = () => {
  particles.value.forEach(particle => {
    // Обновляем позицию
    particle.x += particle.vx
    particle.y += particle.vy
    
    // Отталкивание от границ экрана
    if (particle.x <= 0 || particle.x >= window.innerWidth) {
      particle.vx *= -1
    }
    if (particle.y <= 0 || particle.y >= window.innerHeight) {
      particle.vy *= -1
    }
    
    // Ограничиваем в пределах экрана
    particle.x = Math.max(0, Math.min(window.innerWidth, particle.x))
    particle.y = Math.max(0, Math.min(window.innerHeight, particle.y))
  })
  
  animationId = requestAnimationFrame(animateParticles)
}

// Обновление при изменении размера окна
const handleResize = () => {
  createParticles()
}

onMounted(() => {
  createParticles()
  animateParticles()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/main.scss' as *;

.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float infinite ease-in-out;
  will-change: transform, opacity;
  
  &:nth-child(3n) {
    background: rgba(255, 255, 255, 0.4);
    animation-name: drift;
    animation-direction: reverse;
  }
  
  &:nth-child(5n) {
    background: rgba(255, 255, 255, 0.8);
    animation-name: pulse;
    animation-timing-function: ease-out;
  }
  
  &:nth-child(7n) {
    background: rgba(23, 136, 216, 0.4);
    animation-timing-function: ease-in;
  }
  
  &:nth-child(11n) {
    background: rgba(113, 187, 240, 0.3);
    animation-name: drift;
    animation-direction: alternate;
  }
  
  &:nth-child(13n) {
    background: rgba(64, 140, 255, 0.3);
    animation-name: pulse;
    animation-duration: 8s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0px, 0px) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(-10px, -15px) scale(1.1) rotate(90deg);
  }
  50% {
    transform: translate(15px, -5px) scale(0.9) rotate(180deg);
  }
  75% {
    transform: translate(-5px, 10px) scale(1.05) rotate(270deg);
  }
}

// Дополнительная анимация для разнообразия
@keyframes drift {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(20px, -10px) scale(0.8);
  }
  66% {
    transform: translate(-15px, 20px) scale(1.2);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.9;
  }
}
</style>
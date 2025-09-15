<script setup>
import { useLayoutStore } from '../stores/layout';
import Desk from './Desk.vue';

const layoutStore = useLayoutStore();
</script>

<template>
  <main 
    class="relative glassmorphism rounded-2xl shadow-2xl transition-all duration-300 border-2 border-white/20" 
    :style="{ 
      width: `${layoutStore.settings.layoutWidth}%`, 
      aspectRatio: layoutStore.settings.aspectRatio, 
      backgroundImage: layoutStore.settings.imageVisible ? layoutStore.settings.backgroundImage : 'none',
      minHeight: '600px',
      maxWidth: '1200px'
    }"
  >
    <div 
      class="relative w-full h-full" 
      :style="{ 
        transform: `scale(${layoutStore.settings.zoom / 100})`, 
        transformOrigin: 'center center' 
      }"
    >
      <Desk 
        v-for="desk in layoutStore.desks" 
        :key="desk.id" 
        :desk="desk" 
      />
    </div>
    
    <!-- Grid overlay for better visual reference -->
    <div 
      v-if="layoutStore.isEditMode"
      class="absolute inset-0 pointer-events-none opacity-20"
      style="background-image: radial-gradient(circle, rgba(99, 102, 241, 0.3) 1px, transparent 1px); background-size: 20px 20px;"
    />
  </main>
</template>


<script setup>
import { useLayoutStore } from '../stores/layout';
import Desk from './Desk.vue';

const layoutStore = useLayoutStore();
</script>

<template>
  <main 
    class="relative bg-gray-200 dark:bg-gray-700 bg-cover bg-center rounded-lg shadow-lg transition-all" 
    :style="{ 
      width: `${layoutStore.settings.layoutWidth}%`, 
      aspectRatio: layoutStore.settings.aspectRatio, 
      backgroundImage: layoutStore.settings.imageVisible ? layoutStore.settings.backgroundImage : 'none' 
    }"
  >
    <div 
      class="relative w-full h-full" 
      :style="{ 
        transform: `scale(${layoutStore.settings.zoom / 100})`, 
        transformOrigin: 'top left' 
      }"
    >
      <Desk 
        v-for="desk in layoutStore.desks" 
        :key="desk.id" 
        :desk="desk" 
      />
    </div>
  </main>
</template>


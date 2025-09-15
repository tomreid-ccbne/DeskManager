<script setup>
import { onMounted } from 'vue';
import { useLayoutStore } from './stores/layout';
import AppHeader from './components/AppHeader.vue';
import DeskLayout from './components/DeskLayout.vue';
import DeskEditor from './components/DeskEditor.vue';

// Access the Pinia store
const layoutStore = useLayoutStore();

// Fetch the initial layout data when the component is first mounted
onMounted(() => {
  layoutStore.fetchLayout();
});
</script>

<template>
  <div class="flex flex-col h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
    <AppHeader />
    
    <div class="relative flex-grow flex items-start justify-center overflow-auto pt-32 p-4">
      <DeskLayout />
    </div>

    <DeskEditor />
  </div>
</template>

<style>
/* Global styles for the frosted glass aesthetic */
.glassmorphism {
  background: rgba(255, 255, 255, 0.5);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.dark .glassmorphism {
  background: rgba(26, 32, 44, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.vacant {
  background-color: rgba(229, 231, 235, 0.7);
  border-style: dashed;
}
.dark .vacant {
  background-color: rgba(55, 65, 81, 0.5);
}
</style>


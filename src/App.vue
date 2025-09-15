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
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <AppHeader />
    
    <div class="relative min-h-screen flex items-center justify-center p-8 pt-32">
      <DeskLayout />
    </div>

    <DeskEditor />
  </div>
</template>

<style>
/* Global styles for the frosted glass aesthetic */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark .glassmorphism {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.vacant {
  background: rgba(229, 231, 235, 0.6) !important;
  border-style: dashed;
  border-color: rgba(156, 163, 175, 0.8);
}

.dark .vacant {
  background: rgba(55, 65, 81, 0.6) !important;
  border-color: rgba(107, 114, 128, 0.8);
}

/* Desk hover effects */
.desk {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.desk:hover {
  transform: translate(-50%, -50%) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Button styles */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>


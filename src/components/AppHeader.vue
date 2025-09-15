<script setup>
import { useLayoutStore } from '../stores/layout';

const layoutStore = useLayoutStore();
</script>

<template>
  <div class="absolute top-0 left-0 right-0 p-4 z-30">
    <div class="glassmorphism max-w-7xl mx-auto rounded-xl shadow-md p-4 flex items-center justify-between border">
      <header class="flex-1">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Office Desk Layout</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ layoutStore.isEditMode ? 'Edit Mode: Click desks to select and modify' : 'View Mode: Hover for details' }}
        </p>
      </header>
      
      <div class="flex items-center gap-3">
        <button
          @click="layoutStore.toggleEditMode"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200 border"
          :class="layoutStore.isEditMode 
            ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
            : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'"
        >
          {{ layoutStore.isEditMode ? 'Exit Edit' : 'Edit Layout' }}
        </button>
        
        <button
          v-if="layoutStore.isEditMode"
          @click="layoutStore.addDesk"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 border border-green-500"
        >
          Add Desk
        </button>
      </div>
    </div>
  </div>
</template>


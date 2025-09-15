<script setup>
import { useLayoutStore } from '../stores/layout';

const layoutStore = useLayoutStore();
</script>

<template>
  <div class="fixed top-0 left-0 right-0 p-6 z-30">
    <div class="glassmorphism max-w-6xl mx-auto rounded-2xl shadow-xl p-6 flex items-center justify-between">
      <header class="flex-1">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Office Desk Layout
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {{ layoutStore.isEditMode ? 'Edit Mode: Click desks to select and modify' : 'View Mode: Hover for details' }}
        </p>
      </header>
      
      <div class="flex items-center gap-4">
        <button
          @click="layoutStore.toggleEditMode"
          class="px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
          :class="layoutStore.isEditMode 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'"
        >
          {{ layoutStore.isEditMode ? 'Exit Edit' : 'Edit Layout' }}
        </button>
        
        <button
          v-if="layoutStore.isEditMode"
          @click="layoutStore.addDesk"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
        >
          Add Desk
        </button>
      </div>
    </div>
  </div>
</template>


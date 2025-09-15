<script setup>
import { ref, watch } from 'vue';
import { useLayoutStore } from '../stores/layout';

const layoutStore = useLayoutStore();

const localDesk = ref({});

// Watch for selected desk changes and update local copy
watch(() => layoutStore.selectedDesk, (newDesk) => {
  if (newDesk) {
    localDesk.value = { ...newDesk };
  }
}, { immediate: true });

function updateDesk() {
  if (layoutStore.selectedDesk) {
    layoutStore.updateDesk(layoutStore.selectedDesk.id, localDesk.value);
  }
}

function deleteDesk() {
  if (layoutStore.selectedDesk && confirm('Are you sure you want to delete this desk?')) {
    layoutStore.deleteDesk(layoutStore.selectedDesk.id);
  }
}

const colorOptions = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];
</script>

<template>
  <div 
    v-if="layoutStore.isEditMode && layoutStore.selectedDesk"
    class="fixed right-6 top-32 w-80 glassmorphism rounded-2xl shadow-2xl p-6 z-40 border border-white/20"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Edit Desk
      </h3>
      <button
        @click="layoutStore.selectedDesk = null"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Occupant Name
        </label>
        <input
          v-model="localDesk.occupant"
          @input="updateDesk"
          type="text"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all"
          placeholder="Enter name or 'Vacant'"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Department
        </label>
        <input
          v-model="localDesk.department"
          @input="updateDesk"
          type="text"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all"
          placeholder="Enter department"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Desk Color
        </label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="color in colorOptions"
            :key="color"
            @click="localDesk.color = color; updateDesk()"
            class="w-10 h-10 rounded-xl border-3 transition-all duration-200 shadow-md hover:scale-110"
            :style="{ backgroundColor: color }"
            :class="localDesk.color === color ? 'border-white scale-110 shadow-lg' : 'border-gray-300 dark:border-gray-600'"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Width (%)
          </label>
          <input
            v-model.number="localDesk.w"
            @input="updateDesk"
            type="number"
            min="4"
            max="20"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Height (%)
          </label>
          <input
            v-model.number="localDesk.h"
            @input="updateDesk"
            type="number"
            min="4"
            max="15"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 backdrop-blur-sm transition-all"
          />
        </div>
      </div>

      <div class="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <button
          @click="deleteDesk"
          class="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
        >
          Delete Desk
        </button>
      </div>
    </div>
  </div>
</template>
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
    class="fixed right-4 top-32 w-80 glassmorphism rounded-xl shadow-lg p-6 z-40 border"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Edit Desk</h3>
      <button
        @click="layoutStore.selectedDesk = null"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Occupant Name
        </label>
        <input
          v-model="localDesk.occupant"
          @input="updateDesk"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Enter name or 'Vacant'"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Department
        </label>
        <input
          v-model="localDesk.department"
          @input="updateDesk"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Enter department"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Desk Color
        </label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="color in colorOptions"
            :key="color"
            @click="localDesk.color = color; updateDesk()"
            class="w-8 h-8 rounded-lg border-2 transition-all duration-200"
            :style="{ backgroundColor: color }"
            :class="localDesk.color === color ? 'border-gray-800 dark:border-gray-200 scale-110' : 'border-gray-300 dark:border-gray-600'"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width (%)
          </label>
          <input
            v-model.number="localDesk.w"
            @input="updateDesk"
            type="number"
            min="4"
            max="20"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height (%)
          </label>
          <input
            v-model.number="localDesk.h"
            @input="updateDesk"
            type="number"
            min="4"
            max="15"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="deleteDesk"
          class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          Delete Desk
        </button>
      </div>
    </div>
  </div>
</template>
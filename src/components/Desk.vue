<script setup>
import { computed } from 'vue';
import { useLayoutStore } from '../stores/layout';

const layoutStore = useLayoutStore();

const props = defineProps({
  desk: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['move']);

const isVacant = computed(() => !props.desk.occupant || props.desk.occupant.toLowerCase() === 'vacant');
const isSelected = computed(() => layoutStore.selectedDesk?.id === props.desk.id);
const DEFAULT_COLOR = '#a0aec0'; // Neutral gray

const deskStyle = computed(() => ({
  left: `${props.desk.x}%`,
  top: `${props.desk.y}%`,
  width: `${props.desk.w}%`,
  height: `${props.desk.h}%`,
  transform: 'translate(-50%, -50%)',
  backgroundColor: isVacant.value ? '' : (props.desk.color || DEFAULT_COLOR),
  cursor: layoutStore.isEditMode ? 'pointer' : 'default',
}));

const classNames = computed(() => [
  'desk', 'absolute', 'p-2', 'flex', 'flex-col', 'items-center', 'justify-center', 'border-2', 'rounded-lg', 'transition-all', 'duration-200', 'has-tooltip', 'select-none',
  { 
    'vacant': isVacant.value,
    'shadow-lg border-gray-400 dark:border-gray-500': !isVacant.value,
    'ring-4 ring-blue-400 ring-opacity-50 scale-105': isSelected.value,
    'hover:scale-105': layoutStore.isEditMode && !isSelected.value,
  }
]);

function handleClick() {
  if (layoutStore.isEditMode) {
    layoutStore.selectDesk(props.desk);
  }
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };

function handleMouseDown(event) {
  if (!layoutStore.isEditMode) return;
  
  isDragging = true;
  dragStart.x = event.clientX;
  dragStart.y = event.clientY;
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event) {
  if (!isDragging) return;
  
  const deltaX = event.clientX - dragStart.x;
  const deltaY = event.clientY - dragStart.y;
  
  // Convert pixel movement to percentage
  const container = event.target.closest('main');
  if (container) {
    const rect = container.getBoundingClientRect();
    const percentX = (deltaX / rect.width) * 100;
    const percentY = (deltaY / rect.height) * 100;
    
    const newX = Math.max(0, Math.min(100, props.desk.x + percentX));
    const newY = Math.max(0, Math.min(100, props.desk.y + percentY));
    
    layoutStore.moveDesk(props.desk.id, newX, newY);
  }
  
  dragStart.x = event.clientX;
  dragStart.y = event.clientY;
}

function handleMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}
</script>

<template>
  <div 
    :class="classNames" 
    :style="deskStyle"
    @click="handleClick"
    @mousedown="handleMouseDown"
  >
    <div class="text-center pointer-events-none w-full">
      <svg class="w-1/3 h-1/3 mx-auto" :class="isVacant ? 'text-gray-500 dark:text-gray-400' : 'text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-sm font-semibold mt-2 truncate w-full" :class="isVacant ? 'text-gray-600 dark:text-gray-400' : 'text-white'">
        {{ desk.occupant || 'Vacant' }}
      </p>
    </div>
    
    <div 
      v-if="!layoutStore.isEditMode"
      class="tooltip absolute bottom-full mb-2 w-48 bg-gray-800 dark:bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg z-10 pointer-events-none"
    >
      <p class="font-bold">{{ desk.occupant || 'Vacant' }}</p>
      <p>{{ desk.department }}</p>
    </div>
  </div>
</template>

<style scoped>
.has-tooltip:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
.tooltip {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;
}

.desk {
  user-select: none;
}
</style>

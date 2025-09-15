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
  'desk', 'absolute', 'p-3', 'flex', 'flex-col', 'items-center', 'justify-center', 'border-2', 'rounded-xl', 'transition-all', 'duration-300', 'has-tooltip', 'select-none', 'shadow-lg',
  { 
    'vacant': isVacant.value,
    'border-white/30 backdrop-blur-sm': !isVacant.value,
    'ring-4 ring-blue-400 ring-opacity-75 scale-110 shadow-2xl': isSelected.value,
    'hover:scale-105 cursor-pointer': layoutStore.isEditMode && !isSelected.value,
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
      <svg class="w-8 h-8 mx-auto mb-2" :class="isVacant ? 'text-gray-500 dark:text-gray-400' : 'text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21l4-4 4 4" />
      </svg>
      <p class="text-xs font-semibold truncate w-full" :class="isVacant ? 'text-gray-600 dark:text-gray-400' : 'text-white'">
        {{ desk.occupant || 'Vacant' }}
      </p>
    </div>
    
    <div 
      v-if="!layoutStore.isEditMode"
      class="tooltip absolute bottom-full mb-3 w-48 glassmorphism text-gray-800 dark:text-white text-xs rounded-xl py-3 px-4 shadow-xl z-10 pointer-events-none border border-white/20"
    >
      <p class="font-bold">{{ desk.occupant || 'Vacant' }}</p>
      <p class="text-gray-600 dark:text-gray-300">{{ desk.department }}</p>
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

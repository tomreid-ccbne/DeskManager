import { computed } from 'vue';

const props = defineProps({
  desk: {
    type: Object,
    required: true,
  }
});

const isVacant = computed(() => !props.desk.occupant || props.desk.occupant.toLowerCase() === 'vacant');
const DEFAULT_COLOR = '#a0aec0'; // Neutral gray

const deskStyle = computed(() => ({
  left: `${props.desk.x}%`,
  top: `${props.desk.y}%`,
  width: `${props.desk.w}%`,
  height: `${props.desk.h}%`,
  transform: 'translate(-50%, -50%)',
  backgroundColor: isVacant.value ? '' : (props.desk.color || DEFAULT_COLOR),
}));

const classNames = computed(() => [
  'desk', 'absolute', 'p-2', 'flex', 'flex-col', 'items-center', 'justify-center', 'border-2', 'rounded-lg', 'transition-all', 'duration-200', 'has-tooltip',
  { 
    'vacant': isVacant.value,
    'shadow-lg border-gray-400 dark:border-gray-500': !isVacant.value,
  }
]);
</script>

<template>
  <div :class="classNames" :style="deskStyle">
    <div class="text-center pointer-events-none w-full">
      <svg class="w-1/3 h-1/3 mx-auto" :class="isVacant ? 'text-gray-500 dark:text-gray-400' : 'text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12l-4 4m0 0l-4-4m4 4V4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm font-semibold mt-2 truncate w-full" :class="isVacant ? 'text-gray-600 dark:text-gray-400' : 'text-white'">
        {{ desk.occupant || 'Vacant' }}
      </p>
    </div>
    <div class="tooltip absolute bottom-full mb-2 w-48 bg-gray-800 dark:bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg z-10 pointer-events-none">
      <p class="font-bold">{{ desk.occupant || 'Vacant' }}</p>
      <p>{{ desk.department }}</p>
      <!-- Add other details as needed -->
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
</style>

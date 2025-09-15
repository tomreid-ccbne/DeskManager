import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getLayoutData } from '../services/api';

export const useLayoutStore = defineStore('layout', () => {
  // --- State ---
  const desks = ref([]);
  const settings = ref({
    darkMode: false,
    layoutWidth: 100,
    zoom: 100,
    // ... other settings
  });

  // --- Actions ---
  async function fetchLayout() {
    try {
      const data = await getLayoutData();
      desks.value = data.desks || [];
      // Destructure settings from data to avoid overwriting the desks ref
      const { desks: _, ...newSettings } = data;
      settings.value = { ...settings.value, ...newSettings };
    } catch (error) {
      console.error("Failed to fetch layout:", error);
      // Handle error, maybe show a toast notification
    }
  }
  
  // We will add more actions here later (e.g., updateUser, moveDesk)

  return { desks, settings, fetchLayout };
});


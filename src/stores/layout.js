import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getLayoutData } from '../services/api';

export const useLayoutStore = defineStore('layout', () => {
  // --- State ---
  const desks = ref([]);
  const isEditMode = ref(false);
  const selectedDesk = ref(null);
  const settings = ref({
    darkMode: false,
    layoutWidth: 100,
    zoom: 100,
    aspectRatio: '16/9',
    imageVisible: false,
    backgroundImage: '',
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
  
  function toggleEditMode() {
    isEditMode.value = !isEditMode.value;
    if (!isEditMode.value) {
      selectedDesk.value = null;
    }
  }

  function selectDesk(desk) {
    if (isEditMode.value) {
      selectedDesk.value = selectedDesk.value?.id === desk.id ? null : desk;
    }
  }

  function addDesk() {
    const newDesk = {
      id: Date.now(),
      x: 50,
      y: 50,
      w: 8,
      h: 6,
      occupant: 'New Desk',
      department: 'Unassigned',
      color: '#3b82f6'
    };
    desks.value.push(newDesk);
    selectedDesk.value = newDesk;
  }

  function updateDesk(deskId, updates) {
    const desk = desks.value.find(d => d.id === deskId);
    if (desk) {
      Object.assign(desk, updates);
    }
  }

  function deleteDesk(deskId) {
    const index = desks.value.findIndex(d => d.id === deskId);
    if (index !== -1) {
      desks.value.splice(index, 1);
      if (selectedDesk.value?.id === deskId) {
        selectedDesk.value = null;
      }
    }
  }

  function moveDesk(deskId, x, y) {
    updateDesk(deskId, { x, y });
  }

  return { 
    desks, 
    settings, 
    isEditMode, 
    selectedDesk, 
    fetchLayout, 
    toggleEditMode, 
    selectDesk, 
    addDesk, 
    updateDesk, 
    deleteDesk, 
    moveDesk 
  };
});


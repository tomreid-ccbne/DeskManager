import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './index.css'

const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

app.mount('#app')


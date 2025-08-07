import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' 
// Importar los íconos de Material Design
import axios from 'axios' // Importar axios

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

// Configuración de Axios para incluir el token en cada solicitud
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Opcional: Manejo de errores 401/403 con el interceptor de Axios
axios.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    // Si el token expira o no es válido, redirigir al login
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/login');
  }
  return Promise.reject(error);
});

// --- INICIO: REGISTRO DEL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('Fallo el registro del Service Worker:', error);
      });
  });
}
// --- FIN: REGISTRO DEL SERVICE WORKER ---

app.mount('#app')
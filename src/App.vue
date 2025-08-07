<template>
  <v-app>
    <v-app-bar v-if="shouldShowPublicAppBar" class="app-bar-custom" app>
      <v-toolbar-title>
        <router-link to="/" style="color: white; text-decoration: none; font-weight: bold;">
          Bry.andev
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/" class="text-none">Inicio</v-btn>
      <v-btn text to="/about" class="text-none">Acerca</v-btn>
      <v-btn text to="/login" class="text-none">Iniciar Sesión</v-btn>
      <v-btn text to="/register" class="text-none">Registrarse</v-btn>
      <!-- --- INICIO: Botón de Instalación PWA --- -->
      <PwaInstallButton class="ml-4" /> <!-- Añadimos el componente aquí -->
      <!-- --- FIN: Botón de Instalación PWA --- -->
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer v-if="shouldShowPublicAppBar" class="footer-custom" app>
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            &copy; {{ new Date().getFullYear() }} [Nombre de tu Plataforma/Proyecto]. Todos los derechos reservados.
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PwaInstallButton from './components/PwaInstallButton.vue'; // Importa el nuevo componente

const route = useRoute();

const publicRoutes = [
  'home',
  'about',
  'login',
  'register',
];

const shouldShowPublicAppBar = computed(() => {
  const isAuthenticated = localStorage.getItem('authToken');

  if (!isAuthenticated) {
    return true;
  }

  const isDashboardRoute = route.name && (
    route.name.includes('-dashboard') ||
    route.name.includes('admin-') ||
    route.name.includes('professor-') ||
    route.name.includes('member-')
  );
  
  return !isDashboardRoute;
});
</script>

<style scoped>
.text-none {
  text-transform: none !important;
}

/* Estilos para la barra de aplicación (Header) */
.app-bar-custom {
  background-color: #1a1a1a !important; /* Negro muy oscuro */
  color: white !important;
}

/* Estilos para el footer */
.footer-custom {
  background-color: #0f0f0f !important; /* Negro aún más oscuro */
  color: white !important;
  /* Asegura que los enlaces y texto dentro del footer también sean blancos si no lo son por defecto */
  font-size: 0.9em; /* Ajusta el tamaño de fuente si es necesario */
}

/* Reglas generales para el texto dentro de la app-bar y footer, si es necesario */
.app-bar-custom .v-btn,
.app-bar-custom .v-toolbar-title a {
  color: white !important;
}
</style>
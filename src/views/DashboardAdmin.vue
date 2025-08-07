<template>
  <v-card class="pa-0 ma-0" elevation="0">
    <v-layout>
      <v-app-bar color="black">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Panel de Administrador</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="logout">Cerrar Sesión</v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list density="compact" nav>
          <v-list-subheader>Funciones de Administrador</v-list-subheader>
          <v-list-item
            prepend-icon="mdi-home"
            title="Inicio del Panel"
            value="admin-home"
            to="/admin"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-account-group"
            title="Gestión de Usuarios"
            value="users"
            to="/admin/users"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-card-account-details"
            title="Gestión de Membresías"
            value="memberships"
            to="/admin/memberships"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-dumbbell"
            title="Gestión de Clases"
            value="classes"
            to="/admin/classes"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-calendar-check"
            title="Gestión de Asistencias"
            value="attendances"
            to="/admin/attendances"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-currency-usd"
            title="Gestión de Pagos"
            value="payments"
            to="/admin/payments"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="min-height: calc(100vh - 64px);">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <v-container v-if="$route.path === '/admin'" class="pa-5">
          <h1 class="text-h4 mb-4">Bienvenido, Administrador</h1>
          <v-card class="pa-5">
            <p>Este es el panel de administración. Usa el menú lateral para navegar a las diferentes secciones y gestionar usuarios, membresías, clases, asistencias y pagos.</p>
            <p class="mt-3">
              Puedes empezar haciendo clic en "Gestión de Usuarios" o cualquier otra opción del menú.
            </p>
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    drawer: false,
  }),
  methods: {
    async logout() {
      try {
        const token = localStorage.getItem('authToken');
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Hubo un error al cerrar sesión.');
      }
    }
  }
};
</script>

<style scoped>
v-main {
  padding-top: 64px; /* Altura de v-app-bar */
}
/* Opcional: Transición para las vistas del router */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
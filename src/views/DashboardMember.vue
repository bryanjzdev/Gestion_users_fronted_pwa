<template>
  <v-card class="pa-0 ma-0" elevation="0">
    <v-layout>
      <v-app-bar color="black">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Panel de Miembro</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="logout">Cerrar Sesión</v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list density="compact" nav>
          <v-list-subheader>Mi Cuenta</v-list-subheader>
          <v-list-item
            prepend-icon="mdi-home"
            title="Inicio"
            value="home"
            to="/member"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-card-account-details"
            title="Mi Membresía"
            value="my-membership"
            to="/member/membership"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-dumbbell"
            title="Ver Clases Disponibles"
            value="available-classes"
            to="/member/classes"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-calendar-check"
            title="Mis Asistencias"
            value="my-attendances"
            to="/member/attendances"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-currency-usd"
            title="Mis Pagos"
            value="my-payments"
            to="/member/payments"
          ></v-list-item>
          </v-list>
      </v-navigation-drawer>

      <v-main style="min-height: calc(100vh - 64px);">
        <v-container class="pa-5">
          <h1 class="text-h4 mb-4">Bienvenido, Miembro</h1>
          <v-card class="pa-5">
            <p>Este es tu panel de miembro. Aquí puedes ver el estado de tu membresía, explorar clases disponibles, revisar tus asistencias y consultar tus pagos.</p>
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
  padding-top: 64px;
}
</style>
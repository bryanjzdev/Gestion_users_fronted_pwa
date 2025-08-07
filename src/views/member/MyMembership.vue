<template>
  <v-container>
    <h1 class="text-h4 mb-4">Mi Membresía (Miembro)</h1>
    <v-card class="pa-4">
      <v-card-title>Detalles de tu Membresía</v-card-title>
      <v-card-text v-if="membership">
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>ID de Membresía:</v-list-item-title>
              <v-list-item-subtitle>{{ membership.id }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Clases Adquiridas:</v-list-item-title>
              <v-list-item-subtitle>{{ membership.clases_adquiridas }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Clases Disponibles:</v-list-item-title>
              <v-list-item-subtitle>{{ membership.clases_disponibles }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Clases Ocupadas:</v-list-item-title>
              <v-list-item-subtitle>{{ membership.clases_ocupadas }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-text v-else-if="loading">
        Cargando detalles de la membresía...
      </v-card-text>
      <v-card-text v-else>
        No se encontró ninguna membresía asociada a tu cuenta.
      </v-card-text>
    </v-card>
    <v-alert v-if="errorMessage" type="error" dense outlined class="mt-4">
      {{ errorMessage }}
    </v-alert>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    loading: true,
    membership: null,
    errorMessage: '',
  }),

  async created() {
    await this.fetchMyMembership();
  },

  methods: {
    async fetchMyMembership() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const user = await axios.get('http://127.0.0.1:8000/api/user');
        if (user.data && user.data.id) {
          const response = await axios.get(`http://127.0.0.1:8000/api/memberships?id_usuario=${user.data.id}`);
          // Si el backend devuelve un array de membresías para un usuario, toma la primera.
          // Idealmente, un usuario solo debería tener una membresía activa o la API debería devolver la relevante.
          this.membership = response.data.find(m => m.id_usuario === user.data.id) || null;
        } else {
          this.errorMessage = "No se pudo obtener la información del usuario autenticado.";
        }
      } catch (error) {
        console.error('Error al obtener la membresía:', error);
        this.errorMessage = 'No se pudo cargar la información de tu membresía. Intenta de nuevo.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
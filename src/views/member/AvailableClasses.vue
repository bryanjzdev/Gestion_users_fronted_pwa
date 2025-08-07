<template>
  <v-container>
    <h1 class="text-h4 mb-4">Clases Disponibles (Miembro)</h1>
    <v-card class="pa-4">
      <v-card-title>
        Próximas Clases
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="availableClasses"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.fecha="{ item }">
            {{ new Date(item.fecha).toLocaleDateString() }}
          </template>
          <template v-slot:item.profesor_nombre="{ item }">
            {{ item.profesor ? item.profesor.nombre : 'N/A' }}
          </template>
          <template v-slot:no-data>
            No hay clases disponibles en este momento.
          </template>
        </v-data-table>
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
    availableClasses: [],
    errorMessage: '',
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Tipo', key: 'tipo' },
      { title: 'Profesor', key: 'profesor_nombre' },
      { title: 'Lugares Disponibles', key: 'lugares_disponibles' },
    ],
  }),

  async created() {
    await this.fetchAvailableClasses();
  },

  methods: {
    async fetchAvailableClasses() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/clases');
        // Filtrar clases con lugares disponibles y fecha futura o de hoy
        const today = new Date();
        today.setHours(0,0,0,0); // Ignorar la hora para la comparación

        this.availableClasses = response.data.filter(clase =>
          clase.lugares_disponibles > 0 && new Date(clase.fecha) >= today
        );
      } catch (error) {
        console.error('Error al obtener clases disponibles:', error);
        this.errorMessage = 'No se pudieron cargar las clases disponibles. Intenta de nuevo.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
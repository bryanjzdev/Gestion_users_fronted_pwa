<template>
  <v-container>
    <h1 class="text-h4 mb-4">Mis Clases (Profesor)</h1>
    <v-card class="pa-4">
      <v-card-title>
        Clases Asignadas
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="professorClasses"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.fecha="{ item }">
            {{ new Date(item.fecha).toLocaleDateString() }}
          </template>
          <template v-slot:no-data>
            No tienes clases asignadas.
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
    professorClasses: [],
    errorMessage: '',
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Tipo', key: 'tipo' },
      { title: 'Lugares', key: 'lugares' },
      { title: 'Ocupados', key: 'lugares_ocupados' },
      { title: 'Disponibles', key: 'lugares_disponibles' },
    ],
  }),

  async created() {
    await this.fetchProfessorClasses();
  },

  methods: {
    async fetchProfessorClasses() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const user = await axios.get('http://127.0.0.1:8000/api/user'); // Obtener el usuario autenticado
        if (user.data && user.data.id) {
          // Filtrar clases por el id_profesor del usuario autenticado
          const response = await axios.get('http://127.0.0.1:8000/api/clases');
          this.professorClasses = response.data.filter(clase => clase.id_profesor === user.data.id);
        } else {
          this.errorMessage = "No se pudo obtener la información del usuario autenticado.";
        }
      } catch (error) {
        console.error('Error al obtener clases del profesor:', error);
        this.errorMessage = 'No se pudieron cargar tus clases. Intente de nuevo.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<template>
  <v-container>
    <h1 class="text-h4 mb-4">Mis Asistencias (Miembro)</h1>
    <v-card class="pa-4">
      <v-card-title>
        Historial de Asistencias
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="myAttendances"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.clase_info="{ item }">
            {{ item.clase ? `${item.clase.tipo} (${new Date(item.clase.fecha).toLocaleDateString()})` : 'N/A' }}
          </template>
          <template v-slot:item.profesor_nombre="{ item }">
            {{ item.profesor ? item.profesor.nombre : 'N/A' }}
          </template>
          <template v-slot:item.membresia_id="{ item }">
            {{ item.membresia ? item.membresia.id : 'N/A' }}
          </template>
          <template v-slot:no-data>
            No has registrado asistencias aún.
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
    myAttendances: [],
    errorMessage: '',
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Clase', key: 'clase_info' },
      { title: 'Profesor', key: 'profesor_nombre' },
      { title: 'ID Membresía', key: 'membresia_id' },
      { title: 'Fecha de Registro', key: 'created_at' }, // Asumiendo que quieres ver cuándo se registró la asistencia
    ],
  }),

  async created() {
    await this.fetchMyAttendances();
  },

  methods: {
    async fetchMyAttendances() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const user = await axios.get('http://127.0.0.1:8000/api/user');
        if (user.data && user.data.id) {
          const response = await axios.get('http://127.0.0.1:8000/api/attendances');
          this.myAttendances = response.data.filter(att => att.id_usuario === user.data.id);
        } else {
          this.errorMessage = "No se pudo obtener la información del usuario autenticado.";
        }
      } catch (error) {
        console.error('Error al obtener mis asistencias:', error);
        this.errorMessage = 'No se pudieron cargar tus asistencias. Intenta de nuevo.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
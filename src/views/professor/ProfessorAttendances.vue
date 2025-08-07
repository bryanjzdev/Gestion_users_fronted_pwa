<template>
  <v-container>
    <h1 class="text-h4 mb-4">Gestionar Asistencias (Profesor)</h1>
    <v-card class="pa-4">
      <v-card-title class="d-flex align-center justify-space-between">
        Asistencias de mis Clases
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon> Registrar Asistencia
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="attendances"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.clase_info="{ item }">
            {{ item.clase ? `${item.clase.tipo} (${new Date(item.clase.fecha).toLocaleDateString()})` : 'N/A' }}
          </template>
          <template v-slot:item.usuario_nombre="{ item }">
            {{ item.usuario ? item.usuario.nombre : 'N/A' }}
          </template>
          <template v-slot:item.membresia_id="{ item }">
            {{ item.membresia ? item.membresia.id : 'N/A' }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editAttendance(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteAttendance(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:no-data>
            No hay asistencias registradas para tus clases.
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="attendanceForm" @submit.prevent="saveAttendance">
              <v-autocomplete
                v-model="editedItem.id_clase"
                :items="professorClasses"
                item-title="tipo_fecha"
                item-value="id"
                label="Clase"
                :rules="[rules.required]"
              ></v-autocomplete>
              <v-autocomplete
                v-model="editedItem.id_usuario"
                :items="members"
                item-title="nombre"
                item-value="id"
                label="Miembro"
                :rules="[rules.required]"
              ></v-autocomplete>
              <v-autocomplete
                v-model="editedItem.id_membresia"
                :items="memberships"
                item-title="id"
                item-value="id"
                label="ID Membresía (Opcional)"
                clearable
              ></v-autocomplete>
              <v-alert v-if="dialogError" type="error" dense outlined class="mt-4">{{ dialogError }}</v-alert>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveAttendance" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="350px">
      <v-card>
        <v-card-title class="text-h5">¿Eliminar Asistencia?</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar esta asistencia?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    loading: true,
    dialog: false,
    deleteDialog: false,
    attendances: [],
    professorClasses: [], // Clases que imparte este profesor
    members: [], // Usuarios con rol 'miembro'
    memberships: [], // Todas las membresías
    currentProfessorId: null, // ID del profesor logueado
    errorMessage: '',
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Clase', key: 'clase_info' },
      { title: 'Miembro', key: 'usuario_nombre' },
      { title: 'ID Membresía', key: 'membresia_id' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id_clase: null,
      id_usuario: null,
      id_profesor: null, // Se asignará el ID del profesor logueado
      id_membresia: null,
    },
    defaultItem: {
      id_clase: null,
      id_usuario: null,
      id_profesor: null,
      id_membresia: null,
    },
    saving: false,
    dialogError: '',
    rules: {
      required: value => !!value || 'Este campo es requerido.',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Registrar Nueva Asistencia' : 'Editar Asistencia';
    },
  },

  watch: {
    dialog(val) {
      val || this.closeDialog();
    },
    deleteDialog(val) {
      val || this.closeDeleteDialog();
    },
  },

  async created() {
    await this.initData();
  },

  methods: {
    async initData() {
      try {
        this.loading = true;
        const userRes = await axios.get('http://127.0.0.1:8000/api/user');
        this.currentProfessorId = userRes.data.id;

        await Promise.all([
          this.fetchProfessorClasses(),
          this.fetchMembersAndMemberships(),
          this.fetchAttendances(), // Esto cargará asistencias para TODAS las clases
        ]);

        // Filtrar asistencias para mostrar solo las del profesor logueado
        this.attendances = this.attendances.filter(att => att.id_profesor === this.currentProfessorId);

      } catch (error) {
        console.error('Error al inicializar datos:', error);
        this.errorMessage = 'Hubo un error al cargar los datos iniciales.';
      } finally {
        this.loading = false;
      }
    },

    async fetchProfessorClasses() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/clases');
        this.professorClasses = response.data.filter(clase => clase.id_profesor === this.currentProfessorId);
        this.professorClasses = this.professorClasses.map(clase => ({
          ...clase,
          tipo_fecha: `${clase.tipo} (${new Date(clase.fecha).toLocaleDateString()})`
        }));
      } catch (error) {
        console.error('Error al obtener clases del profesor:', error);
      }
    },

    async fetchMembersAndMemberships() {
      try {
        const [usersRes, membershipsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/users'),
          axios.get('http://127.0.0.1:8000/api/memberships'),
        ]);
        this.members = usersRes.data.filter(user => user.rol === 'miembro');
        this.memberships = membershipsRes.data;
      } catch (error) {
        console.error('Error al obtener miembros y membresías:', error);
      }
    },

    async fetchAttendances() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/attendances');
        this.attendances = response.data;
      } catch (error) {
        console.error('Error al obtener asistencias:', error);
        this.errorMessage = 'No se pudieron cargar las asistencias.';
      } finally {
        this.loading = false;
      }
    },

    openCreateDialog() {
      this.editedIndex = -1;
      this.editedItem = { ...this.defaultItem, id_profesor: this.currentProfessorId }; // Asignar el ID del profesor
      this.dialogError = '';
      this.dialog = true;
    },

    editAttendance(item) {
      this.editedIndex = this.attendances.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogError = '';
      this.dialog = true;
    },

    async saveAttendance() {
      if (!this.$refs.attendanceForm.validate()) return;

      this.saving = true;
      this.dialogError = '';

      try {
        if (this.editedIndex > -1) {
          const url = `http://127.0.0.1:8000/api/attendances/${this.editedItem.id}`;
          await axios.put(url, this.editedItem);
          Object.assign(this.attendances[this.editedIndex], this.editedItem);
          alert('Asistencia actualizada con éxito.');
        } else {
          const response = await axios.post('http://127.0.0.1:8000/api/attendances', this.editedItem);
          this.attendances.push(response.data.attendance);
          alert('Asistencia registrada con éxito.');
        }
        this.closeDialog();
        await this.fetchAttendances(); // Recargar asistencias y filtrar por profesor
        this.attendances = this.attendances.filter(att => att.id_profesor === this.currentProfessorId);
      } catch (error) {
        console.error('Error al guardar la asistencia:', error);
        this.dialogError = error.response?.data?.message || 'Error al guardar. Intente de nuevo.';
        if (error.response?.data?.errors) {
          this.dialogError = Object.values(error.response.data.errors).flat().join(' ');
        }
      } finally {
        this.saving = false;
      }
    },

    deleteAttendance(item) {
      this.editedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/attendances/${this.editedItem.id}`);
        this.attendances = this.attendances.filter(a => a.id !== this.editedItem.id);
        alert('Asistencia eliminada con éxito.');
      } catch (error) {
        console.error('Error al eliminar asistencia:', error);
        alert('Hubo un error al eliminar la asistencia.');
      } finally {
        this.closeDeleteDialog();
      }
    },

    closeDialog() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.dialogError = '';
        if (this.$refs.attendanceForm) {
            this.$refs.attendanceForm.resetValidation();
        }
      });
    },

    closeDeleteDialog() {
      this.deleteDialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
  },
};
</script>
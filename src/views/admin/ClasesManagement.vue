<template>
  <v-container>
    <h1 class="text-h4 mb-4">Gestión de Clases</h1>
    <v-card class="pa-4">
      <v-card-title class="d-flex align-center justify-space-between">
        Lista de Clases
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon> Nueva Clase
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="clases"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.profesor_nombre="{ item }">
            {{ item.profesor ? item.profesor.nombre : 'N/A' }}
          </template>
          <template v-slot:item.fecha="{ item }">
            {{ new Date(item.fecha).toLocaleDateString() }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editClase(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteClase(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:no-data>
            No hay clases disponibles.
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
            <v-form ref="claseForm" @submit.prevent="saveClase">
              <v-text-field
                v-model="editedItem.fecha"
                label="Fecha"
                type="date"
                :rules="[rules.required]"
              ></v-text-field>
              <v-autocomplete
                v-model="editedItem.id_profesor"
                :items="professors"
                item-title="nombre"
                item-value="id"
                label="Profesor"
                :rules="[rules.required]"
              ></v-autocomplete>
              <v-text-field
                v-model="editedItem.tipo"
                label="Tipo de Clase"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                v-model.number="editedItem.lugares"
                label="Lugares Totales"
                type="number"
                :rules="[rules.required, rules.minOne]"
              ></v-text-field>
              <v-text-field
                v-model.number="editedItem.lugares_ocupados"
                label="Lugares Ocupados"
                type="number"
                :rules="[rules.required, rules.minZero, rules.lessThanOrEqual('lugares')]"
              ></v-text-field>
              <v-text-field
                v-model.number="editedItem.lugares_disponibles"
                label="Lugares Disponibles"
                type="number"
                :rules="[rules.required, rules.minZero, rules.lessThanOrEqual('lugares')]"
              ></v-text-field>
              <v-alert v-if="dialogError" type="error" dense outlined class="mt-4">{{ dialogError }}</v-alert>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveClase" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="350px">
      <v-card>
        <v-card-title class="text-h5">¿Eliminar Clase?</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar esta clase?</v-card-text>
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
    clases: [],
    professors: [], // Para el select de profesores
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Profesor', key: 'profesor_nombre' },
      { title: 'Tipo', key: 'tipo' },
      { title: 'Lugares', key: 'lugares' },
      { title: 'Ocupados', key: 'lugares_ocupados' },
      { title: 'Disponibles', key: 'lugares_disponibles' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      fecha: '',
      id_profesor: null,
      tipo: '',
      lugares: 0,
      lugares_ocupados: 0,
      lugares_disponibles: 0,
    },
    defaultItem: {
      fecha: '',
      id_profesor: null,
      tipo: '',
      lugares: 0,
      lugares_ocupados: 0,
      lugares_disponibles: 0,
    },
    saving: false,
    dialogError: '',
    rules: {
      required: value => !!value || 'Este campo es requerido.',
      minZero: value => value >= 0 || 'Debe ser un número positivo.',
      minOne: value => value >= 1 || 'Debe ser al menos 1.',
      lessThanOrEqual: field => value => {
        return value <= this.editedItem[field] || `Debe ser menor o igual a ${this.editedItem[field]} (Lugares Totales).`;
      }
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear Nueva Clase' : 'Editar Clase';
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

  created() {
    this.fetchClases();
    this.fetchProfessors();
  },

  methods: {
    async fetchClases() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/clases');
        this.clases = response.data;
      } catch (error) {
        console.error('Error al obtener clases:', error);
        alert('No se pudieron cargar las clases.');
      } finally {
        this.loading = false;
      }
    },

    async fetchProfessors() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users');
        // Filtrar solo usuarios con rol 'profesor'
        this.professors = response.data.filter(user => user.rol === 'profesor');
      } catch (error) {
        console.error('Error al obtener profesores:', error);
      }
    },

    openCreateDialog() {
      this.editedIndex = -1;
      this.editedItem = { ...this.defaultItem };
      // Establecer fecha por defecto a hoy si es un nuevo registro
      this.editedItem.fecha = new Date().toISOString().substr(0, 10);
      this.dialogError = '';
      this.dialog = true;
    },

    editClase(item) {
      this.editedIndex = this.clases.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // Asegurarse de que la fecha esté en formato YYYY-MM-DD para el input type="date"
      this.editedItem.fecha = new Date(this.editedItem.fecha).toISOString().substr(0, 10);
      this.dialogError = '';
      this.dialog = true;
    },

    async saveClase() {
      if (!this.$refs.claseForm.validate()) return;

      this.saving = true;
      this.dialogError = '';

      try {
        if (this.editedIndex > -1) {
          const url = `http://127.0.0.1:8000/api/clases/${this.editedItem.id}`;
          await axios.put(url, this.editedItem);
          Object.assign(this.clases[this.editedIndex], this.editedItem);
          alert('Clase actualizada con éxito.');
        } else {
          const response = await axios.post('http://127.0.0.1:8000/api/clases', this.editedItem);
          this.clases.push(response.data.clase);
          alert('Clase creada con éxito.');
        }
        this.closeDialog();
        this.fetchClases();
      } catch (error) {
        console.error('Error al guardar la clase:', error);
        this.dialogError = error.response?.data?.message || 'Error al guardar. Intente de nuevo.';
        if (error.response?.data?.errors) {
          this.dialogError = Object.values(error.response.data.errors).flat().join(' ');
        }
      } finally {
        this.saving = false;
      }
    },

    deleteClase(item) {
      this.editedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/clases/${this.editedItem.id}`);
        this.clases = this.clases.filter(c => c.id !== this.editedItem.id);
        alert('Clase eliminada con éxito.');
      } catch (error) {
        console.error('Error al eliminar clase:', error);
        alert('Hubo un error al eliminar la clase.');
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
        this.$refs.claseForm.resetValidation();
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
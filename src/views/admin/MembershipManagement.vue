<template>
  <v-container>
    <h1 class="text-h4 mb-4">Gestión de Membresías</h1>
    <v-card class="pa-4">
      <v-card-title class="d-flex align-center justify-space-between">
        Lista de Membresías
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon> Nueva Membresía
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="memberships"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.usuario_nombre="{ item }">
            {{ item.usuario ? item.usuario.nombre : 'N/A' }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editMembership(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteMembership(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:no-data>
            No hay membresías disponibles.
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
            <v-form ref="membershipForm" @submit.prevent="saveMembership">
              <v-autocomplete
                v-model="editedItem.id_usuario"
                :items="users"
                item-title="nombre"
                item-value="id"
                label="Usuario"
                :rules="[rules.required]"
              ></v-autocomplete>
              <v-text-field
                v-model.number="editedItem.clases_adquiridas"
                label="Clases Adquiridas"
                type="number"
                :rules="[rules.required, rules.minZero]"
              ></v-text-field>
              <v-text-field
                v-model.number="editedItem.clases_disponibles"
                label="Clases Disponibles"
                type="number"
                :rules="[rules.required, rules.minZero]"
              ></v-text-field>
              <v-text-field
                v-model.number="editedItem.clases_ocupadas"
                label="Clases Ocupadas"
                type="number"
                :rules="[rules.required, rules.minZero]"
              ></v-text-field>
              <v-alert v-if="dialogError" type="error" dense outlined class="mt-4">{{ dialogError }}</v-alert>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveMembership" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="350px">
      <v-card>
        <v-card-title class="text-h5">¿Eliminar Membresía?</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar esta membresía?</v-card-text>
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
    memberships: [],
    users: [], // Para el select de usuarios
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Usuario', key: 'usuario_nombre' }, // Mostrar nombre del usuario
      { title: 'Clases Adquiridas', key: 'clases_adquiridas' },
      { title: 'Clases Disponibles', key: 'clases_disponibles' },
      { title: 'Clases Ocupadas', key: 'clases_ocupadas' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id_usuario: null,
      clases_adquiridas: 0,
      clases_disponibles: 0,
      clases_ocupadas: 0,
    },
    defaultItem: {
      id_usuario: null,
      clases_adquiridas: 0,
      clases_disponibles: 0,
      clases_ocupadas: 0,
    },
    saving: false,
    dialogError: '',
    rules: {
      required: value => !!value || 'Este campo es requerido.',
      minZero: value => value >= 0 || 'Debe ser un número positivo.',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear Nueva Membresía' : 'Editar Membresía';
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
    this.fetchMemberships();
    this.fetchUsersForSelect();
  },

  methods: {
    async fetchMemberships() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/memberships');
        this.memberships = response.data;
      } catch (error) {
        console.error('Error al obtener membresías:', error);
        alert('No se pudieron cargar las membresías.');
      } finally {
        this.loading = false;
      }
    },

    async fetchUsersForSelect() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error al obtener usuarios para el select:', error);
      }
    },

    openCreateDialog() {
      this.editedIndex = -1;
      this.editedItem = { ...this.defaultItem };
      this.dialogError = '';
      this.dialog = true;
    },

    editMembership(item) {
      this.editedIndex = this.memberships.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogError = '';
      this.dialog = true;
    },

    async saveMembership() {
      if (!this.$refs.membershipForm.validate()) return;

      this.saving = true;
      this.dialogError = '';

      try {
        if (this.editedIndex > -1) {
          const url = `http://127.0.0.1:8000/api/memberships/${this.editedItem.id}`;
          await axios.put(url, this.editedItem);
          Object.assign(this.memberships[this.editedIndex], this.editedItem);
          alert('Membresía actualizada con éxito.');
        } else {
          const response = await axios.post('http://127.0.0.1:8000/api/memberships', this.editedItem);
          this.memberships.push(response.data.membership);
          alert('Membresía creada con éxito.');
        }
        this.closeDialog();
        this.fetchMemberships();
      } catch (error) {
        console.error('Error al guardar la membresía:', error);
        this.dialogError = error.response?.data?.message || 'Error al guardar. Intente de nuevo.';
        if (error.response?.data?.errors) {
          this.dialogError = Object.values(error.response.data.errors).flat().join(' ');
        }
      } finally {
        this.saving = false;
      }
    },

    deleteMembership(item) {
      this.editedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/memberships/${this.editedItem.id}`);
        this.memberships = this.memberships.filter(m => m.id !== this.editedItem.id);
        alert('Membresía eliminada con éxito.');
      } catch (error) {
        console.error('Error al eliminar membresía:', error);
        alert('Hubo un error al eliminar la membresía.');
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
        this.$refs.membershipForm.resetValidation();
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
<template>
  <v-container>
    <h1 class="text-h4 mb-4">Gestión de Usuarios</h1>
    <v-card class="pa-4">
      <v-card-title class="d-flex align-center justify-space-between">
        Lista de Usuarios
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon> Nuevo Usuario
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:no-data>
            No hay usuarios disponibles.
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
            <v-form ref="userForm" @submit.prevent="saveUser">
              <v-text-field
                v-model="editedItem.nombre"
                label="Nombre"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                v-model="editedItem.correo_electronico"
                label="Correo Electrónico"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
              <v-text-field
                v-model="editedItem.password"
                label="Contraseña"
                type="password"
                :rules="editedIndex === -1 ? [rules.required, rules.min] : [rules.minOrEmpty]"
              ></v-text-field>
              <v-select
                v-model="editedItem.rol"
                :items="roles"
                label="Rol"
                :rules="[rules.required]"
              ></v-select>
              <v-alert v-if="dialogError" type="error" dense outlined class="mt-4">{{ dialogError }}</v-alert>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="saveUser" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="350px">
      <v-card>
        <v-card-title class="text-h5">¿Eliminar Usuario?</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar este usuario?</v-card-text>
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
    users: [],
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Correo Electrónico', key: 'correo_electronico' },
      { title: 'Rol', key: 'rol' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      nombre: '',
      correo_electronico: '',
      password: '',
      rol: '',
    },
    defaultItem: {
      nombre: '',
      correo_electronico: '',
      password: '',
      rol: '',
    },
    roles: ['admin', 'profesor', 'miembro'],
    saving: false,
    dialogError: '',
    rules: {
      required: value => !!value || 'Este campo es requerido.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-1]{1,3}\.[0-1]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Correo electrónico inválido.'
      },
      min: value => value.length >= 8 || 'Mínimo 8 caracteres.',
      minOrEmpty: value => !value || value.length >= 8 || 'Mínimo 8 caracteres si se especifica.',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear Nuevo Usuario' : 'Editar Usuario';
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
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        alert('No se pudieron cargar los usuarios.');
      } finally {
        this.loading = false;
      }
    },

    openCreateDialog() {
      this.editedIndex = -1;
      this.editedItem = { ...this.defaultItem };
      this.dialogError = '';
      this.dialog = true;
    },

    editUser(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.password = ''; // No precargar la contraseña para edición
      this.dialogError = '';
      this.dialog = true;
    },

    async saveUser() {
      if (!this.$refs.userForm.validate()) return; // Validar el formulario de Vuetify

      this.saving = true;
      this.dialogError = '';

      try {
        if (this.editedIndex > -1) {
          // Actualizar usuario existente
          const url = `http://127.0.0.1:8000/api/users/${this.editedItem.id}`;
          await axios.put(url, this.editedItem);
          Object.assign(this.users[this.editedIndex], this.editedItem);
          alert('Usuario actualizado con éxito.');
        } else {
          // Crear nuevo usuario
          const response = await axios.post('http://127.0.0.1:8000/api/users', this.editedItem);
          this.users.push(response.data.user); // Laravel devuelve el usuario en `response.data.user`
          alert('Usuario creado con éxito.');
        }
        this.closeDialog();
        this.fetchUsers(); // Recargar la lista para asegurar la consistencia
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
        this.dialogError = error.response?.data?.message || 'Error al guardar. Intente de nuevo.';
        if (error.response?.data?.errors) {
          this.dialogError = Object.values(error.response.data.errors).flat().join(' ');
        }
      } finally {
        this.saving = false;
      }
    },

    deleteUser(item) {
      this.editedItem = Object.assign({}, item); // Guardar el item a eliminar temporalmente
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/users/${this.editedItem.id}`);
        this.users = this.users.filter(u => u.id !== this.editedItem.id);
        alert('Usuario eliminado con éxito.');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Hubo un error al eliminar el usuario.');
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
        this.$refs.userForm.resetValidation(); // Limpiar validaciones del formulario
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

<style scoped>
/* Puedes añadir estilos específicos si lo necesitas, pero Vuetify ya hace mucho trabajo */
</style>
<template>
  <v-container>
    <h1 class="text-h4 mb-4">Gestión de Pagos</h1>
    <v-card class="pa-4">
      <v-card-title class="d-flex align-center justify-space-between">
        Lista de Pagos
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon> Registrar Pago
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="payments"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.usuario_nombre="{ item }">
            {{ item.usuario ? item.usuario.nombre : 'N/A' }}
          </template>
          <template v-slot:item.membresia_id="{ item }">
            {{ item.membresia ? item.membresia.id : 'N/A' }}
          </template>
          <template v-slot:item.clase_info="{ item }">
            {{ item.clase ? `${item.clase.tipo} (${new Date(item.clase.fecha).toLocaleDateString()})` : 'N/A' }}
          </template>
          <template v-slot:item.monto="{ item }">
            {{ `$${item.monto.toFixed(2)}` }}
          </template>
          <template v-slot:item.fecha="{ item }">
            {{ new Date(item.fecha).toLocaleDateString() }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editPayment(item)">mdi-pencil</v-icon>
            <v-icon small @click="deletePayment(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:no-data>
            No hay pagos disponibles.
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
            <v-form ref="paymentForm" @submit.prevent="savePayment">
              <v-autocomplete
                v-model="editedItem.id_usuario"
                :items="users"
                item-title="nombre"
                item-value="id"
                label="Usuario"
                :rules="[rules.required]"
              ></v-autocomplete>
              <v-autocomplete
                v-model="editedItem.id_membresia"
                :items="memberships"
                item-title="id"
                item-value="id"
                label="ID Membresía"
                :rules="[rules.required]"
              ></v-autocomplete>
              <v-autocomplete
                v-model="editedItem.id_clase"
                :items="clases"
                item-title="tipo_fecha"
                item-value="id"
                label="Clase (Opcional)"
                clearable
              ></v-autocomplete>
              <v-text-field
                v-model.number="editedItem.monto"
                label="Monto"
                type="number"
                prefix="$"
                :rules="[rules.required, rules.minZero]"
              ></v-text-field>
              <v-text-field
                v-model="editedItem.fecha"
                label="Fecha del Pago"
                type="date"
                :rules="[rules.required]"
              ></v-text-field>
              <v-alert v-if="dialogError" type="error" dense outlined class="mt-4">{{ dialogError }}</v-alert>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="savePayment" :loading="saving">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="350px">
      <v-card>
        <v-card-title class="text-h5">¿Eliminar Pago?</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar este pago?</v-card-text>
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
    payments: [],
    users: [],
    memberships: [],
    clases: [],
    headers: [
      { title: 'ID', key: 'id' },
      { title: 'Usuario', key: 'usuario_nombre' },
      { title: 'ID Membresía', key: 'membresia_id' },
      { title: 'Clase', key: 'clase_info' },
      { title: 'Monto', key: 'monto' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id_usuario: null,
      id_membresia: null,
      id_clase: null,
      monto: 0,
      fecha: '',
    },
    defaultItem: {
      id_usuario: null,
      id_membresia: null,
      id_clase: null,
      monto: 0,
      fecha: '',
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
      return this.editedIndex === -1 ? 'Registrar Nuevo Pago' : 'Editar Pago';
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
    this.fetchPayments();
    this.fetchRelatedData(); // Cargar usuarios, membresías, clases
  },

  methods: {
    async fetchPayments() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/payments');
        this.payments = response.data;
      } catch (error) {
        console.error('Error al obtener pagos:', error);
        alert('No se pudieron cargar los pagos.');
      } finally {
        this.loading = false;
      }
    },

    async fetchRelatedData() {
      try {
        const [usersRes, membershipsRes, clasesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/users'),
          axios.get('http://127.0.0.1:8000/api/memberships'),
          axios.get('http://127.0.0.1:8000/api/clases'),
        ]);

        this.users = usersRes.data;
        this.memberships = membershipsRes.data;
        this.clases = clasesRes.data.map(clase => ({
          ...clase,
          tipo_fecha: `${clase.tipo} (${new Date(clase.fecha).toLocaleDateString()})`
        }));
      } catch (error) {
        console.error('Error al obtener datos relacionados:', error);
      }
    },

    openCreateDialog() {
      this.editedIndex = -1;
      this.editedItem = { ...this.defaultItem };
      this.editedItem.fecha = new Date().toISOString().substr(0, 10); // Fecha actual
      this.dialogError = '';
      this.dialog = true;
    },

    editPayment(item) {
      this.editedIndex = this.payments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.fecha = new Date(this.editedItem.fecha).toISOString().substr(0, 10);
      this.dialogError = '';
      this.dialog = true;
    },

    async savePayment() {
      if (!this.$refs.paymentForm.validate()) return;

      this.saving = true;
      this.dialogError = '';

      try {
        if (this.editedIndex > -1) {
          const url = `http://127.0.0.1:8000/api/payments/${this.editedItem.id}`;
          await axios.put(url, this.editedItem);
          Object.assign(this.payments[this.editedIndex], this.editedItem);
          alert('Pago actualizado con éxito.');
        } else {
          const response = await axios.post('http://127.0.0.1:8000/api/payments', this.editedItem);
          this.payments.push(response.data.payment);
          alert('Pago registrado con éxito.');
        }
        this.closeDialog();
        this.fetchPayments();
      } catch (error) {
        console.error('Error al guardar el pago:', error);
        this.dialogError = error.response?.data?.message || 'Error al guardar. Intente de nuevo.';
        if (error.response?.data?.errors) {
          this.dialogError = Object.values(error.response.data.errors).flat().join(' ');
        }
      } finally {
        this.saving = false;
      }
    },

    deletePayment(item) {
      this.editedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },

    async confirmDelete() {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/payments/${this.editedItem.id}`);
        this.payments = this.payments.filter(p => p.id !== this.editedItem.id);
        alert('Pago eliminado con éxito.');
      } catch (error) {
        console.error('Error al eliminar pago:', error);
        alert('Hubo un error al eliminar el pago.');
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
        this.$refs.paymentForm.resetValidation();
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
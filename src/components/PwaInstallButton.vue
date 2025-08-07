<template>
  <div>
    <v-btn
      v-if="showInstallButton"
      color="blue darken-2"
      class="white--text text-none px-4 py-2 rounded-full elevation-5 font-weight-semibold"
      large
      @click="handleInstallClick"
    >
      <v-icon left>mdi-download</v-icon>
      Instalar App
    </v-btn>

    <v-dialog v-model="messageDialog" max-width="350">
      <v-card class="rounded-lg elevation-10 text-center pa-6">
        <v-card-title class="headline text-h5 font-weight-semibold mb-3 text-gray-800">
          Notificación
        </v-card-title>
        <v-card-text class="text-gray-700 mb-4">
          {{ message }}
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="blue darken-1" text @click="messageDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'PwaInstallButton',
  data() {
    return {
      deferredPrompt: null, // Stores the beforeinstallprompt event
      showInstallButton: false, // Controls button visibility
      message: '', // Message for the user
      messageDialog: false, // Controls message modal visibility
    };
  },
  mounted() {
    // Event listener for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    // Event listener for the appinstalled event
    window.addEventListener('appinstalled', this.handleAppInstalled);
  },
  beforeUnmount() {
    // Clean up event listeners when the component is unmounted
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);
  },
  methods: {
    handleBeforeInstallPrompt(e) {
      // Prevents the browser from showing its own install prompt
      e.preventDefault();
      // Stores the event to be triggered later
      this.deferredPrompt = e;
      // Shows the install button to the user
      this.showInstallButton = true;
      this.message = '¡Esta aplicación puede ser instalada en tu dispositivo!';
      this.messageDialog = true;
      console.log('beforeinstallprompt event fired.');
    },
    handleAppInstalled() {
      console.log('PWA installed successfully.');
      this.deferredPrompt = null;
      this.showInstallButton = false;
      this.message = '¡La aplicación ha sido instalada!';
      this.messageDialog = true;
    },
    async handleInstallClick() {
      if (this.deferredPrompt) {
        // Hides the install button
        this.showInstallButton = false;
        // Shows the native browser install prompt
        this.deferredPrompt.prompt();
        // Waits for the user's response to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`The user has ${outcome} the install prompt.`);

        if (outcome === 'accepted') {
          this.message = 'Instalación iniciada...';
        } else {
          this.message = 'Instalación cancelada.';
        }
        this.messageDialog = true;
        this.deferredPrompt = null;
      } else {
        this.message = 'La instalación no está disponible en este momento o ya ha sido instalada.';
        this.messageDialog = true;
      }
    },
  },
};
</script>

<style scoped>
/* You can add specific styles for this component here if needed */
</style>
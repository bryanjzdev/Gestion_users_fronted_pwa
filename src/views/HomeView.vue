<template>
  <v-container fluid fill-height class="home-hero-section pa-0">
    <v-row no-gutters align="center" justify="center" class="h-100">
      <v-col cols="12" class="text-center">
        <div class="hero-content">
          <h1 class="text-h2 font-weight-bold mb-4 text-white">
            Potencia tu Negocio con <span class="primary-text-shadow">Aplicaciones Web Progresivas (PWA)</span>
          </h1>
          <p class="text-h5 text-white mb-8">
            Desarrollado por Bryan Juarez: Tu solución integral para un futuro digital accesible y eficiente.
          </p>
          <v-btn
            color="primary"
            size="x-large"
            rounded="pill"
            class="mr-4 text-none"
            to="/features" 
          >
            Explorar Características
          </v-btn>
          <v-btn
            color="white"
            size="x-large"
            rounded="pill"
            variant="outlined"
            class="text-none"
            to="/login" 
          >
            Iniciar Sesión
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="my-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" class="text-center">
        <h2 class="text-h4 font-weight-bold mb-4 primary--text">¿Qué Ofrece Nuestra Plataforma PWA?</h2>
        <p class="text-body-1 mb-8">
          Nuestra aplicación está diseñada para optimizar la gestión y el acceso a tus servicios, ofreciendo una experiencia robusta y escalable con lo último en tecnología web.
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-card class="pa-5 text-center h-100" elevation="2">
          <v-icon size="60" color="secondary" class="mb-4">mdi-shield-account</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Inicio de Sesión por Roles</h3>
          <p class="text-body-2">
            Control total sobre el acceso de usuarios con permisos personalizables para administradores, empleados y clientes.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-5 text-center h-100" elevation="2">
          <v-icon size="60" color="secondary" class="mb-4">mdi-library</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Gestión de Cursos y Módulos</h3>
          <p class="text-body-2">
            Organiza y administra eficientemente el contenido de tu aplicación con un sistema intuitivo de creación y asignación de clases o módulos.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-5 text-center h-100" elevation="2">
          <v-icon size="60" color="secondary" class="mb-4">mdi-chart-line</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Seguimiento de Progreso y Asistencia</h3>
          <p class="text-body-2">
            Monitoriza el avance de los usuarios y registra su participación en actividades o módulos para una gestión eficaz y personalizada.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4"> <!-- New card for payments -->
        <v-card class="pa-5 text-center h-100" elevation="2">
          <v-icon size="60" color="secondary" class="mb-4">mdi-cash-multiple</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Gestión Integrada de Pagos</h3>
          <p class="text-body-2">
            Simplifica las transacciones y el control financiero con un sistema seguro para procesar suscripciones y servicios.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No se necesitan cambios en el script, ya que la lógica principal está en el marcado.
</script>

<style scoped>
/* Estilos para la sección principal del héroe */
.home-hero-section {
  /* Fondo abstracto que simula un entorno digital o tecnológico */
  background: linear-gradient(135deg, #0f0f0f 0%, #2c3e50 100%); /* Colores más oscuros y tecnológicos */
  /* Remove the specific gym image */
  /* background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('@/assets/gym-hero-bg.jpg'); */
  background-size: cover;
  background-position: center;
  height: 600px; /* Ajusta la altura según tus preferencias */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-content {
  max-width: 900px;
  padding: 20px;
  text-align: center;
}

/* Sombra de texto para el título principal, ajustado a un color que resalte en el nuevo fondo */
.primary-text-shadow {
  text-shadow: 2px 2px 8px rgba(0, 255, 255, 0.5); /* Un brillo cian para un toque tecnológico */
  color: #00bcd4; /* Un color primario más tecnológico, cian/turquesa */
}

/* Ajustes adicionales de estilo para los cards o texto si es necesario */
.primary--text { /* Asegura que el color de este título sea el primary de Vuetify */
  color: #00bcd4 !important; /* Mismo color cian que el texto de la sombra */
}

/* Vuetify v-card elevation and general styling is fine */
.v-card {
  border-radius: 12px; /* Mayor redondeo para un aspecto moderno */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4) !important;
}

.v-btn {
    text-transform: none; /* Asegura que el texto del botón no esté en mayúsculas forzadas */
}

</style>
<template>
  <v-container class="about-page pa-8">
    <v-row class="mb-8">
      <v-col cols="12" md="7">
        <h1 class="text-h3 font-weight-bold primary--text mb-4">
          Nuestra Misión en [Nombre de tu Gimnasio/Centro]
        </h1>
        <p class="text-body-1 mb-4">
          En **[Nombre de tu Gimnasio/Centro]**, estamos dedicados a ser tu socio en el viaje hacia una vida más saludable y plena. Creemos firmemente que el bienestar es más que solo la apariencia física; es una combinación de fuerza, vitalidad y equilibrio mental.
        </p>
        <p class="text-body-1 mb-4">
          Desde **[Año de Fundación]**, hemos construido una comunidad vibrante y de apoyo, donde personas de todas las edades y niveles de experiencia se sienten bienvenidas y motivadas. Nuestro objetivo es inspirarte a superar tus límites, celebrar tus logros y, lo más importante, disfrutar del proceso.
        </p>
        <p class="text-body-1">
          Ofrecemos un ambiente inclusivo y equipos de vanguardia para asegurar que cada visita sea productiva y gratificante. ¡Tu transformación comienza aquí!
        </p>
      </v-col>
      <v-col cols="12" md="5" class="d-flex align-center justify-center">
        <v-img
          src="@/assets/gym-team.jpg" 
          alt="Nuestro equipo en el gimnasio"
          class="rounded-lg elevation-6"
          max-width="500"
        ></v-img>
      </v-col>
    </v-row>

    <v-divider class="my-10"></v-divider>

    <h2 class="text-h4 font-weight-bold text-center primary--text mb-8">
      Nuestros Pilares
    </h2>
    <v-row justify="center" class="mb-8">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6 text-center h-100" elevation="4">
          <v-icon size="70" color="secondary" class="mb-4">mdi-lightbulb-on</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Innovación Constante</h3>
          <p class="text-body-2">
            Siempre buscamos las últimas tendencias y tecnologías para ofrecerte los mejores programas de entrenamiento.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6 text-center h-100" elevation="4">
          <v-icon size="70" color="secondary" class="mb-4">mdi-handshake</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Apoyo Personalizado</h3>
          <p class="text-body-2">
            Te brindamos la atención y el asesoramiento que necesitas para alcanzar tus metas individuales.
          </p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6 text-center h-100" elevation="4">
          <v-icon size="70" color="secondary" class="mb-4">mdi-account-heart</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Comunidad Fuerte</h3>
          <p class="text-body-2">
            Fomentamos un ambiente donde todos se sienten parte de una familia que se apoya mutuamente.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="text-h4 font-weight-bold primary--text mb-4">¡Conócenos!</h2>
        <p class="text-body-1 mb-6">
          ¿Listo para empezar tu viaje con nosotros? ¡Visítanos o contáctanos hoy mismo!
        </p>
        <v-btn
          color="primary"
          size="large"
          rounded="pill"
          class="mr-4 text-none"
          to="/contact" 
        >
          Contáctanos
        </v-btn>
        <v-btn
          color="secondary"
          size="large"
          rounded="pill"
          variant="outlined"
          class="text-none"
          to="/classes" 
        >
          Explora Clases
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

</script>

<style scoped>
.about-page {
  background-color: #f5f5f5; /* Un fondo gris claro para un aspecto limpio */
  min-height: calc(100vh - 64px); /* Ajusta la altura para que ocupe casi toda la pantalla menos el app-bar */
  padding-top: 50px;
  padding-bottom: 50px;
}

.elevation-6 {
  box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada para la imagen */
}
</style>
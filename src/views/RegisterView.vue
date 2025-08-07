<template>
  <div class="register-container">
    <div class="register-wrapper">
      <div class="register-card">
        <!-- Header -->
        <div class="register-header">
          <h1 class="register-title">bry.andev</h1>
          <p class="register-subtitle">Crear Cuenta</p>
        </div>

        <!-- Form -->
        <div class="register-form-container">
          <form @submit.prevent="register" class="register-form">
            <!-- Name Field -->
            <div class="form-group">
              <label for="name" class="form-label">Nombre Completo</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id="name"
                  type="text"
                  class="form-input"
                  placeholder="Tu nombre completo"
                  v-model="form.nombre"
                  :class="{ 'input-error': nameError }"
                  required
                />
              </div>
              <span v-if="nameError" class="error-message">{{ nameError }}</span>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">Correo Electrónico</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  placeholder="tu@email.com"
                  v-model="form.correo_electronico"
                  :class="{ 'input-error': emailError }"
                  required
                />
              </div>
              <span v-if="emailError" class="error-message">{{ emailError }}</span>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password" class="form-label">Contraseña</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  type="password"
                  class="form-input"
                  placeholder="Mínimo 8 caracteres"
                  v-model="form.password"
                  :class="{ 'input-error': passwordError }"
                  required
                />
              </div>
              <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <input
                  id="confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="Confirma tu contraseña"
                  v-model="form.password_confirmation"
                  :class="{ 'input-error': confirmPasswordError }"
                  required
                />
              </div>
              <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
            </div>

            <!-- Role Select -->
            <div class="form-group">
              <label for="role" class="form-label">Rol</label>
              <div class="select-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <select
                  id="role"
                  class="form-select"
                  v-model="form.rol"
                  :class="{ 'input-error': roleError }"
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option v-for="role in roles" :key="role" :value="role">
                    {{ roleLabels[role] }}
                  </option>
                </select>
                <svg class="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <span v-if="roleError" class="error-message">{{ roleError }}</span>
            </div>

            <!-- Error Alert -->
            <div v-if="errorMessage" class="alert-error">
              <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-if="!loading">Crear Cuenta</span>
              <span v-if="loading">Creando cuenta...</span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="register-footer">
          <p class="footer-text">
            ¿Ya tienes una cuenta? 
            <router-link to="/login" class="footer-link">Inicia Sesión aquí</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        nombre: '',
        correo_electronico: '',
        password: '',
        password_confirmation: '',
        rol: '',
      },
      roles: ['admin', 'profesor', 'miembro'],
      roleLabels: {
        admin: 'Administrador',
        profesor: 'Profesor',
        miembro: 'Miembro'
      },
      loading: false,
      errorMessage: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      roleError: '',
    };
  },
  methods: {
    validateForm() {
      this.nameError = '';
      this.emailError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      this.roleError = '';
      
      let isValid = true;
      
      if (!this.form.nombre.trim()) {
        this.nameError = 'El nombre es requerido';
        isValid = false;
      }
      
      if (!this.form.correo_electronico) {
        this.emailError = 'El correo electrónico es requerido';
        isValid = false;
      } else {
        const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailPattern.test(this.form.correo_electronico)) {
          this.emailError = 'Formato de correo electrónico inválido';
          isValid = false;
        }
      }
      
      if (!this.form.password) {
        this.passwordError = 'La contraseña es requerida';
        isValid = false;
      } else if (this.form.password.length < 8) {
        this.passwordError = 'La contraseña debe tener al menos 8 caracteres';
        isValid = false;
      }
      
      if (!this.form.password_confirmation) {
        this.confirmPasswordError = 'Debes confirmar tu contraseña';
        isValid = false;
      } else if (this.form.password !== this.form.password_confirmation) {
        this.confirmPasswordError = 'Las contraseñas no coinciden';
        isValid = false;
      }
      
      if (!this.form.rol) {
        this.roleError = 'Debes seleccionar un rol';
        isValid = false;
      }
      
      return isValid;
    },

    async register() {
      if (!this.validateForm()) return;
      
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register', this.form);
        console.log('Registro exitoso:', response.data);
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al registrar:', error);
        this.errorMessage = error.response?.data?.message || 'Error al registrar. Por favor, intente de nuevo.';
        if (error.response?.data?.errors) {
          this.errorMessage = Object.values(error.response.data.errors).flat().join(' ');
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.register-wrapper {
  width: 100%;
  max-width: 480px;
}

.register-card {
  background: #111111;
  border: 1px solid #333;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.register-header {
  padding: 2.5rem 2rem 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-bottom: 1px solid #333;
}

.register-title {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.register-subtitle {
  margin: 0;
  font-size: 1rem;
  color: #888;
  font-weight: 500;
}

.register-form-container {
  padding: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #cccccc;
  margin-bottom: 0.25rem;
}

.input-wrapper, .select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #666;
  z-index: 1;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-select {
  appearance: none;
  cursor: pointer;
  padding-right: 3rem;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #666;
  pointer-events: none;
}

.form-input::placeholder {
  color: #666;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #555;
  background: #222;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}

.form-input.input-error, .form-select.input-error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-message {
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 500;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.9rem;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%);
  color: #ffffff;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #404040 0%, #525252 100%);
  border-color: #666;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #666;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-footer {
  padding: 1.5rem 2rem 2rem;
  text-align: center;
  border-top: 1px solid #333;
  background: #0f0f0f;
}

.footer-text {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
}

.footer-link {
  color: #cccccc;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .register-container {
    padding: 1rem 0.5rem;
  }
  
  .register-header {
    padding: 2rem 1.5rem 1rem;
  }
  
  .register-title {
    font-size: 1.75rem;
  }
  
  .register-form-container {
    padding: 1.5rem;
  }
  
  .register-footer {
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .register-form {
    gap: 1.25rem;
  }
}
</style>
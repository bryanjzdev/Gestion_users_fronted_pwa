<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Header -->
        <div class="login-header">
          <h1 class="login-title">bry.andev</h1>
          <p class="login-subtitle">Iniciar Sesión</p>
        </div>

        <!-- Form -->
        <div class="login-form-container">
          <form @submit.prevent="login" class="login-form">
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
                  placeholder="••••••••"
                  v-model="form.password"
                  :class="{ 'input-error': passwordError }"
                  required
                />
              </div>
              <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
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
              <span v-if="!loading">Iniciar Sesión</span>
              <span v-if="loading">Iniciando...</span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="login-footer">
          <p class="footer-text">
            ¿No tienes una cuenta? 
            <router-link to="/register" class="footer-link">Regístrate aquí</router-link>
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
        correo_electronico: '',
        password: '',
      },
      loading: false,
      errorMessage: '',
      emailError: '',
      passwordError: '',
    };
  },
  methods: {
    validateForm() {
      this.emailError = '';
      this.passwordError = '';
      
      if (!this.form.correo_electronico) {
        this.emailError = 'El correo electrónico es requerido';
        return false;
      }
      
      const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailPattern.test(this.form.correo_electronico)) {
        this.emailError = 'Formato de correo electrónico inválido';
        return false;
      }
      
      if (!this.form.password) {
        this.passwordError = 'La contraseña es requerida';
        return false;
      }
      
      return true;
    },

    async login() {
      if (!this.validateForm()) return;
      
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', this.form);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.user.rol);
        console.log('Inicio de sesión exitoso:', response.data);

        // Redirigir según el rol
        if (response.data.user.rol === 'admin') {
          this.$router.push('/admin');
        } else if (response.data.user.rol === 'profesor') {
          this.$router.push('/professor');
        } else if (response.data.user.rol === 'miembro') {
          this.$router.push('/member');
        } else {
          this.$router.push('/');
        }

      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Por favor, intente de nuevo.';
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
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: #111111;
  border: 1px solid #333;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.login-header {
  padding: 2.5rem 2rem 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-bottom: 1px solid #333;
}

.login-title {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.login-subtitle {
  margin: 0;
  font-size: 1rem;
  color: #888;
  font-weight: 500;
}

.login-form-container {
  padding: 2rem;
}

.login-form {
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

.input-wrapper {
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

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: #666;
}

.form-input:focus {
  outline: none;
  border-color: #555;
  background: #222;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}

.form-input.input-error {
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

.login-footer {
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
  .login-container {
    padding: 1rem 0.5rem;
  }
  
  .login-header {
    padding: 2rem 1.5rem 1rem;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
  
  .login-form-container {
    padding: 1.5rem;
  }
  
  .login-footer {
    padding: 1rem 1.5rem 1.5rem;
  }
}
</style>
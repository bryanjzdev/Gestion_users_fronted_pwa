import { createRouter, createWebHistory } from 'vue-router';

// Vistas Generales / Públicas
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

// Vistas de Dashboards (Contenedores con Navegación)
import DashboardAdmin from '../views/DashboardAdmin.vue';
import DashboardProfessor from '../views/DashboardProfessor.vue';
import DashboardMember from '../views/DashboardMember.vue';

// Vistas de Gestión para Administrador
import UserManagement from '../views/admin/UserManagement.vue';
import MembershipManagement from '../views/admin/MembershipManagement.vue';
import ClasesManagement from '../views/admin/ClasesManagement.vue';
import AttendanceManagement from '../views/admin/AttendanceManagement.vue';
import PaymentManagement from '../views/admin/PaymentManagement.vue';

// Vistas de Gestión para Profesor
import ProfessorClasses from '../views/professor/ProfessorClasses.vue';
import ProfessorAttendances from '../views/professor/ProfessorAttendances.vue';

// Vistas de Gestión para Miembro
import MyMembership from '../views/member/MyMembership.vue';
import AvailableClasses from '../views/member/AvailableClasses.vue';
import MyAttendances from '../views/member/MyAttendances.vue';
import MyPayments from '../views/member/MyPayments.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas Públicas / Generales
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },

    // Rutas del Dashboard de Administrador
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: DashboardAdmin,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: UserManagement,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/memberships',
      name: 'admin-memberships',
      component: MembershipManagement,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/classes',
      name: 'admin-classes',
      component: ClasesManagement,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/attendances',
      name: 'admin-attendances',
      component: AttendanceManagement,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/admin/payments',
      name: 'admin-payments',
      component: PaymentManagement,
      meta: { requiresAuth: true, roles: ['admin'] }
    },

    // Rutas del Dashboard de Profesor
    {
      path: '/professor',
      name: 'professor-dashboard',
      component: DashboardProfessor,
      meta: { requiresAuth: true, roles: ['profesor'] }
    },
    {
      path: '/professor/classes',
      name: 'professor-classes',
      component: ProfessorClasses,
      meta: { requiresAuth: true, roles: ['profesor'] }
    },
    {
      path: '/professor/attendances',
      name: 'professor-attendances',
      component: ProfessorAttendances,
      meta: { requiresAuth: true, roles: ['profesor'] }
    },

    // Rutas del Dashboard de Miembro
    {
      path: '/member',
      name: 'member-dashboard',
      component: DashboardMember,
      meta: { requiresAuth: true, roles: ['miembro'] }
    },
    {
      path: '/member/membership',
      name: 'member-membership',
      component: MyMembership,
      meta: { requiresAuth: true, roles: ['miembro'] }
    },
    {
      path: '/member/classes',
      name: 'member-classes',
      component: AvailableClasses,
      meta: { requiresAuth: true, roles: ['miembro'] }
    },
    {
      path: '/member/attendances',
      name: 'member-attendances',
      component: MyAttendances,
      meta: { requiresAuth: true, roles: ['miembro'] }
    },
    {
      path: '/member/payments',
      name: 'member-payments',
      component: MyPayments,
      meta: { requiresAuth: true, roles: ['miembro'] }
    },
  ]
});

// Guard de navegación (¡MANTÉN ESTO COMO ESTÁ!)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // Redirigir a una página de acceso denegado o al dashboard de su rol
    if (isAuthenticated) {
      if (userRole === 'admin') {
        next('/admin');
      } else if (userRole === 'profesor') {
        next('/professor');
      } else if (userRole === 'miembro') {
        next('/member');
      } else {
        next('/'); // Rol desconocido o no manejado
      }
    } else {
      next('/login'); // No autenticado y no tiene el rol
    }
  } else {
    next();
  }
});

export default router;
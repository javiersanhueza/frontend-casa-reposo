import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/public/LoginPage/LoginPage.vue'),
        name: 'Login'
      },
      {
        path: 'register',
        component: () => import('pages/public/RegisterPage/RegisterPage.vue'),
        name: 'Register'
      },
      {
        path: 'forgot-password',
        component: () => import('pages/public/ForgotPasswordPage/ForgotPasswordPage.vue'),
        name: 'ForgotPassword'
      },
      {
        path: 'reset-password/:token',
        component: () => import('pages/public/ResetPasswordPage/ResetPasswordPage.vue'),
        name: 'ResetPassword'
      },
      {
        path: 'change-company',
        component: () => import('pages/private/ChangeCompanyPage/ChangeCompanyPage.vue'),
        name: 'ChangeCompany',
        meta: { isProtectedRoute: true }
      }
    ],
  },
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      {
        path: 'home',
        component: () => import('pages/private/HomePage/HomePage.vue'),
        name: 'Home',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'profile',
        component: () => import('pages/private/EditUserPage/EditUserPage.vue'),
        name: 'EditUser',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'residents',
        component: () => import('pages/private/ResidentPage/ResidentPage.vue'),
        name: 'ResidentPage',
        meta: {
          isProtectedRoute: true,
          allowedRoles: ['admin'] }
      },
      {
        path: 'new-resident',
        component: () => import('pages/private/ResidentPage/NewResidentPage.vue'),
        name: 'NewResidentPage',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'edit-resident/:idResident',
        component: () => import('pages/private/ResidentPage/EditResidentPage.vue'),
        name: 'EditResidentPage',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'clinical-history/:idResident',
        component: () => import('pages/private/ClinicalHistoryPage/ClinicalHistoryPage.vue'),
        name: 'ClinicalHistoryPage',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'accidents',
        component: () => import('pages/private/AccidentsPage/AccidentsPage.vue'),
        name: 'Accidents',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'areas',
        component: () => import('pages/private/AreasPage/AreasPage.vue'),
        name: 'Areas',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'employee',
        component: () => import('pages/private/EmployeePage/EmployeePage.vue'),
        name: 'Employee',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'option-maintainer',
        component: () => import('pages/private/OptionsMaintainerPage/OptionsMaintainerPage.vue'),
        name: 'OptionMaintainer',
        meta: { isProtectedRoute: true }
      },
      {
        path: 'users',
        component: () => import('pages/private/UsersPage/UsersPage.vue'),
        name: 'UsersPage',
        meta: {
          isProtectedRoute: true,
          allowedRoles: ['superUser', 'admin']
        }
      },
      {
        path: 'residences',
        component: () => import('pages/private/ResidencesPage/ResidencesPage.vue'),
        name: 'ResidencesPage',
        meta: {
          isProtectedRoute: true,
          allowedRoles: ['superUser']
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

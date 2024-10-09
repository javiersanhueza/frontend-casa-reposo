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
      }
    ],
  },
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      {
        path: 'home',
        component: () => import('pages/private/HomePage.vue'),
        name: 'Home',
        meta: { isProtectedRoute: true }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

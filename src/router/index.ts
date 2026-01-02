import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';

interface UserRoles {
  superUser: boolean;
  admin: boolean;
  owner: boolean;
  employee: boolean;
  proxy: boolean;
  [key: string]: boolean;
}

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const isProtectedRoute = to.matched.some(item => item.meta.isProtectedRoute);
    const allowedRoles = to.meta.allowedRoles as string[] | undefined;

    if (isProtectedRoute && !token) {
      return next({ name: 'Login' });
    }

    if (!isProtectedRoute && token !== null && to.name === 'Login') {
      return next({ name: 'Home' });
    }

    if (allowedRoles && user && user.roles) {
      const hasPermission = allowedRoles.some((roleKey) => {
        return user.roles[roleKey as keyof UserRoles] === true;
      });

      if (!hasPermission) {
        return next({ name: 'Home' });
      }
    }

    next();
  });

  return Router;
});

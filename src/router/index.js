import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../pages/TheHome.vue'),
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import('../pages/TheFavorite.vue'),
  },

  {
    path: '/:notFound(.*)',
    redirect: '/',
  },
];

export const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  linkActiveClass: 'active-nav-link',
  routes,
});

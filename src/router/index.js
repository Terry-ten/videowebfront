import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/videos',
    name: 'VideosView',
    component:() => import('../views/BackView/VideosView.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/comments',
    name: 'CommentsView',
    component:() => import('../views/BackView/CommentsView.vue'),
    meta: { requiresAuth: true },

  },
  {
    path: '/users',
    name: 'UserView',
    component:() => import('../views/BackView/UsersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/', 
    redirect: '/login'
  },
  {
    path: '/reports',
    name: 'ReportsView',
    component:() => import('../views/BackView/ReportsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/types',
    name: 'CategoryView',
    component:() => import('../views/BackView/CategoryView.vue'),
  },
  {
    path: '/videoweb',
    name: 'MainView',
    component:() => import('../views/UpView/MainView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/watch',
    name: 'PlayView',
    component:() => import('../views/UpView/PlayView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/userupload',
    name: 'MyUploadView',
    component:() => import('../views/UpView/MyUploadView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/myvideos',
    name: 'MyVideos',
    component:() => import('../views/UpView/MyVideos.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/othersinfo',
    name: 'OthersView',
    component:() => import('../views/UpView/OthersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/myinfo',
    name: 'PersonalView',
    component:() => import('../views/UpView/PersonalView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/notfound',
    name: 'NotFoundView',
    component:() => import('../views/UpView/NotFoundView.vue'),
  },
  {
    path: '/login',
    name: 'LoginView',
    component:() => import('../views/LoginView/LoginView.vue'),
  },
  
  {
    path: '/regist',
    name: 'RegistView',
    component:() => import('../views/LoginView/RegistView.vue'),
    meta: { requiresAuth: true },
  },
  
  {
    path: '/menus',
    name: 'MenuView',
    component:() => import('../views/BackView/MenuView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/logs',
    name: 'LogsView',
    component:() => import('../views/BackView/LogsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/roles',
    name: 'RoleView',
    component:() => import('../views/BackView/RoleView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/permissions',
    name: 'PermissionView',
    component:() => import('../views/BackView/PermissionView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/database',
    name: 'DataBaseView',
    component:() => import('../views/BackView/DataBaseView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admininfo',
    name: 'AdminView', 
    component:() => import('../views/BackView/AdminView.vue'),
    meta: { requiresAuth: true },
  },
]
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  // 检查路由元信息是否需要进行身份验证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查本地存储中是否有 token
    const token = localStorage.getItem('token');
    if (!token) {
      // 如果没有 token，则重定向到登录页面
      next({ path: '/login' });
    } else {
      // 如果有 token，则允许访问
      next();
    }
  } else {
    // 如果路由不需要身份验证，直接允许访问
    next();
  }
});

export default router

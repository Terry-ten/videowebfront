import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import axios from './plugins/axios';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(store);
app.use(router);
app.use(ElementPlus);
// 将 Axios 添加为全局属性
app.config.globalProperties.$axios = axios;
window.axios = axios;
app.mount('#app');

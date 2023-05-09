import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import axios from './plugins/axios';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus);
// 将 Axios 添加为全局属性
app.config.globalProperties.$axios = axios;
window.axios = axios;
app.mount('#app');

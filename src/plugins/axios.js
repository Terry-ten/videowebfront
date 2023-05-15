import router from '@/router';
import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] =token;
      console.log('token:', token); 
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    if (response.data.msg === 'NOT_LOGIN') {
      // 未登录时的处理逻辑，例如重定向到登录页面
      router.push("/login")
    }
    if(response.data.code===403){
      alert("你无权访问此页面")
      router.push("/admininfo")
      
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;
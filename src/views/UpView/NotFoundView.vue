<template>
    <div class="not-found-container">
      <div class="not-found-text">
        <h1>404</h1>
        <p>抱歉，找不到您要访问的页面。</p>
        <router-link to="/videoweb" class="home-link">返回首页</router-link>
        <p>5 秒后自动跳转到首页...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
    mounted() {
      this.timer = setTimeout(() => {
        this.$router.push('/videoweb');
      }, 5000);
    },
    beforeUnmount() {
      clearTimeout(this.timer);
    },
  };
  </script>
  
  <style scoped>
  .not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    background-color: #f7f7f7;
  }
  
  .not-found-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  h1 {
    font-size: 80px;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .home-link {
    font-size: 18px;
    color: #42a5f5;
    text-decoration: none;
  }
  
  .home-link:hover {
    text-decoration: underline;
  }
  </style>
  
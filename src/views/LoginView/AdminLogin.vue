<template>
    <div class="login-container">
      <div class="form-container">
        <el-card class="login-card">
          <h2 class="login-title">管理员登录</h2>
          <el-form ref="loginForm" :model="loginForm" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="user-login" @click="goToUser">切换为用户登录</div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script>
import axios from '../../plugins/axios';
  export default {
    data() {
      return {
        loginForm: {
          username: "",
          password: "",
        },
      };
    },
    methods: {
      login() {
        localStorage.removeItem('token')
        localStorage.removeItem('userdata')
        axios.post("/api/admin",{
          username: this.loginForm.username,
          password: this.loginForm.password,
        }).then((result) => {
          if(result.data.code===200){
            localStorage.setItem('token',result.data.data.token)
            localStorage.setItem('userdata',JSON.stringify( result.data.data.object))

            this.$router.push("/users");
          }else{
            this.$message.error(result.data.msg)
          }
        }).catch((err) => {
          this.$message.error(err)
        });
      },
      goToUser() {
        this.$router.push({ path: "/login" });
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    position: relative;
    height: 100vh;
    background-color: #91d5ff;
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent);
    background-size: 50px 50px;
    overflow: hidden;
  }
  
  .form-container {
    position: absolute;
    top: 30%;
    left: 0;
    right: 0;
  }
  
  .login-card {
    width: 40%;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .login-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  .user-login {
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
    text-align: right;
    margin-top: 10px;
  }
  </style>
  
<template>
  <div class="login-container">
    <div class="form-container">
      <el-card class="login-card">
        <h2 class="login-title">用户登录</h2>
        <el-form
          ref="loginForm"
          :model="loginForm"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item prop="username" label="用户名">
            <el-input
              @keyup.enter="login"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              @keyup.enter="login"
              v-model="loginForm.password"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="goToRegister">注册</el-button>
          </el-form-item>
        </el-form>
        <div class="bottom-links">
          <!-- <div class="admin-login" @click="goToAdmin()">切换为管理员登录</div> -->
          <div class="forgot-password" @click="openForgotPasswordDialog()">
            忘记密码？
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="忘记密码"
      v-model="forgotPasswordDialogVisible"
      width="30%"
    >
      <el-form :model="forgotPasswordForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="checkusername"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkUserExists"> 确定 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="重置密码" v-model="questionDialog" width="30%">
      <el-form :model="resetPasswordForm" label-width="100px">
        <el-form-item label="问题">
          <span>{{ resetPasswordForm.question }}</span>
        </el-form-item>
        <el-form-item label="答案">
          <el-input v-model="resetPasswordForm.answer"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkvalid"> 确定 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script>
import axios from "../../plugins/axios";
// import { query } from 'express';
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      forgotPasswordDialogVisible: false,
      questionDialog: false,
      checkusername: "",
      resetPasswordForm: {
        question: "",
        answer: "",
        newPassword: "",
      },
      rules: {
        username: {
          required: true,
          message: "用户名不能为空",
          trigger: "blur",
        },
        password: {
          required: true,
          message: "密码不能为空",
          trigger: "blur",
        },
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.$message.error("请正确填写登录信息！");
          return;
        }

        // 删除旧的 token 和用户数据
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");

        // 发送登录请求的逻辑
        axios
          .post("/api/login", this.loginForm)
          .then((result) => {
            if (result.data.code === 200) {
              localStorage.setItem("token", result.data.data.token);
              localStorage.setItem(
                "userdata",
                JSON.stringify(result.data.data.object)
              );
              this.$router.push("/videoweb");
            } else {
              this.$message.error("登陆失败，请重新输入！");
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      });
    },

    goToAdmin() {
      this.$router.push("/admin");
    },
    goToRegister() {
      this.$router.push("/regist");
    },
    openForgotPasswordDialog() {
      this.forgotPasswordDialogVisible = true;
    },
    checkUserExists() {
      axios
        .get("/api/login/users/question/get/" + this.checkusername)
        .then((result) => {
          if (result.data.code === 200) {
            this.resetPasswordForm.question = result.data.data;
            this.forgotPasswordDialogVisible = false;
            this.questionDialog = true;
          } else {
            this.$message.err(result.data.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    checkvalid() {
      if (this.validateNewPassword()) {
        axios
          .post("/api/login/users/password/update", {
            username: this.checkusername,
            question: this.resetPasswordForm.question,
            answer: this.resetPasswordForm.answer,
            password: this.resetPasswordForm.newPassword,
          })
          .then((result) => {
            if (result.data.code === 1) {
              this.$message.success(result.data.msg);
              this.questionDialog = false;
            } else {
              this.$message.error(result.data.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      }
    },
    validateNewPassword() {
      const password = this.resetPasswordForm.newPassword;
      const passwordRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!password) {
        this.$message.error("新密码不能为空");
        return false;
      }
      if (!passwordRegex.test(password)) {
        this.$message.error("新密码必须为6-20位，不能是纯数字或纯英文");
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.login-container {
  position: relative;
  height: 100vh;
  background-color: #91d5ff;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
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

.admin-login {
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  text-align: right;
  margin-top: 10px;
}

.forgot-password {
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  margin-top: 10px;
}

.el-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bottom-links {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.admin-login,
.forgot-password {
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}
</style>
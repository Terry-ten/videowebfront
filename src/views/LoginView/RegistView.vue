<template>
  <div class="register-container">
    <div class="form-container">
      <el-card class="register-card">
        <h2 class="register-title">用户注册</h2>
        <el-form
          ref="registerForm"
          :model="registerForm"
          label-width="120px"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phonenumber">
            <el-input v-model="registerForm.phonenumber"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idcard">
            <el-input v-model="registerForm.idcard"></el-input>
          </el-form-item>
          <el-form-item label="密保问题" prop="question">
            <el-input v-model="registerForm.question"></el-input>
          </el-form-item>
          <el-form-item label="密保答案" prop="answer">
            <el-input v-model="registerForm.answer"></el-input>
          </el-form-item>
        </el-form>
        <div class="buttons">
          <el-button type="primary" @click="submitForm()" size="large"
            >注册</el-button
          >
          <el-button @click="goToLogin" size="large">返回登录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
  
  <script>
import axios from '../../plugins/axios';
export default {
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        phonenumber: "",
        idcard: "",
        question: "",
        answer: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "用户名长度应在 3 到 15 个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: this.validatePassword, trigger: "blur" },
        ],
        phonenumber: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: this.validatePhone, trigger: "blur" },
        ],
        idcard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          { validator: this.validateIdCard, trigger: "blur" },
        ],
        question: [
          { required: true, message: "密保问题不能为空", trigger: "blur" },
        ],
        answer: [
          { required: true, message: "密保答案不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    validatePassword(rule, value, callback) {
      const reg = /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/;
      if (!value) {
        callback(new Error("密码不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("密码必须包含至少一个字母和数字，长度为6-20位"));
      } else {
        callback();
      }
    },
    goToLogin() {
      this.$router.push({ name: "LoginView" });
    },
    validatePhone(rule, value, callback) {
      const reg = /^1[3-9]\d{9}$/;
      if (!value) {
        callback(new Error("手机号不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入有效的手机号"));
      } else {
        callback();
      }
    },
    validateIdCard(rule, value, callback) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!value) {
        callback(new Error("身份证号不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入有效的身份证号"));
      } else {
        callback();
      }
    },
    submitForm() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          // 在此处执行注册逻辑
          axios
            .post("/api/regist/users/add", this.registerForm)
            .then((result) => {
              if (result.data.code === 1) {
                this.$message.success("注册成功");
              } else {
                this.$message.error(result.data.msg);
              }
            })
            .catch((err) => {
              this.$message.error(err);
            });
        } else {
          console.log("表单验证失败");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.register-container {
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
  top: 10%;
  left: 0;
  right: 0;
}
.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.buttons > button {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
}
.register-card {
  width: 40%;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.register-title {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  color: #409eff;
}
</style>
  
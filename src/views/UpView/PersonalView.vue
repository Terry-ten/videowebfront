<template>
  <div>
    <el-container class="main-container">
      <el-header class="header">
        <div class="logo">我的个人信息</div>
        <up-head-image :avatarUrl="me.headimage"></up-head-image>
      </el-header>
      <el-container>
        <el-aside width="10%">
          <el-menu >
              <el-menu-item index="1" @click="gotomain">返回首页</el-menu-item>
          
          </el-menu>
        </el-aside>
        <el-main>
          <el-card class="user-info-card">
            <h2>个人信息</h2>
            <el-form
              ref="userInfoForm"
              :model="userInfoForm"
              
              label-width="120px"
            >
              <el-form-item label="用户名" prop="username" :rules="rules.username">
                <el-input v-model="userInfoForm.username"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phonenumber" :rules="rules.phonenumber">
                <el-input v-model="userInfoForm.phonenumber"></el-input>
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input
                  v-model="userInfoForm.introduction"
                  type="textarea"
                  :rows="4"
                  :maxlength="100"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="头像" prop="headimage">
                <el-upload
                  ref="upload"
                  :file-list="userInfoForm.avatarList"
                  :auto-upload="false"
                  :list-type="'picture-card'"
                  :headers="authHeaders"
                  :on-change="beforeAvatarUpload"
                  name="headimage"
                >
                  <template v-slot:trigger>
                    <el-button size="small" type="primary">选择图片</el-button>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo()"
                  >更新个人信息</el-button
                >
                <el-button @click="showChangePasswordDialog"
                  >修改密码</el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
          <el-dialog
            title="修改密码"
            v-model="changePasswordDialogVisible"
            width="30%"
          >
            <div>{{ securityQuestion }}</div>
            <el-input
              v-model="changePasswordForm.answer"
              placeholder="请输入问题的答案"
            ></el-input>
            <el-input
              v-model="changePasswordForm.password"
              placeholder="请输入新密码"
              show-password
            ></el-input>
            <span>
              <el-button type="primary" @click="this.verifySecurityAnswer()"
                >确认</el-button
              >
            </span>
            <span class="dialog-footer">
              <el-button @click="changePasswordDialogVisible = false"
                >取消</el-button
              >
            </span>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


  
<script>
import axios from "../../plugins/axios";
import UpHeadImage from "../PopularElment/UpHeadImage.vue";
export default {
  components:{
    UpHeadImage
  },

  data() {
    return {
      avatarIsValid: true,
      isCollapse: false,
      headimage: "",
      userInfoForm: {
        username: "",
        phonenumber: "",
        introduction: "",
        avatarList: [],
      },
      tempimage: "",
      userToken: localStorage.getItem("token"),
      authHeaders: { 
        token: this.userToken,
      },
      me: {},
      changePasswordDialogVisible: false,
      changePasswordForm: {
        answer: "",
        password: "",
      },
      securityQuestion: "",
      isAnswerCorrect: false,
      rules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
      ],
      phonenumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    },
    };
  },
  methods: {
    validatePhone(value, callback) {
      const reg = /^1[3-9]\d{9}$/;
      if (!value) {
        callback(new Error("手机号不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入有效的手机号"));
      } else {
        callback();
      }
    },
    gotomain(){
      this.$router.push("/videoweb")
    },
    updateUserInfo() {
      this.$refs['userInfoForm'].validate((valid) => {
        if (!this.avatarIsValid) {  // 添加这一段
        this.$message.error("头像未通过验证");
        return;
      }
        if (valid) {
          console.log("上传的文件为"+this.userInfoForm.avatarList[0]?.raw);
      axios
        .post("/api/users/update", {
          headimage: this.userInfoForm.avatarList[0]?.raw,
          
          username: this.userInfoForm.username,
          phonenumber: this.userInfoForm.phonenumber,
          introduction: this.userInfoForm.introduction,
          headimageurl:this.me.headimage,
          id: this.me.id,
        }, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          if (result.data.code === 1) {
            this.$message.success(result.data.msg)
            this.updateme(this.me)
            console.log(this.me.headimage)
          } else {
            this.$message.error(result.data.msg);
          }
        })}
         else {
          this.$message.error('提交出错');
            return false;
        }
    });
},
    showChangePasswordDialog() {
      this.changePasswordDialogVisible = true;
      this.securityQuestion = this.me.question;
    },
    
    verifySecurityAnswer() {
      if (this.changePasswordForm.answer === this.me.answer) {
        this.isAnswerCorrect = true;
      }
      if (this.isAnswerCorrect) {
        axios
          .put("/api/users/password/update/" + this.changePasswordForm.password)
          .then((result) => {
            if (result.data.code === 1) {
              this.$message.success(result.data.msg);
            } else {
              this.$message.error(result.data.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      } else {
        this.$message.error("答案错误，请重试");
      }
    },

    updateme(me){
      axios.get("/api/users/get/"+me.id).then((result) => {
            this.me.username = result.data.data.username;
            this.me.phonenumber = result.data.data.phonenumber;
            this.me.introduction = result.data.data.introduction;
            this.me.headimage = result.data.data.headimage; 
            this.me.password=result.data.data.password;
            console.log("更新本用户信息已经准备执行")
            localStorage.removeItem("userdata");
            localStorage.setItem('userdata',JSON.stringify( result.data.data))
            console.log("更新本用户信息已经准备完毕"+this.me.headimage)
            })
    },
    fillForm(me) {
      this.userInfoForm.username = me.username;
      this.userInfoForm.phonenumber = me.phonenumber;
      this.userInfoForm.introduction = me.introduction;
      this.headimage = me.headimage;
      console.log(me.headimage);
    },
    beforeAvatarUpload(file) {
    
      console.log("文件为："+file.raw)
      console.log("文件的类型为："+file.raw.type)

      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        this.avatarIsValid = false;  // 添加这一行
        return false;
      }
      this.userInfoForm.avatarList = [file];
      this.avatarIsValid = true;
      return true;
    },
  },
  mounted() {
    setTimeout(() => {
      this.me = JSON.parse(localStorage.getItem("userdata"));
      this.updateme(this.me)
      console.log(this.me);
      this.fillForm(this.me);
      this.authHeaders.token = this.userToken;
    }, 0);
  },
};
</script>
<style scoped>

.el-container {
  padding-top: 30px;
}


.el-header {
  background-color: #409eff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 0px 6px rgba(16, 16, 16, 0.59);
}

.logo {
  color: #fff;
  font-size: 30px;
  margin-left: 20px;
}



.user-info-card {
  width: 100%;
  padding: 20px;
}
.el-menu-item{
  font-size: 20px;
  color: #fff;
}
.el-menu{
  background: #76bbff;
  border-right: 0;
}
.el-aside{
  background: #76bbff;
  box-shadow: 0 0px 6px rgba(16, 16, 16, 0.59);
}
</style>

  
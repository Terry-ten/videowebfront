<template>
  <div>
    <el-container class="main-container">
      <el-header class="header">
        <div class="logo">我的个人信息</div>
        <up-head-image :avatarUrl="me.headimage"></up-head-image>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :collapse="isCollapse" router default-active="1">
            <el-menu-item index="1">
              <i class="el-icon-user"></i>
              <template v-slot:title>
                <span>个人信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-star-on"></i>
              <template v-slot:title>
                <span>我的关注</span>
              </template>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-s-custom"></i>
              <template v-slot:title>
                <span>我的粉丝</span>
              </template>
            </el-menu-item>
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
              <el-form-item label="用户名">
                <el-input v-model="userInfoForm.username"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userInfoForm.phonenumber"></el-input>
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input
                  v-model="userInfoForm.introduction"
                  type="textarea"
                  :rows="4"
                  :maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="头像">
                <el-upload
                  ref="upload"
                  :action="uploadAvatarUrl"
                  :file-list="userInfoForm.avatarList"
                  :auto-upload="false"
                  :list-type="'picture-card'"
                  :headers="authHeaders"
                  :on-change="handleChange"
                  :before-upload="beforeAvatarUpload"
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
      uploadAvatarUrl: "/api/users/update",
      isAnswerCorrect: false,
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.userInfoForm.avatarList = fileList.slice(-1);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.tempimage = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    },
    updateUserInfo() {
      

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
    handleAvatarSuccess(result) {
      // 处理上传头像成功的回调
      this.tempimage = result.data;
      this.userInfoForm.avatarList = [
        {
          name: "",
          url: result.data,
        },
      ];
    },
    updateme(me){
      axios.get("/api/users/get/"+me.id).then((result) => {
            this.me.username = result.data.data.username;
            this.me.phonenumber = result.data.data.phonenumber;
            this.me.introduction = result.data.data.introduction;
            this.me.headimage = result.data.data.headimage; 
            this.me.password=result.data.data.password;
            localStorage.removeItem("userdata");
            localStorage.setItem('userdata',JSON.stringify( result.data.data))
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
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        return false;
      }
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
.main-container {
  height: 100vh;
}

/* .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409eff;
  height: 60px;
} */
.el-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.logo {
  color: #fff;
  font-size: 24px;
  margin-left: 20px;
}

.avatar-dropdown {
  margin-right: 20px;
  cursor: pointer;
}

.user-info-card {
  width: 100%;
  padding: 20px;
}
</style>

  
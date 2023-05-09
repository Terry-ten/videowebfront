<template>
    <div class="header-avatar avatar-dropdown">
        <el-dropdown >
          <span class="el-dropdown-link">
            <el-avatar
              size="large"
              icon="el-icon-user-solid"
              :src="avatarUrl"
            >
            </el-avatar>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="gotoAdmin()"
                >进入后台管理</el-dropdown-item
              >
              <el-dropdown-item @click="editProfile()"
                >编辑资料</el-dropdown-item
              >
              <el-dropdown-item @click="myCreation()"
                >我的创作</el-dropdown-item
              >
              <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    
    </div>
  </template>
  
  <script>
  export default {
    props: {
    avatarUrl: {
      type: String,
      required: true
    }
  },
    methods: {
    gotoAdmin(){
        this.$router.push("/admininfo")
        },
    editProfile(){
        this.$router.push("/myinfo")
      },
    myCreation() {
        this.$router.push("/myvideos")
      },
    logout() {
        this.$router.push("/login")
      }
    }
  };
  </script>
  
  <style scoped>
  .avatar-dropdown {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  line-height: normal;
}
  </style>
  
<template>
  <div class="header-avatar">
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          size="large"
          icon="el-icon-user-solid"
          :src="avatarUrl"
        ></el-avatar>
      </span>
      <template #dropdown>
      <el-dropdown-menu >
        <el-dropdown-item @click="goToVideoWeb">返回视频页</el-dropdown-item>
        <el-dropdown-item @click="goToProfile">个人主页</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
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
    goToVideoWeb(){
      this.$router.push("/videoweb")
    },
    goToProfile() {
      this.$router.push("/admininfo")
    },
    logout() {
      this.$router.push("/login")
    }
  }
};
</script>

<style scoped>
.header-avatar {
  position: absolute;
  right: 20px;
  cursor: pointer;
}
</style>

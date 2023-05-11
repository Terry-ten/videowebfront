<template>
  <div>
    <el-container class="main-container">
      <el-header class="header">
        <div class="logo">用户信息展示</div>
        <up-head-image :avatarUrl="me.headimage"></up-head-image>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :collapse="isCollapse" router default-active="1">
            <el-menu-item index="1" @click="goHome">
              <i class="el-icon-house"></i>
              <template v-slot:title>
                <span>返回首页</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main v-if="!userNotFound">
         
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template #title>
                <span>个人信息</span>
              </template>
              <div class="user-info-container">
                <el-avatar :src="userInfo.headimage"></el-avatar>
                <h2>{{ userInfo.username }}</h2>
                <p>{{ userInfo.introduction }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
       
        
          <el-table :data="userVideos" style="width: 100%">
            <el-table-column prop="coverimage" label="封面">
              <template #default="{ row }">
                <img @click="gotoWatch(row.id)" :src="row.coverimage" class="video-cover" />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="description" label="简介"></el-table-column>
            <el-table-column prop="watchcount" label="播放量"></el-table-column>
            <el-table-column prop="goods" label="点赞量"></el-table-column>
            <el-table-column
              prop="createtime"
              label="发布时间"
            ></el-table-column>
          </el-table>
        
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
      userId: null,
      userNotFound: false,
      userInfo: {},
      userVideos: [],
      loading: false,
      activeNames: ["1"],
      me:{},
    };
  },
  methods: {
    goHome() {
      this.$router.push("/videoweb");
    },
    getUserInfo() {
      // 获取用户信息
      // 替换为真实的接口
      this.loading = true;
          axios.get("/api/users/get/"+this.userId).then((result) => {
            if(result.data.code===200){
              this.userInfo = result.data.data
              this.getUserVideos(result.data.data.username);
            }else if(result.data.data==null){
              this.$router.push("/notfound")
            }else{
              this.$router.push("/notfound")
            }
          })
    },
    getUserVideos(username) {
        axios.get("/api/videos/users/"+username).then((result) => {
            this.userVideos = result.data.data
        })
    },
    gotoWatch(id){
      this.$router.push({
        path: "/watch",
        query: { id: id },
      });
    }
    
  },
  mounted() {
    
    this.me = JSON.parse(localStorage.getItem("userdata"));
    if(this.$route.query.id==null){
      this.$router.push("/notfound")
    }
    this.userId = this.$route.query.id;
    this.getUserInfo();
  },
};
</script>

<style scoped>
.logo {
  font-size: 30px;
  color: white;
  margin: 0; 
}

.video-cover {
  width: 100px;
  height: auto;
}
.el-menu-item {
  font-size: 20px; /* 修改字体大小 */
  color: #fff; /* 修改字体颜色为白色 */
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #409eff;
  height: 60px;
  position: relative; /* 添加这一行 */
}
.user-info-container {
  text-align: left;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}
el-menu{
  border-right: 0 !important;
}
el-aside{
  background-color: #409eff;
}

</style>"
  
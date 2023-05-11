<template>
  <div>
    <el-container class="main-container">
      <el-header class="header">
        <div class="logo">我要上传视频</div>
        <up-head-image :avatarUrl="me.headimage"></up-head-image>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :collapse="isCollapse" router default-active="1">
            <el-menu-item index="1" @click="$router.push('/videoweb')">
              <i class="el-icon-menu"></i>
              <template v-slot:title>
                <span>返回主页</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2" @click="$router.push('/myvideos')">
              <i class="el-icon-video-play"></i>
              <template v-slot:title>
                <span>查看我的视频</span>
              </template>
            </el-menu-item>
            <el-menu-item index="3" @click="$router.push('/userupload')">
              <i class="el-icon-video-play"></i>
              <template v-slot:title>
                <span>我要上传视频</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-card class="upload-form-card">
            <h2>上传视频</h2>
            <el-form ref="uploadForm" :model="uploadForm" label-width="120px">
              <el-form-item label="视频标题">
                <el-input
                  v-model="uploadForm.title"
                  :maxlength="10"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="视频简介">
                <el-input
                  v-model="uploadForm.description"
                  type="textarea"
                  :rows="4"
                  :maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="视频类别">
                <el-select
                  v-model="uploadForm.type"
                  placeholder="请选择视频类别"
                >
                  <el-option
                    v-for="typ in uploadForm.types"
                    :key="typ.id"
                    :label="typ.typename"
                    :value="typ.typename"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="视频封面">
                <el-upload
                  action=""
                  :on-change="handleCoverChange"
                  :file-list="uploadForm.coverList"
                  :auto-upload="false"
                  :list-type="'picture'"
                >
                  <template v-slot:trigger>
                    <el-button size="small" type="primary">选择图片</el-button>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="视频文件">
                <el-upload
                  action=""
                  :on-change="handleVideoChange"
                  :file-list="uploadForm.videoList"
                  :auto-upload="false"
                  :before-upload="beforeVideoUpload"
                  :list-type="'text'"
                >
                  <template v-slot:trigger>
                    <el-button size="small" type="primary">选择视频</el-button>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm()">提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
  <script>
import axios from '../../plugins/axios';
import UpHeadImage from "../PopularElment/UpHeadImage.vue";
export default {
  components:{
    UpHeadImage
  },
  data() {
    return {
      isCollapse: false,
      uploadForm: {
        title: "",
        description: "",
        coverList: [],
        videoList: [],
        types: [],
      },
      me:{},
    };
  },
  methods: {
    validateForm() {
      if (!this.uploadForm.title) {
        this.$message.error("视频标题不能为空");
        return false;
      }

      if (!this.uploadForm.type) {
        this.$message.error("必须选择一个类别");
        return false;
      }

      if (this.uploadForm.coverList.length === 0) {
        this.$message.error("图片为空或者格式错误");
        return false;
      }

      if (this.uploadForm.videoList.length === 0) {
        this.$message.error("视频为空或者格式错误");
        return false;
      }

      return true;
    },
    handleCoverChange(file) {
  if(!["image/png", "image/jpeg"].includes(file.raw.type)) {
    this.$message.error("图片格式必须为png或者jpg");
  } else {
    console.log("文件类型"+file.raw.type);
    this.uploadForm.coverList = [file];
  }
},
handleVideoChange(file) {
  if(file.raw.type !== "video/mp4") {
    this.$message.error("视频格式必须为MP4");
  } else {
    this.uploadForm.videoList = [file];
  }
},
    beforeVideoUpload(file) {
      const isMp4 = file.type === "video/mp4";
      if (!isMp4) {
        this.$message.error("请上传MP4格式的视频文件");
      }
      return isMp4;
    },
    fetchTypes() {
      axios
        .get("/api/types/all")
        .then((response) => {
          this.uploadForm.types = response.data.data;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    submitForm() {
      if (!this.validateForm()) {
        return;
      }

      const uploadUrl = "/api/videos/add";
      const formData = new FormData();
      formData.append("author",this.me.username)
      formData.append("title", this.uploadForm.title);
      formData.append("description", this.uploadForm.description);
      formData.append("coverimage", this.uploadForm.coverList[0]?.raw);
      formData.append("videolocation", this.uploadForm.videoList[0]?.raw);
      formData.append("type",this.uploadForm.type)
      axios 
        .post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.$message.success("视频上传成功");
          this.$router.push("/myvideos");
        })
        .catch(() => {
          this.$message.error("视频上传失败");
        });
    },
  },
  mounted(){
    this.me=JSON.parse(localStorage.getItem('userdata'))
    this.fetchTypes();
  }
};
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  position: relative;
  height: 70px;
  line-height: 70px;
  background-color: #42a5f5; /* 浅蓝色 */
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.logo {
  font-size: 24px;
  color: white;
}

/* .avatar-dropdown {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  line-height: normal;
} */

.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.upload-form-card {
  width: 80%;
  max-width: 800px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.356), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-aside {
  background-color: #64b5f6; 
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.29), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-menu {
  background-color: #64b5f6; 
  text-color: #fff;
  active-text-color: #1e9fff;
}

.el-menu-item {
  border-bottom: 1px solid #42a5f5;
}

.el-menu-item.is-active {
  background-color: #42a5f5;
}

.el-container {
  height: 100%;
}

.el-menu-item span {
  color: white; 
}
</style>

<template>
  <div>
    <el-container class="main-container">
      <el-header class="header">
        <div class="logo">我的视频列表</div>
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
          <el-dialog
            title="修改视频信息"
            v-model="editDialogVisible"
            width="50%"
            @close="resetForm"
          >
            <el-form :model="editForm" ref="editForm" label-width="120px">
              <el-form-item label="标题">
                <el-input v-model="editForm.title" />
              </el-form-item>
              <el-form-item label="简介">
                <el-input v-model="editForm.description" type="textarea" />
              </el-form-item>
              <el-form-item label="替换封面">
                <el-upload
                  :on-change="handleCoverChange"
                  :before-upload="beforeCoverUpload"
                  :file-list="editForm.coverimage"
                  :auto-upload="false"
                  :list-type="'picture-card'"
                  name="cover"
                >
                  <template v-slot:trigger>
                    <el-button size="small" type="primary">选择图片</el-button>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitEditForm"
                  >提交</el-button
                >
                <el-button @click="resetForm">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-table :data="videos" border style="width: 100%">
            <el-table-column
              prop="coverimageurl"
              label="封面"
              width="200"
              ><template v-slot="{ row }"
                ><el-image
                  :src="row.coverimage"
                  @click="gotoWatch(row.id)"
                ></el-image
              ></template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="标题"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="description"
              label="描述"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="watchcount"
              label="观看人数"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="goods"
              label="点赞数"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="viewable"
              label="可见性"
              width="180"
              :formatter="viewableFormatter"
            ></el-table-column>
            <el-table-column
              prop="createtime"
              label="发布日期"
              width="180"
              :formatter="formatDate"
            ></el-table-column>
            <el-table-column
              prop="updatetime"
              label="最后修改"
              width="180"
              :formatter="formatDate"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="分类"
              width="180"
            ></el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" @click="editVideo(row)"
                  >修改视频信息</el-button
                >
                <el-button type="danger" style="background-color: #e95300;" @click="deleteVideo(row.id)"
                  >删除视频</el-button
                >
              </template>
            </el-table-column>
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
      uploadForm: {
        title: "",
        description: "",
        videos: [],
      },
      videos: [],
      me: {},
      username: "",
      editDialogVisible: false,
      editForm: {
        id: "",
        title: "",
        description: "",
        coverimage: [],
        coverimageurl: "",
      },
    };
  },
  methods: {
    
    gotoWatch(id) {
      this.$router.push({ path: "/watch", query: { id: id } });
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("zh-CN", options);
    },
    deleteVideo(id) {
      this.$confirm("确定删除此视频吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .delete("/api/videos/delete/" + id)
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    fetchUserVideos() {
      axios
        .get("/api/videos/users/" + this.username)
        .then((result) => {
          this.videos = result.data.data;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    editVideo(row) {
    this.editForm.id = row.id;
    this.editForm.title = row.title;
    this.editForm.description = row.description;
    this.editForm.coverimageurl=row.coverimage;
    this.editForm.coverimage = [
      {
        url: row.coverimage,
        status: "finished",
        name: row.title,
      },
    ];
    this.editDialogVisible = true;
  },
  resetForm() {
    this.$refs.editForm.resetFields();
    this.editDialogVisible = false;
  },
  beforeCoverUpload(file) {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      this.$message.error("请上传图片格式的文件");
    }
    return isImage;
  },
  handleCoverChange(file) {
    this.editForm.coverimage = [file];
  },
  submitEditForm() {
    const formData = new FormData();
    formData.append("id",this.editForm.id)
    formData.append("title", this.editForm.title);
    formData.append("description", this.editForm.description);
    formData.append("coverimageurl", this.editForm.coverimageurl);
    if (this.editForm.coverimage.length > 0) {
      formData.append("coverimage", this.editForm.coverimage[0].raw);
    }

    axios
      .put("/api/videos/update",formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if(result.data.code===1){
          this.$message.success(result.data.msg);
          this.resetForm();
        this.fetchUserVideos();
        }else{
          this.$message.error(result.data.msg)
        }
      })
      .catch((error) => {
        this.$message.error(error);
      });
  },
  },
  mounted() {
    // 获取 URL 参数中的用户名
    this.me = JSON.parse(localStorage.getItem("userdata"));
    this.username = this.me.username;
    this.fetchUserVideos();
  },
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-aside {
  background-color: #64b5f6; /* 更浅的蓝色 */
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-menu {
  background-color: #64b5f6; /* 更浅的蓝色 */
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
  color: white; /* 设置侧边栏字体颜色为白色 */
}
.video-row {
  margin-bottom: 20px;
}

.video-col {
  cursor: pointer;
}

.video-image {
  width: 100px;
  height: auto;
}

.el-row {
  margin-bottom: 20px;
}

.el-col:last-child {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.el-button {
  margin-bottom: 10px;
}
</style>
 
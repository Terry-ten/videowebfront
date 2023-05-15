<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px"
            >数据库备份<head-image :avatarUrl="headimage"></head-image
          ></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item
                >
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>数据库备份</el-breadcrumb-item>
              </el-breadcrumb>
            </el-card>
            <br />
            <el-card class="box-card">
              <h3>一键上传文件</h3>
              <el-upload
                class="upload-demo"
                drag
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeUpload"
                :file-list="fileList"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或点击上传</div>
                <template #tip>
                  <div class="el-upload__tip">请上传的sql文件</div>
                </template>
              </el-upload>
              <el-table :data="tableData" style="width: 100%; margin-top: 20px">
                <el-table-column
                  prop="tablename"
                  label="数据库表名"
                ></el-table-column>
                <el-table-column prop="url" label="URL"></el-table-column>
                <el-table-column
                  prop="updatetime"
                  label="上次备份时间"
                ></el-table-column>
                <el-table-column label="下载">
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      size="small"
                      @click="downloadFile(row)"
                      >下载</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-main>
          <el-footer>copyright by zengrui@sicnu</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "../../plugins/axios";
import HeadImage from "../PopularElment/HeadImage.vue";
import AsideView from "../PopularElment/AsideView.vue";
export default {
  components: { AsideView, HeadImage },
  data() {
    return {
      currentTableUrl: null,
      upurl: "/api/databases/upload",
      fileList: [],
      tableData: [],
      headimage: JSON.parse(localStorage.getItem("userdata")).headimage,
    };
  },
  methods: {
    fetchData() {
      axios.get("/api/databases").then((result) => {
        this.tableData = result.data.data;
      });
    },
    async beforeUpload(file) {
      // this.filename=file.name;
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension !== "sql" || this.fileList.length > 0) {
        this.$message.error("文件格式有误！");
        return false;
      }
      const tableName = file.name;
      console.log(tableName)
      const matchedTable = this.tableData.find(
        (table) => table.tablename === tableName
      );

      if (matchedTable) {
        this.currentTableUrl = matchedTable.url;
      } else {
        this.currentTableUrl = "notexists";
      }
      const formData = new FormData();
  formData.append("tablename", file);
  formData.append("url", this.currentTableUrl);

  try {
    const response = await axios.post(this.upurl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: localStorage.getItem("token"),
      },
    });
    if(response.data.code===1){
      this.$message.success(response.data.msg)
      this.fetchData();
    }else{
      this.$message.error(response.data.msg)
    }
  } catch (error) {
    this.$message.error(error)
  }

  // 阻止默认的上传行为
  return false;
    },

    downloadFile(row) {
      window.open(row.url);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script> 

<style scoped>
@import url("../../assets/custom-styles.css");

.upload-demo {
  padding: 30px;
  background: #f5f7fa;
  border: 2px dashed #c0c4cc;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

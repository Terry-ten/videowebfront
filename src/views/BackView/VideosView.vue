<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px"
            >视频后台管理<head-image :avatarUrl="headimage"></head-image
          ></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item>
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
              </el-breadcrumb>
            </el-card>
            <br/>
            <el-card class="box-card">
              <el-form
                :inline="true"
                :model="searchForm"
                class="demo-form-inline"
              >
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="作者名">
                      <el-input
                        v-model="searchForm.author"
                        placeholder="填入查询的姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="上传时间">
                      <el-date-picker
                        v-model="searchForm.createtime"
                        type="daterange"
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :size="size"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit"
                        >查询</el-button
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <div class="custom-table">
                <el-table
                  :data="tableData"
                  border
                  :row-class-name="tableRowClassName"
                  style="width: 100%"
                >
                  <el-table-column
                    fixed="left"
                    prop="title"
                    label="标题"
                    width="120"
                  >
                  </el-table-column>
                  <el-table-column prop="coverimage" label="封面" width="100">
                    <template v-slot="{ row }">
                      <el-image
                        :src="row.coverimage"
                        @click="gotoWatch(row.id)"
                      ></el-image>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="视频简介"
                    width="180"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="videolocation"
                    label="视频内容"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column prop="author" label="作者" width="100">
                  </el-table-column>
                  <el-table-column prop="viewable" label="可见性" width="70">
                  </el-table-column>
                  <el-table-column prop="goods" label="点赞数" width="70">
                  </el-table-column>
                  <el-table-column
                    prop="watchcount"
                    label="观看次数"
                    width="90"
                  ></el-table-column>
                  <el-table-column prop="type" label="视频类型" width="90">
                  </el-table-column>
                  <el-table-column
                    prop="createtime"
                    label="创建时间"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="updatetime"
                    label="修改时间"
                    width="150"
                  >
                  </el-table-column>

                  <el-table-column width="200" label="操作">
                    <template v-slot="{ row }">
                      <el-button
                        @click="updateViewable(row)"
                        style="background-color: #3a90e9; color: #ffffff"
                      >
                        设置可见性
                      </el-button>
                      <el-button
                        @click="
                          showDeleteDialog = true;
                          userToDelete.value = row;
                        "
                        style="background-color: #f56c6c; color: #ffffff"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-dialog
                  v-model="showDeleteDialog"
                  title="删除视频提醒"
                  width="25%"
                  align-center
                >
                  <span>确定删除该视频吗</span>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="showDeleteDialog = false"
                        >取消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="
                          deleteuser(userToDelete.value);
                          showDeleteDialog = false;
                        "
                      >
                        确定
                      </el-button>
                    </span>
                  </template>
                </el-dialog>
              </div>
            </el-card>
            <br />
            <el-pagination
              background
              layout="sizes,page-size,prev, pager, next,jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :total="total"
            />
          </el-main>
          <el-footer>copyright by zr@sicnu</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "../../plugins/axios";
import { ref } from "vue";
import HeadImage from "../PopularElment/HeadImage.vue";
import AsideView from "../PopularElment/AsideView.vue";
export default {
  components: { AsideView, HeadImage },
  data() {
    return {
      receivedData: null,
      submitUrl: "",
      dialogVisible: false,
      dialogType: "",
      passwordVisible: false,

      formLabelWidth: "100px",
      tableData: [],
      searchForm: {
        author: "",
        createtime: [],
      },
      total: "",
      currentPage: 1,
      pageSize: 10,
      headimage: JSON.parse(localStorage.getItem("userdata")).headimage,
    };
  },
  methods: {
    // checkvalid,
    fetchData() {
      // this.checkvalid;
      const { author, createtime } = this.searchForm;
      const validCreatetime = createtime || [];
      axios
        .get("/api/videos", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            author: author,
            begin: validCreatetime[0]
              ? validCreatetime[0].toISOString().split("T")[0]
              : undefined,
            end: validCreatetime[1]
              ? validCreatetime[1].toISOString().split("T")[0]
              : undefined,
          },
        })
        .then((result) => {
          this.tableData = result.data.data.rows;
          this.total = result.data.data.total;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    updateViewable(row) {
      axios
        .put("/api/videos/update/viewable", {
          id: row.id,
          viewable: row.viewable,
        })
        .then((result) => {
          if (result.data.code === 1) {
            this.$message.success(result.data.msg);
            this.fetchData();
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    gotoWatch(id) {
      this.$router.push({ path: "/watch", query: { data: id } });
    },
    deletevideo(row) {
      axios
        .delete("/api/videos/delete/" + row.title + "/" + row.author)
        .then((result) => {
          if (result.code === 1) {
            this.$message.success(result.data.msg);
            this.fetchData();
          } else {
            this.$message.error(result.data.msg);
          }
        });
    },
    onSubmit() {
      this.currentPage = 1;
      this.fetchData();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchData();
    },
  },
  setup() {
    const showDeleteDialog = ref(false);
    const userToDelete = ref({});

    return {
      showDeleteDialog,
      userToDelete,
    };
  },
  mounted() {
    const data = this.$route.query.data;
    console.log(data);
    if (data != null) {
      axios.get("/api/videos/" + data).then((result) => {
        this.tableData = [result.data.data];
      });
    } else {
      this.fetchData();
    }
  },
};
</script >

<style scoped>
@import url("../../assets/custom-styles.css");
</style>

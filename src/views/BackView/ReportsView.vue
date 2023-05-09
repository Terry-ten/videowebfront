<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px"
            >后台举报管理<head-image :avatarUrl="headimage"></head-image
          ></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item
                >
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>举报管理</el-breadcrumb-item>
              </el-breadcrumb>
            </el-card>
            <br />
            <el-card class="box-card">
              <el-form
                :inline="true"
                :model="searchForm"
                class="demo-form-inline"
              >
                <el-row>
                  <el-col :span="3">
                    <el-select
                      v-model="typevalue"
                      class="m-2 select-width"
                      placeholder="举报类型"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="举报时间">
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
                <el-table :data="tableData" border style="width: 100%">
                  <el-table-column
                    fixed="left"
                    prop="reporter"
                    label="举报人"
                    width="120"
                  >
                  </el-table-column>
                  <el-table-column prop="type" label="举报对象" width="100">
                    <template v-slot="{ row }">
                      {{ row.type === 1 ? "视频" : "评论" }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="reason" label="举报原因" width="200">
                  </el-table-column>

                  <el-table-column
                    prop="createtime"
                    label="创建时间"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column label="举报地址" width="100">
                    <template v-slot="{ row }">
                      <el-button @click="setjumptype(row)">
                        查看内容
                      </el-button>
                      <el-popconfirm
                        width="220"
                        confirm-button-text="是的"
                        cancel-button-text="不要"
                        :icon="InfoFilled"
                        icon-color="#626AEF"
                        title="确定删除吗"
                        @confirm="() => deleteReports(row)"
                      >
                        <template #reference>
                          <el-button
                        style="background-color: #f56c6c; color: #ffffff"
                        >删除</el-button
                      >
                        </template>
                      </el-popconfirm>
                      
                    </template>
                  </el-table-column>
                </el-table>
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
      formLabelWidth: "100px",
      tableData: [],
      jumpwhere: "",
      searchForm: {
        createtime: [],
      },
      total: "",
      currentPage: 1,
      pageSize: 10,
      options: [
        {
          value: "1",
          label: "视频",
        },
        {
          value: "2",
          label: "评论",
        },
      ],
      typevalue: ref(""),
      headimage: JSON.parse(localStorage.getItem("userdata")).headimage,
    };
  },
  methods: {
    // checkvalid,
    fetchData() {
      this.checkvalid;
      const { createtime } = this.searchForm;
      const validCreatetime = createtime || [];
      axios
        .get("/api/reports", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            type: this.typevalue,
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
          console.error("获取数据失败！", error);
        });
    },
    deleteReports(row) {
        axios.delete("/api/reports/delete/" + row.id).then((result) => {
        if (result.data.code === 1) {
          this.$message.success(result.data.msg);
          this.fetchData();
        } else {
          this.$message.error(result.data.msg);
        }
      });
   },

    setjumptype(row) {
      if (row.type === 1) {
        this.$router.push({
          path: "/videos",
          query: { data: row.targetid },
        });
      } else if (row.type === 2) {
        this.$router.push({
          path: "/comments",
          query: { data: row.targetid },
        });
      }
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

  mounted() {
    this.fetchData();
  },
};
</script>
  
<style scoped>
.select-width {
  width: 120px;
}
@import url("../../assets/custom-styles.css");
</style>
  
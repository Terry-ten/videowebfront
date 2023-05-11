<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px"
            >操作日志管理<head-image :avatarUrl="headimage"></head-image
          ></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item
                >
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>日志管理</el-breadcrumb-item>
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
                  
                  
                  <el-col :span="5">
                    <el-form-item label="查询操作id">
                      <el-input
                        v-model="searchForm.oprateId"
                        placeholder="填入查询的id"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" style="margin-left: 20px">
                    <el-form-item label="评论时间">
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
                  &nbsp;&nbsp;&nbsp;
                  <el-button type="danger" @click="deleteSelectedRows"
                    >删除选中行</el-button
                  >
                </el-row>
              </el-form>

              <div class="custom-table">
                <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                  <el-table-column
                    type="selection"
                    width="55"
                  ></el-table-column>
                  <el-table-column
                    fixed="left"
                    prop="operateid"
                    label="操作人id"
                    width="120"
                  >
                  </el-table-column>
                  <el-table-column prop="roletype" label="操作角色" width="100">
                  </el-table-column>
                  <el-table-column prop="classname" label="操作类" width="180">
                  </el-table-column>
                  <el-table-column
                    prop="methodname"
                    label="操作方法"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="methodparams"
                    label="传入参数"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="returnvalue"
                    label="返回值"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="createtime"
                    label="操作时间"
                    width="150"
                  >
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
          <el-footer>copyright by zengrui@sicnu</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "../../plugins/axios";
import HeadImage from '../PopularElment/HeadImage.vue';
import AsideView from '../PopularElment/AsideView.vue';
  export default {
  components: { AsideView,
  HeadImage },
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      searchForm: {
        oprateId: "",
        createtime: [],
      },
      total: "",
      currentPage: 1,
      pageSize: 10,
      roletype: "",
      headimage:JSON.parse(localStorage.getItem("userdata")).headimage
    };
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    fetchData() {

      const { oprateId ,createtime } = this.searchForm;
      console.log(oprateId)
      const validCreatetime = createtime || [];
      axios
        .get("/api/logs", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            oprateId: oprateId,
            roletype: this.roletype,
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
    deleteSelectedRows() {
      const selectedIds = this.multipleSelection.map(item => item.id);
      axios
        .delete("/api/logs/delete", { data: { ids: selectedIds }}) 
        .then((result) => {
          if(result.data.code===1){
            this.$message.success(result.data.msg)
            this.fetchData(); 
          }else{
            this.$message.error(result.data.msg)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        });
    },
  },
  
  mounted() {
      this.fetchData();
    }
};
</script>

<style scoped>
@import url("../../assets/custom-styles.css");
</style>

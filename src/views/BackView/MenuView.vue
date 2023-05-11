<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px">菜单管理<head-image :avatarUrl="headimage"></head-image></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
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
                    <el-form-item label="菜单名">
                      <el-input
                        v-model="searchForm.menuname"
                        placeholder="填入查询的菜单名"
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
                  <el-table-column prop="id" label="菜单id" width="120">
                  </el-table-column>
                  <el-table-column prop="menuname" label="菜单名" width="150">
                  </el-table-column>
                  <el-table-column
                    prop="viewable"
                    label="设置可见性"
                    width="150"
                  >
                    <template v-slot="{ row }">
                      <el-switch
                        v-model="row.viewable"
                        :disabled="row.menuname==='管理员主页'"
                        @change="toggleVisibility(row)"
                        style="margin-left: 45%"
                      />
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
      tableData: [],
      searchForm: {
        menuname: "",
      },
      total: "",
      currentPage: 1,
      pageSize: 10,
      viewablevalue: true,
      headimage:JSON.parse(localStorage.getItem("userdata")).headimage
    };
  },
  methods: { 
    fetchData() {
  const { menuname } = this.searchForm;
  axios
    .get("/api/menus", {
      params: {
        page: this.currentPage,
        pageSize: this.pageSize,
        menuname: menuname,
      },
    })
    .then((result) => {
      
        this.tableData = result.data.data.rows.map((row) => { 
          // 将整数值转换为布尔值
          row.viewable = row.viewable === 1;
          return row;
        });
        this.total = result.data.data.total;
      }) .catch((error) => {
      console.error("获取数据失败！", error);
    });
},

    toggleVisibility(row) {
    const newVisibility = row.viewable ? 1 : 0;
    axios.post('/api/menus/update', null,{
    params: {
      id: row.id,
      viewable: newVisibility
    }});
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

@import url("../../assets/custom-styles.css");
</style>

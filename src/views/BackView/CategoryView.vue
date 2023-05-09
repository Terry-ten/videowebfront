<template>
    <div>
      
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-container>
            <el-header border="1px">分类管理<head-image :avatarUrl="headimage"></head-image></el-header>
            <el-main>
              <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item>
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类管理</el-breadcrumb-item>
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
                    <el-col :span="2">
                    <el-form-item>
                      <el-button
                        class="button-left"
                        @click="openAddDialog=true"
                        >添加分类</el-button
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
                      prop="id"
                      label="分类序号"
                      width="50"
                    >
                    </el-table-column>
                    <el-table-column prop="typename" label="分类名称" width="100">
                    </el-table-column>
                    <el-table-column width="30%" label="操作">
                      <template v-slot="{ row }">
                        <el-button
                          @click="
                          this.oldname=row.typename;
                            openEditDialog(row);
                          "
                          style="background-color: #409eff; color: #ffffff"
                        >
                          重命名
                        </el-button>
                        <el-button
                          @click="
                             openDeleteDialog(row);
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
                    <span>确定删除分类吗</span>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="showDeleteDialog = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          @click="
                            deletetype(this.deleteId);
                            showDeleteDialog = false;
                          "
                        >
                          确定
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>
                  <el-dialog
                    v-model="showEditDialog"
                    title="编辑你的分类"
                    width="25%"
                    align-center
                  >
                    <span>输入新的分类名</span>
                    <el-input v-model=editData ></el-input>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="showEditDialog = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          @click="
                            edittype(this.editdata,this.editid);
                            showDeleteDialog = false;
                          "
                        >
                          确定
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>
                  <el-dialog
                    v-model="openAddDialog"
                    title="编辑你的分类"
                    width="25%"
                    align-center
                  >
                    <span>增加新的分类</span>
                    <el-input v-model=addData ></el-input>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="openAddDialog = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          @click="
                            addtype(this.addData);
                            openAddDialog = false;
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
import axios from '../../plugins/axios';

import HeadImage from '../PopularElment/HeadImage.vue';
import AsideView from '../PopularElment/AsideView.vue';
  export default {
  components: { AsideView,
  HeadImage },
    data() {
      return {
        showEditDialog:false,
        oldname:"",
        addData:"",
        openAddDialog:false,
        deleteId:'',
        editData: '',
        editId:'',
        receivedData: null,
        submitUrl: '',
        dialogVisible: false,
        formLabelWidth: "100px", 
        tableData: [],
        total: '',
        currentPage: 1,
        pageSize: 10,
        headimage:JSON.parse(localStorage.getItem("userdata")).headimage,
        showDeleteDialog:false
      };
      
    },
    methods: {
      edittype(){
        axios.put(`api/types/update?id=${this.editId}&oldname=${this.oldname}&typename=${this.editData}`).then((result) => {
          if(result.data.code===1){
            this.$message.success(result.data.msg);
          }else{
            this.$message.error(result.data.msg);
          }
        }).catch((err) => {
            this.$message.error(err)
        });
      },
      
      fetchData() {
        
        axios
          .get("/api/types", {
            params: {
              page: this.currentPage,
              pageSize: this.pageSize,
            },
          })
          .then((result) => {
            if(result.data.code===403){
            
            this.$router.push("/login")
          }
          else {
          this.tableData = result.data.data.rows;
          this.total = result.data.data.total;
        }})
          .catch((error) => {
            console.error(error);
          });
      },
      deletetype(id) {
        axios
          .delete("/api/types/delete/" + id)
          .then((result) => {
            if (result.data.code === 1) {
              this.$message.success(result.data.msg);
              this.fetchData();
            } else {
              this.$message.error(result.data.msg);
            }
          });
      },
      addtype(typename){
        axios.post("/api/types/add/"+typename).then((result) => {
          if(result.data.code===1){
            this.$message.success(result.data.msg);
            this.fetchData();
          }else{
            this.$message.error(result.data.msg);
          }
        }).catch((err) => {
            this.$message.error(err)
        });
      },
      openDeleteDialog(row){
        this.deleteId=row.id;
        this.showDeleteDialog=true;
      },
      openEditDialog(row){
        this.editId=row.id;
        this.showEditDialog=true;
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
    }
  };
  </script >
  
  <style scoped>
 
  @import url("../../assets/custom-styles.css");
  </style>
  
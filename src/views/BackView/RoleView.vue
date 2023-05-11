<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px"
            >用户角色管理<head-image :avatarUrl="headimage"></head-image
          ></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
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
                  <el-col :span="3">
                    <el-button type="primary" text @click="jumptopermission"
                      >跳转至权限分配</el-button
                    >
                  </el-col>
                  <el-col :span="3">
                    <el-button
                      type="primary"
                      text
                      @click="openAddRoleDialog = true"
                      >创建角色</el-button
                    >
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="用户名">
                      <el-input
                        v-model="searchForm.username"
                        placeholder="填入查询的姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="用户id">
                      <el-input
                        v-model="searchForm.userid"
                        placeholder="填入查询的id"
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
                  <el-table-column prop="userid" label="用户id" width="120">
                  </el-table-column>
                  <el-table-column prop="username" label="用户名" width="100">
                  </el-table-column>

                  <el-table-column label="角色类型" width="150">
                    <template v-slot="{ row }">
                      <el-row>
                        <el-select
                        :disabled="row.id === 1"
                          v-model="row.rolename"
                          class="m-2 select-width"
                          placeholder="角色类型"
                          @change="updateRoleType(row, $event)"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.rolename"
                            :value="item.id"
                          />
                        </el-select>
                        &nbsp;&nbsp;&nbsp;
                        <el-popconfirm
                          title="确定删除选定角色吗？"
                          @confirm="() => deleteRoles(row.userid,row.rolename) "
                        >
                          <template #reference>
                            <el-button type="danger"  :disabled="row.id===1">删除角色</el-button>
                          </template>
                        </el-popconfirm>
                      </el-row>
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
  <el-dialog v-model="openAddRoleDialog" title="创建角色">
    <el-form :model="roleform">
      <el-form-item label="输入角色名" :label-width="formLabelWidth">
        <el-input v-model="roleform.rolename" autocomplete="off" />
      </el-form-item>
      <el-form-item label="输入角色描述" :label-width="formLabelWidth">
        <el-input
          v-model="roleform.description"
          autosize
          type="textarea"
          placeholder="描述一下吧"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="openAddRoleDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="(openAddRoleDialog = false), addRole()"
        >
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
  <script>
import axios from "../../plugins/axios";
import HeadImage from "../PopularElment/HeadImage.vue";
import AsideView from "../PopularElment/AsideView.vue";
export default {
  components: { AsideView, HeadImage },
  data() {
    return {
      openAddRoleDialog: false,
      roleform: {
        rolename: "",
        description: "",
      },
      tableData: [],
      searchForm: {
        userid: "",
        username: "",
      },
      total: "",
      currentPage: 1,
      pageSize: 10,
      options: [],
      headimage: JSON.parse(localStorage.getItem("userdata")).headimage,
    };
  },
  methods: {
    deleteRoles(userid,rolename) {
      console.log(userid)
      console.log(rolename)
      axios.delete("/api/roles/delete",{
      params: {
        userid: userid,
        rolename: rolename,
      },
    }).then((result) => {
        if (result.data.code === 1) {
          this.$message.success(result.data.msg);

          this.fetchData(); 
          this.fetchRoletype();
        } else {
          this.$message.error(result.data.msg);
        }
      });
    },
    fetchData() {
      const { username, userid } = this.searchForm;
      axios
        .get("/api/userrole", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            username: username,
            userid: userid,
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
    fetchRoletype() {
      axios.get("/api/roles/get").then((result) => {
        if (result.data.code === 200) {
          this.options = result.data.data;
        } else {
          this.$message.error(result.data.msg);
        }
      });
    },
    addRole() {
      axios
        .post("/api/roles/add", {
          rolename: this.roleform.rolename,
          description: this.roleform.description,
        })
        .then((result) => {
          if (result.data.code === 1) {
            this.$message.success(result.data.msg);
            this.fetchData();
            this.fetchRoletype();
          } else {
            this.$message.error(result.data.msg);
          }
        });
    },
    updateRoleType(row, roletype) {
      console.log("userid"+row.userid)
      axios.put("/api/userrole/update", {
        userid: row.userid,
        roletype: roletype,
      }).then((result) => {
        if(result.data.code===1){
          this.$message.success(result.data.msg)
          this.fetchData();
          this.fetchRoletype();
        }else{
          this.$message.error(result.data.msg)
        }
      })
    },
    jumptopermission() {
      this.$router.push("/permissions");
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
    this.fetchRoletype();
  },
};
</script>
  
<style scoped>
.select-width {
  width: 120px;
}
@import url("../../assets/custom-styles.css");
</style>
  
<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px">角色权限管理<head-image :avatarUrl="headimage"></head-image></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限分配</el-breadcrumb-item>
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
                    <el-button type="primary" text @click="jumptorole"
                      >跳转至角色分配</el-button
                    >
                  </el-col>
                </el-row>
              </el-form>
              <br />
              <div class="custom-table">
                <el-table :data="tableData" border style="width: 100%">
                  <el-table-column prop="id" label="角色id" width="120">
                  </el-table-column>
                  <el-table-column prop="rolename" label="角色名称" width="100">
                  </el-table-column>

                  <el-table-column label="权限分配" width="150">
                    <template v-slot="{ row }">
                      <el-button type="primary" @click="showTransferDialog(row)" :disabled="row.id===1"
                        >分配权限</el-button
                      >
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

    <el-dialog
      style="width: 50%"
      title="分配权限"
      v-model="transferVisible"
      @close="resetTransfer"
    >
      <el-transfer
        v-model="selectedPermissionKeys"
        :data="permissions"
        :titles="['可选权限', '已选权限']"
        :props="{ key: 'key', label: 'label', disabled: 'disabled' }"
        filterable
        filter-placeholder="请输入权限名称"
        @change="handlePermissionChange"
      />
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="transferVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRolePermissions"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
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
      total: "",
      currentPage: 1,
      pageSize: 10,
      transferVisible: false,
      //   selectedPermissions: [],
      selectedPermissionKeys: [],
      permissions: [],
      currentRole: null,
      permissionsChanged: {},
      headimage:JSON.parse(localStorage.getItem("userdata")).headimage
    };
  },
  methods: {
    fetchData() {
      axios
        .get("/api/rolepermission", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
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

    jumptorole() {
      this.$router.push("/roles");
    },

    showTransferDialog(role) {
      this.currentRole = role;
      this.fetchPermissions(role.id);
      this.transferVisible = true;
    },

    fetchPermissions(roleId) {
      axios
        .get("/api/rolepermission/" + roleId)
        .then((result) => {
          // 获取所有权限和选中的权限
          const allPermissions = result.data.data.allPermissions;
          const selectedPermissionIds =
            result.data.data.selectedPermissions.map(
              (permission) => permission.id
            );

          // 处理权限数据，添加 chosen 属性
          this.permissions = allPermissions.map((permission) => {
            return {
              key: permission.id,
          label: permission.permissionname,
          chosen: selectedPermissionIds.includes(permission.id),
          // 如果 permissionname 是 "Admin Home"，则设置 disabled 为 true
          disabled: permission.permissionname === "管理员主页",
            };
          });

          // 更新穿梭框中已选权限的 key 列表
          this.selectedPermissionKeys = selectedPermissionIds;
        })
        .catch((error) => {
          console.error("获取权限数据失败！", error);
        });
    },

    handlePermissionChange(newSelected, direction, movedKeys) {
  // 检查是否移动了权限a，b或c
  const involvesABC = [2, 3, 4].some(key => movedKeys.includes(key));

  if (involvesABC) {
    if (direction === 'right') { // 分配权限
      // 如果分配了权限a，确保权限b和c也被分配
      if (movedKeys.includes(4) && !newSelected.includes(2)) newSelected.push(2);
      if (movedKeys.includes(4) && !newSelected.includes(3)) newSelected.push(3);
    } else { // 撤销权限
      // 如果撤销了权限b或c，并且权限a也在已选权限中，则同时撤销权限a
      if ((movedKeys.includes(2) || movedKeys.includes(3)) && newSelected.includes(4)) {
        const index = newSelected.indexOf(4);
        if (index > -1) newSelected.splice(index, 1);
      }
    }
  }

  this.permissionsChanged = {
    newSelected,
    direction,
    movedKeys,
  };
},


    saveRolePermissions() {
      const { newSelected } = this.permissionsChanged;
      axios
        .put("/api/rolepermission/update", {
          roleId: this.currentRole.id,
          permissionIds: newSelected,
        })
        .then(() => {
          this.transferVisible = false;
          this.$message.success("权限分配成功！");
        })
        .catch((error) => {
          this.$message.error("权限分配失败！");
          console.error("权限分配失败！", error);
        });
    },

    resetTransfer() {
      this.selectedPermissions = [];
      this.permissions = [];
      this.currentRole = null;
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

  
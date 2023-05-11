<template>
  <div>
    <el-container>
      <aside-view></aside-view>
      <el-container>
        <el-container>
          <el-header border="1px">用户后台管理<head-image :avatarUrl="headimage"></head-image></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item>
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>视频管理</el-breadcrumb-item>
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
                  <!-- 新的 el-col，用于容纳添加用户按钮 -->
                  <el-col :span="2">
                    <el-form-item>
                      <el-button
                        class="button-left"
                        @click="openDialog('insert')"
                        >添加用户</el-button
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="用户名">
                      <el-input
                        v-model="searchForm.username"
                        placeholder="填入查询的姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="注册时间">
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

              <!-- el-dialog -->

              <el-dialog
                title="新增用户信息"
                :model-value="dialogVisible"
                @update:model-value="dialogVisible = false"
              >
                <el-form
                  ref="form"
                  :model="form"
                  :rules="rules"
                  label-width="100px"
                  @submit.prevent="submitForm"
                >
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input
                      v-model="form.password"
                      :type="passwordVisible ? 'text' : 'password'"
                    >
                      <template #append>
                        <el-button @click="passwordVisible = !passwordVisible"
                          >显示/隐藏密码</el-button
                        >
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="头像" prop="headimage">
                    <el-upload
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-change="handleChange"
                      :http-request="() => {}"
                    >
                      <el-button plain>
                        <i class="el-icon-upload"></i>
                        上传图片
                      </el-button>
                    </el-upload>
                    <span v-if="form.headimage">{{ form.headimage.name }}</span>
                  </el-form-item>

                  <el-form-item label="身份证" prop="idcard">
                    <el-input
                      v-model="form.idcard"
                      :disabled="isIdCardDisabled"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="phonenumber">
                    <el-input v-model="form.phonenumber"></el-input>
                  </el-form-item>
                  <el-form-item label="简介">
                    <el-input
                      v-model="form.introduction"
                      type="textarea"
                      maxlength="200"
                    ></el-input>
                  </el-form-item>
                </el-form>

                <template #footer>
                  <el-button @click="showDialog = false">取消</el-button>
                  <el-button type="primary" @click="submitForm">提交</el-button>
                </template>
              </el-dialog>

              <div class="custom-table">
                <el-table
                  :data="tableData"
                  border
                  :row-class-name="tableRowClassName"
                  style="width: 100%"
                >
                  <el-table-column
                    v-model="form.username"
                    fixed="left"
                    prop="username"
                    label="用户名"
                    width="80"
                  >
                  </el-table-column>
                  <el-table-column
                    v-model="form.headimage"
                    label="头像"
                    width="150"
                  >
                    <template #default="{ row }">
                      <img
                        :src="row.headimage"
                        alt="头像"
                        width="100"
                        height="100"
                      />
                    </template>
                  </el-table-column>
                  
                  <el-table-column
                    v-model="form.idcard"
                    prop="idcard"
                    label="身份证号"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    v-model="form.phonenumber"
                    prop="phonenumber"
                    label="手机号"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    v-model="form.introduction"
                    prop="introduction"
                    label="个人简介"
                    width="150"
                  >
                
                  </el-table-column>
                  <el-table-column
                    v-model="form.password"
                    prop="password"
                    label="密码"
                    width="150"
                  >
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
                  <el-table-column width="250" label="操作">
                    <template v-slot="{ row }">
                      <el-button
                        @click="this.editheadimageurl=row.headimage;openDialog('update', row)"
                        style="background-color: #409eff; color: #ffffff"
                      >
                        编辑
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
                  title="删除用户提醒"
                  width="25%"
                  align-center
                >
                  <span>确定删除该用户吗</span>
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
            <el-footer>copyright by zr@sicnu</el-footer>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script >
import axios from '../../plugins/axios';
import { ref } from "vue";
import HeadImage from '../PopularElment/HeadImage.vue';
import AsideView from '../PopularElment/AsideView.vue';
  export default {
  components: { AsideView,
  HeadImage },
  data() {
    return {
      form: {
        allowedtoupload:false,
        username: "",
        password: "",
        headimage: "",
        idcard: "",
        phonenumber: "",
        introduction: "",
        id:"",
      },
      editheadimageurl:"",
      isIdCardDisabled: true,
      submitUrl: "",
      dialogVisible: false,
      dialogType: "",
      passwordVisible: false,
      rules: {
        username: [
          {
            required: true,
            message: "用户名在3-10位之间",
            min: 3,
            max: 10,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            validator: this.validatePassword,
            trigger: "blur",
          },
        ],
        headimage: [
          {
            required: true,
            message: "请上传头像",
            trigger: "change",
          },
        ],
        idcard: [
          {
            required: true,
            validator: this.validateIdCard,
            trigger: "blur",
          },
        ],
        phonenumber: [
          {
            required: true,
            validator: this.validatePhoneNumber,
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "100px",
      tableData: [],
      searchForm: {
        username: "",
        createtime: [],
      },
      total: "",
      currentPage: 1,
      pageSize: 10,
      headimage:JSON.parse(localStorage.getItem("userdata")).headimage
    };
  },
  methods: {
    
    fetchData() {
      
      const { username, createtime } = this.searchForm;
      const validCreatetime = createtime || [];
      axios
        .get("/api/users", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            username: username, 
            begin: validCreatetime[0]
              ? validCreatetime[0].toISOString().split(" ")[0]
              : undefined,
            end: validCreatetime[1]
              ? validCreatetime[1].toISOString().split(" ")[0]
              : undefined,
          },
        })
        .then((result) => {
          this.tableData = result.data.data.rows;
          this.total = result.data.data.total;})
        .catch((error) => {
          console.error("获取数据失败:", error);
        });
    },
    deleteuser(row) {
      axios.delete("/api/users/delete/" + row.username).then((result) => {
        if (result.data.code === 1) {
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
    handleChange(file) {
      if (file && file.raw) {
        this.form.headimage = {
          name: file.name,
          type: file.type,
          data: file.raw, // 存储文件对象
        };
      } else {
        this.form.headimage = null;
      }
    },
    validatePassword(rule, value, callback) {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
      if (!reg.test(value)) {
        callback(new Error("密码大于6位且不能是纯英文或数字"));
      } else {
        callback();
      }
    },
    validateIdCard(rule, value, callback) {
      const reg =
        /^\d{6}(19[0-9]{2}|20[0-1][0-9]|2022|2023)(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的身份证"));
      } else {
        callback();
      }
    },
    validatePhoneNumber(rule, value, callback) {
      const reg = /^1[3-9]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isJPG = file.type === "image/jpeg";
        const isPNG = file.type === "image/png";
        if (!isJPG && !isPNG) {
          this.$message.error("上传头像只能是 JPG 或 PNG 格式!");
          reject(new Error("上传头像只能是 JPG 或 PNG 格式!"));
          this.allowedtoupload=false;
        } else {
          this.allowedtoupload=true;
          resolve(file);
        }
      });
    },
    async submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid && this.allowedtoupload) {
          try {
            let result;
            if (this.dialogType === "insert") { 
               result = await axios.post("/api/users/back/add", {
                headimage: this.form.headimage.data,
                username: this.form.username,
                password: this.form.password,
                phonenumber: this.form.phonenumber,
                idcard:this.form.idcard,
                introduction: this.form.introduction,
                headimageurl:this.editheadimageurl,
                id: this.form.id,
               }, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            } else if (this.dialogType === "update") {
              console.log(this.editheadimageurl)
               result = await axios.put("/api/users/back/update",{
                headimage: this.form.headimage.data,
                username: this.form.username,
                password: this.form.password,
                phonenumber: this.form.phonenumber,
                introduction: this.form.introduction,
                headimageurl:this.editheadimageurl,
                id: this.form.id,
               }, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            } else {
              this.$message.error("未设置URL");
              return;
            }
            console.log(result.msg);
            if (result.data.code === 1) {
              this.$message.success(result.data.msg)
              this.dialogVisible = false;
              this.fetchData();
            } else if (result.data.msg === "用户名重复") {
              this.$message.error(result.data.msg);
            } else {
              this.$message.error(result.data.msg);
              this.dialogVisible = false;
            }
          } catch (error) {
            this.$message.error("提交出现错误，请稍后重试");
          }
        } else {
          this.$message.error("表单格式有误，请检查后再提交");
          return false;
        }
      });
    },
    resetForm() {
      this.form.username = "";
      this.form.password = "";
      this.form.headimage = "";
      this.form.idcard = "";
      this.form.phonenumber = "";
      this.form.introduction = "";
    },
    openDialog(type, row) {
      this.dialogType = type;
      this.dialogVisible = true;

      if (type === "insert") {
        // 重置表单数据
        this.isIdCardDisabled = false;
        this.resetForm();
      } else if (type === "update") {
        // 填充表单数据
        this.isIdCardDisabled = true;
        this.fillFormData(row);
      }
    },
    fillFormData(row) {
      this.form.username = row.username;
      this.form.password = row.password;
      this.form.headimage = row.headimage;
      this.form.idcard = row.idcard;
      this.form.phonenumber = row.phonenumber;
      this.form.introduction = row.introduction;
      this.form.id=row.id;
    },
  },
  computed: {
    dialogTitle() {
      return this.dialogType === "insert" ? "新增用户信息" : "修改用户信息";
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
    this.fetchData();
  },
};
</script>

<style scoped>
.el-dialog .el-form .el-form-item .el-input {
  width: 350px;
}

@import url("../../assets/custom-styles.css");
</style>

<template>
  <div>
    <el-container>
      
      <el-container>
          <aside-view></aside-view>
        <el-container>
          <el-header border="1px">评论管理<head-image :avatarUrl="headimage"></head-image></el-header>
          <el-main>
            <el-card>
              <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/admininfo' }"
                  >首页</el-breadcrumb-item>
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>评论管理</el-breadcrumb-item>
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
                    <el-form-item label="评论者">
                      <el-input
                        v-model="searchForm.speaker"
                        placeholder="填入查询的姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="视频id">
                      <el-input
                        v-model="searchForm.videoid"
                        placeholder="填入查询的视频"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
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
                </el-row>
              </el-form>

              <div class="custom-table">
                <el-table
                  :data="tableData"
                  border
                  
                  style="width: 100%"
                >
                  <el-table-column
                    fixed="left"
                    prop="speaker"
                    label="评论者"
                    width="120"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="videoid"
                    label="视频id"
                    width="100"
                  >
                  </el-table-column>
                  <el-table-column prop="content" label="评论内容" width="180">
                  </el-table-column>
                  
                  <el-table-column
                    prop="createtime"
                    label="创建时间"
                    width="150"
                  >
                  </el-table-column>
                  
                  
                  <el-table-column prop="replies" label="评论回复" width="100">
                    <template v-slot="{row}">
                      <el-button @click="replydialog=true;fetchReplyData(row.id)"> 查看该回复 </el-button>
                    </template>
                    
                  </el-table-column>
                  
                  <el-table-column width="90" label="操作">
                    <template v-slot="{ row }">
                      <el-button
                        @click="
                          showDeleteDialog = true;
                          ToDelete.value = row;
                          deletetype='评论'
                        "
                        style="background-color: #f56c6c; color: #ffffff"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-dialog
                  v-model="showDeleteDialog"
                  :title="'删除' + deletetype + '提醒'"
                  width="25%"
                  align-center
                >
                  <span>确定删除该{{deletetype}}吗</span>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="showDeleteDialog = false"
                        >取消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="
                          getrow(deletetype,ToDelete.value);
                          showDeleteDialog = false;
                        ">确定</el-button>
                    </span>
                  </template>
                </el-dialog>
                <el-dialog v-model="replydialog" width="500px" >
                  <el-table :data="replyData" style="width: 100%">
                    <el-table-column prop="createtime" label="回复时间" width=20% />
                    <el-table-column prop="content" label="回复内容" width=60% />
                    <el-table-column label="删除" width=20% >
                      <template v-slot="{row}">
                      <el-button width="100px" @click="showDeleteDialog=true;ToDelete.value=row;deletetype='回复'">删除</el-button>
                    </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                  background
                  layout="sizes,page-size,prev, pager, next,jumper"
              @size-change="replychangesize"
              @current-change="replychangepage"
              :total="replytotal"
            />
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
          <el-footer>copyright by zengrui@sicnu</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from '../../plugins/axios';
import { ref } from "vue";
import HeadImage from '../PopularElment/HeadImage.vue';
import AsideView from '../PopularElment/AsideView.vue';
  export default {
  components: { AsideView,
  HeadImage },
  data() {
    return {
      targetid: this.$route.params.id,
      replydialog: false, 
      deletetype: "",
      dialogVisible: false,
      replycomment: "",
      formLabelWidth: "100px",
      tableData: [],
      replyData: [],
      searchForm: {
        speaker: "",
        videoid: "",
        createtime: [],
      },
      total: "",
      replytotal: "",
      currentPage: 1,
      pageSize: 10,
      replypage: 1,
      replysize: 10,
      headimage:JSON.parse(localStorage.getItem("userdata")).headimage
    };
  },

  methods: {
    fetchReplyData(commentId){
      console.log('1',this.replycomment)
      axios.get("/api/comments/replies",{params: { 
        page: this.replypage,
        pageSize: this.replysize,
        commentId: commentId, 
      },
      
    }).then((result) => {
        console.log(result.data.msg)
        this.replyData=result.data.data.rows
        this.replytotal=result.data.data.total
      }).catch((err) => {
        console.error("获取数据失败！", err);
      });
    },
    fetchData() {
      const { speaker, videoid, createtime } = this.searchForm;
      const validCreatetime = createtime || [];
      axios
        .get("/api/comments", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            speaker: speaker,
            videoid: videoid,
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
    getrow(type,row){
      if(type==='回复'){
        this.deletereply(row)
      }else if(type==='评论'){
        this.deletecomments(row)
      }else{
        this.$message.error("执行操作失败")
      }
    },
    deletereply(row){
      axios.delete("/api/comments/replies/delete/"+row.id).then((result) => {
        if(result.data.code===1){
          this.$message.success(result.data.msg);
          this.fetchReplyData(row.id);
        }else{
          this.$message.error(result.data.msg);
        }
      })
    },
    deletecomments(row) {
      axios
        .delete("/api/comments/delete/"+row.id)
        .then((result) => {
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
    replychangesize(size){
      this.replysize=size;
      this.fetchReplyData;
    },
    replychangepage(page){
      this.replypage=page;
      this.fetchReplyData;
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
    const ToDelete = ref({});

    return {
      showDeleteDialog, 
      ToDelete, 
    };
  },
  mounted() {
    const data = this.$route.query.data;
    console.log(data)
    if(data!=null){
      axios.get("/api/comments/"+data).then((result) => {
        this.tableData=[result.data.data] 
      })
    }else{
      this.fetchData()
    }
   
  },
};
</script>

<style scoped>
@import url("../../assets/custom-styles.css");
</style>

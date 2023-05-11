<template>
  <div class="video-page">
    <el-button
      class="home-button"
      type="text"
      icon="el-icon-house"
      @click="goHome"
    >返回首页</el-button>
    <el-card>
      <video
        ref="videoPlayer"
        :src="videoUrl"
        :poster="coverImageUrl"
        controls
        class="video-player"
      ></video>
      <div class="actions">
        <div class="video-info">
          <h2>{{ videoTitle }}</h2>
            <el-row>
            <el-avatar shape="square" :size="large" :src="this.authorobject.headimage" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <h3 @click="gotoOthersView(author)">作者：{{ author }}</h3>
          </el-row>
          <p class="video-date">发布日期：{{ videoDate }}</p>
          <p>简介：{{ videoDescription }}</p>
        </div>
        <el-button
          icon="el-icon-warning-outline"
          link
          circle
          @click="openVideoDialog = true"
          class="report-btn"
          >举报视频</el-button
        >
        <div class="like-image">
          <el-image v-if="this.videoisliked" src="https://zr-video-web.oss-cn-chengdu.aliyuncs.com/light.png" @click="setlikedgrey"></el-image>
          <el-image v-if="!this.videoisliked" src="https://zr-video-web.oss-cn-chengdu.aliyuncs.com/grey.png" @click="setlikedlight"></el-image>
          <p>点赞数：{{ likesCount }}</p>
      </div>
      </div>
    </el-card>
    <el-card class="submit-comment-card">
      <h2>发表评论</h2>
      <el-form v-model="submitComment">
        <el-input
          v-model="newCommentContent"
          placeholder="输入您的评论"
          clearable
          :rows="2"
          type="textarea"
          :maxlength="50"
        ></el-input>
        <el-button
          type="primary"
          @click="submitComment()"
          class="submit-comment-btn"
          >提交评论</el-button
        >
      </el-form>
    </el-card>
    <el-card class="comments-card">
      <h2>评论</h2>
      <div class="comment-list">
        <div v-for="(comment, index) in comments" :key="index" class="comment">
          <div class="comment-info">
            <div class="left">
              <strong class="comment-author">{{ comment.speaker }}</strong>
              <span class="comment-date">{{ comment.createtime }}</span>
            </div>
            <div class="right">
              <el-button
                link
                type="danger"
      
                @click="(commentId = comment.id), (openCommentDialog = true)"
                class="report-comment-btn"
              >
                举报
              </el-button>
              <el-button
                link
                type="primary"
                @click="openReplyDialog(comment)"
                class="reply-comment-btn"
              >
                回复
              </el-button>
            </div>
          </div>
          <div class="comment-content-wrapper">
            <p>{{ comment.content }}</p>
          </div>
          <el-button
            link
            @click="getReplies(comment.id)"
            class="show-replies-btn"
          >
            {{ comment.showReplies ? "隐藏回复" : "查看回复" }}
          </el-button>
          <div v-if="comment.showReplies" class="replies">
            <el-card class="reply-card">
              <div
                v-for="(reply, index) in comment.replies"
                :key="index"
                class="reply"
              >
                <div class="reply-info">
                  <div class="reply-author-wrapper">
                    <strong class="reply-author">{{ reply.repliar }}</strong>
                  </div>
                  <div class="reply-date-wrapper">
                    <span class="reply-date">{{ reply.createtime }}</span>
                  </div>
                </div>
                <p>{{ reply.content }}</p>
                <hr
                  v-if="index !== comment.replies.length - 1"
                  class="reply-divider"
                />
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog v-model="openVideoDialog" title="输入举报该视频的原因">
      <el-input
        v-model="videoreportcontent"
        :rows="3"
        type="textarea"
        :maxlength="50"
        placeholder="小心举报，认真做事"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="openVideoDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="reportvideo(), (openVideoDialog = false)"
          >
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="openCommentDialog" title="输入举报该评论的原因">
      <el-input
        v-model="commentreportcontent"
        :rows="3"
        type="textarea"
        :maxlength="50"
        placeholder="小心举报，认真做事"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="openCommentDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="reportcomment(), (openCommentDialog = false)"
          >
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="ReplyDialog" title="输入该评论的回复">
      <el-input v-model="commentcontent" disabled />
      <br/><br/>
      <el-input
        v-model="replycontent"
        :rows="3"
        type="textarea"
        :maxlength="50"
        placeholder="请留下善意的回复哦"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ReplyDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="replyComment(), (ReplyDialog = false)"
          >
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>



<style scoped>
.video-page {
  max-width: 800px;
  margin: 0 auto;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #e6f7ff;  /* 淡蓝色背景 */
  background-image: url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png');  /* 添加花纹背景 */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-card {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;  /* 卡片背景为白色 */
  margin-bottom: 20px;  /* 卡片间距 */
  border-radius: 15px;  /* 卡片边角圆滑 */
}

.video-player {
  width: 100%;
  height: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.home-button {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #409EFF; 
 }

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.report-btn {
  margin-left: 10px;
}

.video-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    flex: 1;
}

h2 {
    font-size: 24px;
    margin: 0;
}
h3 {
    font-size: 20px;
    margin: 0;
}
p {
  margin: 0;
}
.video-date {
    font-size: 16px;
    color: #999;
}
.report-btn {
    align-self: flex-start;
}
.comments-card {
  margin-top: 20px;
}
.comment-list {
  margin-top: 20px;
}
.comment {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.comment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-info .left {
  display: flex;
  flex-direction: column;
}

.comment-info .right {
  display: flex;
}
.report-comment-btn,
.reply-comment-btn {
  color: #999;
  margin-left: 10px;
}
.replies {
  margin-left: 20px;
}
.submit-comment-card {
  margin-top: 20px;
}
.submit-comment-btn {
  margin-top: 10px;
}
.reply-card {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}
.comment-author,
.reply-author {
  font-size: 18px;
}

.reply-info {
  display: flex;
  flex-direction: column;
}
.comment-date,
.reply-date {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

.show-replies-btn {
  color: #409eff;
  margin-top: 10px;
}
.reply {
  margin-bottom: 10px;
}
.reply-divider {
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  border-top: 1px solid #eee;
}
.reply-author-wrapper,
.reply-date-wrapper {
  display: flex;
}
.comment-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>

<script>
import axios from "../../plugins/axios";
export default {
  name: "VideoPlayer",
  data() {
    return {
      userlike:{},
      videoisliked:false,
      authorobject:{},
      videoId: "",
      videoUrl: "",
      coverImageUrl: "",
      videoTitle: "",
      videoDescription: "",
      videoDate:"",
      author: "",
      likesCount: 0,
      comments: [],
      openVideoDialog: false,
      openCommentDialog: false,
      ReplyDialog: false,
      videoreportcontent: "",
      commentreportcontent: "",
      newCommentContent: "",
      commentcontent: "",
      me: {},
      commentId: "",
      replycontent: "",
    };
  },
  mounted() {
    this.me = JSON.parse(localStorage.getItem("userdata"));
    if (this.$route.query.id == null) {
      this.router.push("/notfound");
    }
    this.videoId = this.$route.query.id;
    this.loadVideoData(this.videoId);
    this.watchcountUp(this.videoId);
  },
  methods: {
    goHome() {
      this.$router.push('/videoweb');
    },
    async setlikedgrey(){
      
  this.userlike.islike=0;
  console.log("即将取消点赞，已经将islike设置为"+this.userlike.islike)
  if(await this.updateUserVideoLike(this.userlike)){
    console.log("执行取消点赞成功,即将取消点赞")
    this.videoisliked=false;
    this.likesCount=this.likesCount-1;
    this.$message.success("取消点赞")
  }else{
    this.videoisliked=true;
    this.$message.error("取消失败")
  }
},
async setlikedlight(){
  this.userlike.islike=1;
  console.log("即将开始点赞，已经将islike设置为"+this.userlike.islike)
  console.log(this.userlike)
  if(await this.updateUserVideoLike(this.userlike)){
    console.log("点赞成功,即将点赞")
    this.videoisliked=true;
    this.likesCount=this.likesCount+1;
    this.$message.success("点赞成功")
  }else{
    this.videoisliked=false;
    this.$message.error("点赞失败")
  }
}, 
updateUserVideoLike(userlike){
  return new Promise((resolve) => {
    axios.post("/api/videos/userlike/islike",userlike).then((result) => {
      if(result.data.code===1){
        console.log("result.data.code"+result.data.code)
        resolve(true);
      }else{
        resolve(false);
      }
    }).catch(() => {
      resolve(false);
    });
  })
},

    gotoOthersView(author) {
      axios
        .get("/api/videos/watch/id/get", {
          params: {
            author: author,
          },
        })
        .then((result) => {
          if (result.data.data != null) {
            this.$router.push({
              path: "/othersinfo",
              query: {
                id: result.data.data,
              },
            });
          } else {
            this.$message.error("用户点击失败，请稍后再试");
          }
        });
    },
    watchcountUp(id) {
      axios.put("/api/videos/watchcount/" + id).catch((err) => {
        this.$router.error(err);
      });
    },
    submitComment() {
      axios
        .post("/api/comments/add", {
          speaker: this.me.username,
          videoid: this.videoId,
          content: this.newCommentContent,
        })
        .then((result) => {
          if (result.data.code === 1) {
            this.$message.success(result.data.msg);
            this.getComments(this.videoId);
          } else {
            this.$message.error(result.data.msg);
          }
        });
    },
    openReplyDialog(comment) {
      this.commentId = comment.id;
      this.commentcontent = comment.content;
      this.ReplyDialog = true;
    },
    replyComment() {
      axios
        .post("/api/comments/replies/add", {
          repliar: this.me.username,
          commentId: this.commentId,
          content: this.replycontent,
        })
        .then((result) => {
          if (result.data.code === 1) {
            this.$message.success(result.data.msg);
          } else {
            this.$message.error(result.data.msg);
          }
        });
    },
    reportvideo() {
      axios
        .post("/api/report/video/add", {
          targetid: this.videoId,
          userId: this.me.id,
          reason: this.videoreportcontent,
          type: 1,
        })
        .then((result) => {
          if (result.data.code === 1) {
            this.$message.success(result.data.msg);
          } else {
            this.$message.error(result.data.msg);
          }
        });
    },
    reportcomment() {
      axios
        .post("/api/report/comment/add", {
          targetid: this.commentId,
          userId: this.me.id,
          reason: this.commentreportcontent,
          type: 2,
        })
        .then((result) => {
          if (result.data.code === 1) {
            this.$message.success(result.data.msg);
          } else {
            this.$message.error(result.data.msg);
          }
        });
    },
    async loadVideoData(videoId) {
      await this.getVideoDetails(videoId);
      await this.getComments(videoId);
    },
    async getVideoDetails(id) {
      try {
        const result = await axios.get("/api/videos/watch/" + id);
        if (result.data.data != null) {
          const videoData = result.data.data;
          this.videoDate=videoData.createtime;
          this.videoUrl = videoData.videolocation;
          this.coverImageUrl = videoData.coverimage;
          this.videoTitle = videoData.title;
          this.videoDescription = videoData.description;
          this.likesCount = videoData.goods;
          this.author = videoData.author;

        } else {
          this.$router.push("notfound");
        }
      } catch (error) {
        console.error("Error getting video details:", error);
      }
     await axios.get("/api/users/watch/get/"+this.author).then((result) => {
        this.authorobject=result.data.data
      }) 
      axios.get("/api/videos/userlike/get",{params:{
        userid:this.me.id,
        videoid:this.videoId
      }}).then((result) => {
        if(result.data.data!=null){
          console.log("该用户曾经点过赞")
          this.userlike=result.data.data
          if(this.userlike.islike===1){
          console.log("对该视频的点赞设为真")
            this.videoisliked=true
          }
        }else{
          console.log("该视频还未进行点赞，会对userlike设置默认值")
          this.userlike.userid=this.me.id;
          this.userlike.videoid=this.videoId;
          console.log("该用户的userid为："+this.userlike.userid)
          console.log("该视频的videoid为："+this.userlike.videoid)
          this.videoisliked=false;
        }
      }).catch((err) => {
        this.$message.error("请求点赞"+err)
      });
    },
    async getComments(id) {
      try {
        const result = await axios.get("/api/comments/videos/" + id);
        const commentsData = result.data.data;
        this.comments = commentsData.map((comment) => {
          comment.replies = [];
          comment.showReplies = false;
          return comment;
        });
      } catch (error) {
        console.error("Error getting comments:", error);
      }
    },
    async getReplies(commentId) {
      const commentIndex = this.comments.findIndex(
        (comment) => comment.id === commentId
      );
      if (commentIndex !== -1) {
        if (!this.comments[commentIndex].showReplies) { 
          try {
            const result = await axios.get(
              "/api/comments/replies/" + commentId
            );
            const repliesData = result.data.data;
            this.comments[commentIndex].replies = repliesData;
          } catch (error) {
            console.error("获取数据失败:", error);
          }
        }
        this.comments[commentIndex].showReplies =
          !this.comments[commentIndex].showReplies;
      }
    },

    async likeVideo() {
      try {
        const result = await axios.put("/api/videos/update/like");
        const updatedLikesCount = result.data.goods;
        this.likesCount = updatedLikesCount;
      } catch (error) {
        console.error("点赞失败:", error);
      }
    },
  },
};
</script>
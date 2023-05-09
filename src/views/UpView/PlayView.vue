<template>
  <div class="video-page">
    <el-card>
      <video
        ref="videoPlayer"
        :src="videoUrl"
        :poster="coverImageUrl"
        controls
        class="video-player"
      ></video>
      <div class="actions">
        <el-button
          icon="el-icon-warning-outline"
          type="text"
          circle
          @click="openVideoDialog = true"
          class="report-btn"
          >举报视频</el-button
        >
        <div class="video-info">
          <h2>{{ videoTitle }}</h2>
          <p>{{ videoDescription }}</p>
          <h3 @click="gotoOthersView(author)">{{ author }}</h3>
          <el-button
            icon="el-icon-thumb"
            type="primary"
            circle
            @click="likeVideo"
            class="like-btn"
          ></el-button>
          <span class="likes-count">{{ likesCount }}</span>
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
          :rows="3"
          type="textarea"
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
                type="text"
                @click="(commentId = comment.id), (openCommentDialog = true)"
                class="report-comment-btn"
              >
                举报
              </el-button>
              <el-button
                type="text"
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
            type="text"
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
      <el-input
        v-model="replycontent"
        :rows="3"
        type="textarea"
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
}

.el-card {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.video-player {
  width: 100%;
  height: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
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
}

h2 {
  font-size: 24px;
  margin: 0;
}

p {
  margin: 0;
}
.like-btn {
  margin-top: 10px;
}
.likes-count {
  font-size: 18px;
  margin-top: 10px;
  color: #409eff;
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
      videoId: "",
      videoUrl: "",
      coverImageUrl: "",
      videoTitle: "",
      videoDescription: "",
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

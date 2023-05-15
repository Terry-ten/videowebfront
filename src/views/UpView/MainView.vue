<template>
  <div>
    <!-- Header -->
    <el-header class="header" border="1px">
      <div class="logo">ZRVIDEOS</div>
      <el-input
        class="search-input"
        placeholder="搜搜看吧"
        :maxlength="40"
        :model-value="keyword"
        @input="handleInput"
      >
        <template #prepend>
          <el-select v-model="searchType" placeholder="选择搜索类型">
            <el-option label="搜索用户" value="user"></el-option>
            <el-option label="搜索视频" value="video"></el-option>
          </el-select>
        </template>
      </el-input>
      <el-button type="primary" @click="performSearch()">搜索</el-button>
      <span
        ><el-select
          v-model="selectedSort"
          placeholder="排序方式"
          @change="onChange"
        >
          <el-option label="观看量" value="watchcount"></el-option>
          <el-option label="点赞量" value="goods"></el-option>
          <el-option label="最新发布" value="createtime"></el-option>
          <el-option
            label="最早发布"
            value="createtimedesc"
          ></el-option> </el-select
      ></span>
      <up-head-image :avatarUrl="me.headimage"></up-head-image>
    </el-header>

    <!-- Layout -->
    <el-container>
      <!-- Aside -->
      <el-aside>
        <el-menu class="menu" :collapse="isCollapse">
          <el-menu-item
            @click="(this.selecttype = ''), fetchVideoData('', '', this.sort)"
            index="1"
          >
            <i class="el-icon-house"></i>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item
            v-for="type in types"
            :key="type.id"
            :index="(type.id + 1).toString()"
            @click="
              (this.keyword = ''),
                (this.selecttype = type.typename),
                fetchVideoData('', type.typename, this.sort)
            "
          >
            <span>{{ type.typename }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- Main -->
      <el-main>
        <!-- Category buttons -->
        <div class="content-wrapper">
          <!-- Part 1: Carousel -->
          <div class="carousel-wrapper carousel-container">
            
            <el-carousel height="500px" arrow="always">
              
              <el-carousel-item
                v-for="item in videos.slice(12, 15)"
                :key="item.id"
              >
              
              <div>
        <img @click="playVideo(item.id)" :src="item.coverimage" alt="轮播图" />
        <p style="color:#252fa0; font-size: 30px;">精彩视频等你来看</p>
      </div>
              </el-carousel-item>
            </el-carousel>
          
            <div class="carousel-description">
              {{ selectedCarouselItem?.description }}
            </div>
          </div>

          <div class="top-thumbnails-wrapper">
            <div
              class="video-thumbnail-wrapper"
              v-for="item in videos.slice(0, 4)"
              :key="item.id"
            >
              <el-image
                :src="item.coverimage"
                fit="cover"
                lazy
                @click="playVideo(item.id)"
              ></el-image>
              <div class="video-info">
                <div class="video-title">{{ item.title }}</div>
                <div class="video-meta" @click="gotoOthers">
                 发布时间：{{ item.updatetime }}
                </div>
                <div class="video-description">
                  播放：{{ item.watchcount }}|| 点赞：{{ item.goods }}
                </div>
                <div class="video-description">
                 简介：{{ item.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div class="video-grid">
          <div
            class="video-thumbnail-wrapper"
            v-for="item in videos.slice(4, 12)"
            :key="item.id"
          >
            <el-image
              :src="item.coverimage"
              fit="cover"
              lazy
              @click="playVideo(item.id)"
            ></el-image>
            <div class="video-info">
              <div class="video-title">{{ item.title }}</div>
              <div class="video-meta" @click="gotoOthers">
                 发布时间：{{ item.updatetime }}
                </div>
              <div class="video-description">
                  播放：{{ item.watchcount }}|| 点赞：{{ item.goods }}
                </div>
              <div class="video-description">
                简介：{{ item.description }}
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="total,prev,page-size, pager, next"
          @current-change="handlevideoCurrentChange"
          :total="this.videototal"
          :page-size="15"
        />
      </el-main>
    </el-container>
  </div>
  <el-drawer
    v-model="tabledrawer"
    v-if="isDrawerVisible"
    title="以下是搜索到的用户信息"
    direction="rtl"
    size="40%"
  >
    <el-table :data="userData">
      <el-table-column property="headimage" label="用户头像" width="100">
        <template v-slot="{ row }">
          <el-avatar shape="square" :size="size" :src="row.headimage" />
        </template>
      </el-table-column>
      <el-table-column property="username" label="用户名" width="150">
        <template v-slot="{ row }">
          <span @click="gotoPersonalInFo(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column property="introduction" label="个人简介" />
    </el-table>
    <el-pagination
      layout="prev,page-size pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
    />
  </el-drawer>
</template>

<script>
import axios from "../../plugins/axios";
import UpHeadImage from "../PopularElment/UpHeadImage.vue";
export default {
  components: {
    UpHeadImage,
  },
  data() {
    return {
      serchways: 0,
      selectedCarouselItem: null,
      type: "",
      selecttype: "",
      sort: "createtimedesc",
      keyword: "",
      isCollapse: false,
      isDrawerVisible: false,
      searchType: "video",
      searchResults: [],
      isResultListVisible: false,
      searchHistory: [],
      videos: [],
      me: {},
      types: [],
      tabledrawer: false,
      userData: [],
      total: "",
      currentPage: 1,
      pageSize: 20,
      selectedSort: "",
      videopage: 1,
      videopagesize: 15,
      videototal: "",
    };
  },
  methods: {
    handlevideoCurrentChange(page) {
      console.log("fetchVideoData被执行了");
      this.videopage = page;
      this.fetchVideoData();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.searchUsers();
    },
    handleCurrentChange(page) {
      console.log("searchUsers被执行了");
      this.currentPage = page;
      this.searchUsers();
    },
    updateSelectedCarouselItem(index) {
      this.selectedCarouselItem = this.videos.slice(13, 15)[index];
    },
    goToCategory(type) {
      axios.get("/api/videos/types/" + type.typename).then((result) => {
        this.videos = result.data.data;
      });
    },
    gotoPersonalInFo(row) {
      this.$router.push({
        path: "/othersinfo",
        query: { id: row.id },
      });
    },
    performSearch() {
      if (this.searchType === "user") {
        this.isDrawerVisible = true;
        this.searchUsers();
      } else {
        this.fetchVideoData();
      }
    },
    fetchVideoData(keyword, selecttype, sort) {
      keyword = keyword || this.keyword;
      selecttype = selecttype || this.selecttype;
      sort = sort || this.sort;
      axios
        .get("/api/videos/main", {
          params: {
            page: this.videopage,
            pageSize: this.videopagesize,
            type: selecttype,
            sort: sort,
            keyword: keyword,
          },
        })
        .then((result) => {
          this.videos = result.data.data.rows;
          this.videototal = result.data.data.total;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    fetchTypes() {
      axios
        .get("/api/types/all")
        .then((response) => {
          this.types = response.data.data;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    searchUsers() {
      this.tabledrawer = true;
      axios
        .get("/api/videos/users", {
          params: {
            keyword: this.keyword,
            page: this.currentPage,
            pageSize: this.pageSize,
          },
        })
        .then((result) => {
          this.userData = result.data.data.rows;
          this.total = result.data.data.total;
          // this.tabledrawer = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleInput(value) {
      this.keyword = value;
    },

    goToFollowing() {
      // 跳转到关注内容页面
    },
    playVideo(id) {
      // 跳转到播放视频页面
      this.$router.push({
        path: "/watch",
        query: { id: id },
      });
    },
    gotoOthers(id) {
 
      this.$router.push({
        path: "/videoweb",
        query: { id: id },
      });
    },
    onChange(value) {
      console.log("value" + value);
      this.sort = value;
    },
  },
  mounted() {
    this.me = JSON.parse(localStorage.getItem("userdata"));
    this.fetchVideoData();
    this.fetchTypes();
  },
  watch: {
    tabledrawer(newVal) {
      if (!newVal) {
        this.isDrawerVisible = false;
      }
    },
  },
};
</script>
<style scoped>
@import url("../../assets/mainviewcolor.css");

.el-container {
  margin-top: 60px; /* 设置与 header 高度相等的 margin-top，以避免内容被遮挡 */
}
.el-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 0px 6px rgba(16, 16, 16, 0.59);
}
.el-aside {
  width: 10%;
  box-shadow: 0 0px 6px rgba(0, 0, 0, 0.415);
}
.logo {
  font-size: 24px;
  font-weight: bold;
  float: left;
}
.search-input {
  width: 350px; /* 修改宽度 */
  margin-left: 20px;
  margin-top: 10px; /* 上下居中 */
  margin-bottom: 10px; /* 上下居中 */
}

.el-carousel {
  width: 630px;
}



.menu {
  border-right: 0;
  width: 150px;
}
.video-meta {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
.video-title {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-carousel img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  
}
.el-image {
  width: 100%;
  height: 150px;
  cursor: pointer;
  
}

.content-wrapper {
  display: flex;
  
  
}

.carousel-wrapper {
  flex: 1;
  margin-right: 10px;
  margin-top: 10%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.carousel-container {
  margin-top: 10px;
  
}
.top-thumbnails-wrapper {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 20px;
  
}
.video-thumbnail-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.video-info {
  margin-top: 5px;
}

.video-description {
  font-size: 12px;
  color: #333;
  line-height: 1.2;
  margin-top: 5px;
  margin-left: 0px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
}
.el-menu-item span {
  font-size: 20px; /* 修改字体大小 */
  color: #fff; /* 修改字体颜色为白色 */
}
.el-menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  .carousel-wrapper {
    width: 400px;
    margin-right: 0;
  }
  .top-thumbnails-wrapper {
    margin-top: 20px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
}
</style>

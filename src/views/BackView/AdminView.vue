<template>
  <div>
    <el-container>
      <el-container>
        <aside-view></aside-view>
        <el-container>
          <el-header border="1px"
            >欢迎回来<HeadImage :avatarUrl="headimage"></HeadImage
          ></el-header>
          <el-main>
            <div>
              <div class="cards-container">
                <el-card style="width: 35%">
                  <el-avatar :size="50" :src="this.headimage" />
                  <br />
                  <p>欢迎您，管理员：{{ me.username }}</p>
                  <br />
                  <p>您的角色是：{{ rolename }}</p>
                </el-card>
                <el-card shadow="hover" style="width: 65%">
                  <div class="header">
                    <div class="title-poem-container">
                      <div class="title">文嘉《明日歌》</div>
                      <div
                        class="poem"
                        style="font-size: 18px; text-align: center"
                      >
                        <div>明日复明日</div>
                        <div>明日何其多</div>
                        <div>我生待明日</div>
                        <div>万事成蹉跎</div>
                      </div>
                    </div>
                    <div>
                      <el-button
                        class="countdown-footer"
                        link
                        @click="togglePause"
                        >{{ paused ? "继续" : "暂停" }}</el-button
                      >
                    </div>
                  </div>
                  <br />
                  <div>距离明日还剩</div>
                  <div>{{ countdownString }}</div>
                </el-card>
              </div>
              <div>
                <el-calendar>
                  <template #date-cell="{ data }">
                    <p :class="data.isSelected ? 'is-selected' : ''">
                      {{ data.day.split("-").slice(1).join("-") }}
                      {{ data.isSelected ? "✔️" : "" }}
                    </p>
                  </template>
                </el-calendar>
              </div>
            </div>
          </el-main>
          <el-footer>copyright by zengrui@sicnu</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import axios from "../../plugins/axios.js";
import { ref, onMounted, onUnmounted, computed } from "vue";
import AsideView from "../PopularElment/AsideView.vue";
import HeadImage from "../PopularElment/HeadImage.vue";

let headimage = ref(JSON.parse(localStorage.getItem("userdata")).headimage);
let countdownValue = ref(0);
let paused = ref(false);
let me = JSON.parse(localStorage.getItem("userdata"));
const getRemainingTime = () => {
  let now = new Date();
  let endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() - now.getTime();
};

let timer = null;
let rolename = ref("");
function fetchRole() {
  axios
    .get(
      "/api/roles/rolename/get/" +
        JSON.parse(localStorage.getItem("userdata")).roletype
    )
    .then((result) => {
      rolename.value = result.data.data;
    });
}

onMounted(() => {
  fetchRole();
  timer = setInterval(() => {
    if (!paused.value) {
      countdownValue.value = getRemainingTime();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const togglePause = () => {
  paused.value = !paused.value;
};

const countdownString = computed(() => {
  let hours = Math.floor(countdownValue.value / (1000 * 60 * 60));
  let minutes = Math.floor(
    (countdownValue.value % (1000 * 60 * 60)) / (1000 * 60)
  );
  let seconds = Math.floor((countdownValue.value % (1000 * 60)) / 1000);
  return `${hours}小时${minutes}分钟${seconds}秒`;
});
</script>
<style scoped>
@import url("../../assets/custom-styles.css");
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-poem-container {
  text-align: center;
  flex-grow: 1;
}
.countdown-footer {
  margin-top: 8px;
}
.cards-container {
  display: flex;
}
.el-card {
  margin-right: 20px;
}
.is-selected {
  color: #1989fa;
}
</style>

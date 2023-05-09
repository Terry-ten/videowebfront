<template>
    <div>
      <el-container>
        <el-container>
          <aside-view></aside-view>
          <el-container>
            <el-header border="1px">欢迎回来<HeadImage :avatarUrl="headimage"></HeadImage></el-header>
            <el-main></el-main>
            <el-footer>copyright by zengrui@sicnu</el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </template>
  <script>
  import AsideView from '../PopularElment/AsideView.vue';
  import HeadImage from '../PopularElment/HeadImage.vue';
  export default {
    components: {
      AsideView,
      HeadImage,
    },
    data () {
        return {
            headimage:JSON.parse(localStorage.getItem("userdata")).headimage
        }
    },
    
    methods:{
      
    },
    mounted () {
 
    }
  };
  </script>
  
  <style scoped>
@import url("../../assets/custom-styles.css");
</style>
  
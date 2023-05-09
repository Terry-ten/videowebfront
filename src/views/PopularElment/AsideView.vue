<template>
  <el-aside border>
    <el-scrollbar>
      <el-menu>
        <el-scrollbar>
          <el-menu>
            <el-sub-menu
              v-for="(topMenu, topIndex) in menuData"
              :key="topIndex"
              :index="topMenu.menuname"
            >
              <template #title>{{ topMenu.menuname }}</template>
              <el-menu-item
                v-for="(subMenu, subIndex) in filteredChildren(topMenu)"
                :key="subIndex"
                :index="subMenu.route"
              >
                <router-link :to="subMenu.route">{{
                  subMenu.menuname
                }}</router-link>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

  <script>
import axios from '../../plugins/axios';

export default {
  name: "AsideView",
  data() {
    return {
      menuData: [],
    };
  },
  methods: {
    async fetchMenuData() {
      // 从后端获取菜单数据
      const response = await axios.get("/api/menus/aside");
      const menuItems = response.data.data;
      const menuData = [
        {
          menuname: "首页",
          children: [],
        },
        {
          menuname: "业务管理",
          children: [],
        },
        {
          menuname: "系统管理",
          children: [],
        },
        
      ];

      menuItems.forEach((item) => {
        item.viewable = item.viewable === 1; 
        if (item.type === "首页") {
          menuData[0].children.push(item);
        } else if (item.type === "业务管理") {
          menuData[1].children.push(item);
        }else if(item.type==="系统管理"){
          menuData[2].children.push(item);
        }
      });

      this.menuData = menuData;
    },
    filteredChildren(topMenu) {
      return topMenu.children.filter((subMenu) => subMenu.viewable);
    },
  },
  created() {
    this.fetchMenuData();
  },
};
</script>
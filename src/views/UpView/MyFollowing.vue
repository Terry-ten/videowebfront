<template>
    <div>
      <el-container class="main-container">
        <el-header class="header" style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div class="logo">Your Logo</div>
          <el-dropdown class="avatar-dropdown">
            <span class="el-dropdown-link">
              <el-avatar size="large" icon="el-icon-user-solid"></el-avatar>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editProfile">编辑资料</el-dropdown-item>
                <el-dropdown-item @click="myCreation">我的创作</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-container>
          <el-aside width="200px" style="box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);">
            <el-menu :collapse="isCollapse" router default-active="1">
              <el-menu-item index="1">
                <i class="el-icon-user"></i>
                <template v-slot:title>
                  <span>个人信息</span>
                </template>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-star-on"></i>
                <template v-slot:title>
                  <span>我的关注</span>
                </template>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-s-custom"></i>
                <template v-slot:title>
                  <span>我的粉丝</span>
                </template>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
            <el-card>
              <el-table :data="users" border style="width: 100%" show-overflow-tooltip>
                <el-table-column prop="avatar" label="头像" width="120">
                  <template #default="{ row }">
                    <el-avatar :src="row.avatar"></el-avatar>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="180"></el-table-column>
                <el-table-column prop="bio" label="个人简介"></el-table-column>
                <el-table-column label="操作" width="180">
                  <template >
                    <el-button @click="$router.push('/myvideos')" type="primary" size="small">个人主页</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        isCollapse: false,
        users: [
          {
            username: 'User1',
            avatar: 'https://example.com/avatar1.jpg',
            bio: '这里是用户1的简介',
          },
          {
            username: 'User2',
            avatar: 'https://example.com/avatar2.jpg',
            bio: '这里是用户2的简介',
          },
        ],
      };
    },
  };
  </script>
  <style scoped>
  .main-container {
    height: 100vh;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #409EFF;
    height: 60px;
    box-shadow: 0 0px 6px rgba(16, 16, 16, 0.59);
  }
  el-aside{
    
  }
  .logo {
    color: #fff;
    font-size: 24px;
    margin-left: 20px;
  }
  
  .avatar-dropdown {
    margin-right: 20px;
    cursor: pointer;
  }
  
  .el-table {
    background-color: white;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 20px;
  }
  
  .el-table td,
  .el-table th {
    border-right: none;
  }
  </style>
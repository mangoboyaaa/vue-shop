<template>
  <el-container class="body1">
    <el-header class="head1">
      <div class="div1">
        <img class="img1" src="..\assets\20140617094119213.jpg" alt="" />
        <span class="span1">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <!-- 头部区域 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="button1">
          <button class="button2" @click="shousuo">|||</button>
        </div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse-transition="false"
          :collapse="isCollapse"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ' '"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单 -->
            <template slot="title">
              <!-- 一级菜单模板区 -->
              <i :class="iconsObj[item.id]" class="tubiao1"></i>
              <!-- 图标 -->
              <span>{{ item.authName }}</span>
              <!-- 文本 -->
            </template>

            <el-menu-item
              :index="'/'+subitem.path "
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="save1('/'+subitem.path)"
            >
              <!-- 二级菜单 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- 图标 -->
                <span>{{ subitem.authName }}</span>
                <!-- 文本 -->
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      ><!-- 右侧边栏 -->
      <el-main>
          <router-view></router-view>
      </el-main>
      <!-- 右侧主体 -->
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      iconsObj: {
        125: "iconfont icon-xuesheng",
        103: "iconfont icon-lianmengzhuanjia",
        101: "iconfont icon-tongzhigonggao",
        102: "iconfont icon-zhengceguizhang2",
        145: "iconfont icon-a-xiaoyuanfuwufuwudating",
      },
      menuList: [], //左侧菜单数据
      isCollapse:false,
      activePath:' '
      
    };
  },
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    out() {
      window.sessionStorage.clear();
      this.$router.push("/login"); //退出功能:1.清除token 2.跳转到初始页面
    },
    //获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    shousuo() {  //保存链接的激活状态
      this.isCollapse=!this.isCollapse

    },
    save1(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.body1 {
  height: 100%;
}
.head1 {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 0;
  color: #fff;
  font-size: 20px;
  align-items: center;
}

.div1 {
  display: flex;
  align-items: center;
}
.span1 {
  margin-left: 15px;
}
.img1 {
  height: 50px;
}
.tubiao1 {
  margin-left: 15px;
  margin-right: 10px;
}
.el-menu {
  border-right: 0;
}
.button2 {
  width: 100%;
  height: 100%;
  background-color: #4a5064;
  font-size: 20px;
  border: 1px solid #4a5064;
  letter-spacing: 0.1em;
  color: #fff;
  cursor: pointer;
}
.button1 {
  height: 30px;
}
</style>
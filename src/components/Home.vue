<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <!-- <img src="../assets/heima.png" alt=""> -->
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- 菜单折叠 -->
                <!-- 开启路由模式 -->
                <!-- default-active高亮显示 每次点击进行赋值 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                :default-active="activePath"
                :collapse="isCollapse"
                :collapse-transition='false'
                class="el-menu-vertical-demo"
                background-color="#333744"
                text-color="#fff"
                unique-opened
                router
                active-text-color="#409eff">
                <!-- 一级菜单 -->
                <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                    <!-- 一级菜单模板 -->
                    <template slot="title">
                        <i :class="iconObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <!-- 路由跳转的path -->
                    <!-- 二级菜单每次点击 保存路由的值到session 然后赋值给default-active -->
                    <el-menu-item :index="'/'+subItem.path" @click="saveNavState('/'+subItem.path)" v-for="subItem in item.children" :key="subItem.id">
                        <!-- 二级菜单的文本 -->
                         <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>

                </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      //   是否折叠
      isCollapse: false,
      //   未激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      // 折叠菜单
      this.isCollapse = !this.isCollapse
    //   菜单区域为变小主要是el-aside宽度200px设置
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      //   点击时候进行赋值
      this.activePath = sessionStorage.getItem('activePath')
    }
  }

}
</script>

<style lang="scss" scoped>
.home-container{
    height: 100%;
}
.el-header{
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    background-color: #373d41;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>

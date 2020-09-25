<template>

    <!-- 区域 -->
<el-container class="home_container">

    <!-- 头部区域 -->
  <el-header>
      <div >
          <!-- 黑马logo -->
          <div class="left">
              <img src="../assets/uploads/heima.png" alt="">
             <span id="dianshang"> 电商后台管理系统</span>

              <!-- 测试小人 -->
              <!-- <i class="iconfont icon-user "></i> -->
          </div>
          <!-- 退出按钮 -->
          <el-button type="info" @click='loginout' class="nice">退出</el-button>
      </div>
  </el-header>

  <!-- 主体区域 -->
  <el-container>

    <!--左侧导航菜单  开启router进行页面跳转-->
    <!-- 动态绑定 width,打开 width为200px,折起为64px -->
    <el-aside :width="isCollapse? '64px':'200px'">

        <!-- 开一个 ||| 打开关闭转换按钮, 取反 -->
        <div class="toggle_btn" @click='isCollapse=!isCollapse' >
                 <i class="el-icon-loading"></i>
        </div>
        <el-menu
      background-color="#5F9EA0"
      text-color="#fff"
      active-text-color="#ff6100"
      
     :unique-opened="true"

     :default-active="activePath"

    :collapse='isCollapse'

    :collapse-transition='false'

    router


      >

       <!-- 第一层遍历数据 -->

       <!-- 将 index 设为唯一值,属性绑定 id , 将number转为 string -->
         <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id" >

             <template slot="title">

                 <!-- TODO 动态绑定创建的字体对象 iconObj -->
                  <i :class="iconObj[item.id]" class="icon1"></i>

            <!-- 进入页面渲染数据 -->
                 <span>{{item.authName}}</span>

             </template>

            <!-- 第二层遍历数据 item.children里面还有一层数据需要遍历 -->

            <!-- 将第二层的index转为 唯一值 -->
            <!-- 点击方法用来获取保存的 path路径,刷新保存状态 -->
               <el-menu-item :index="'/'+ subItem.path  " v-for="subItem in item.children" :key="subItem.id" @click="savePath('/'+subItem.path)"> <span class="el-icon-menu"></span> {{subItem.authName}}
               <!-- {{subItem.path}} 是绑定准备跳转的路径 -->
              </el-menu-item>    

          

      </el-submenu>
    </el-menu>
    </el-aside>

<!-- 右侧区域 -->
    <el-main>

        <!-- 路由占位符  嵌套路由-->
        <router-view></router-view>


    </el-main>
  </el-container>
</el-container>

  
</template>

<script>
export default {

    data(){

        return {

            // TODO 左侧菜单数据
            menulist:[],

            // TODO 字体图标动态绑定 id值
            iconObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',
            },

            // TODO 激活的菜单 (默认为空)
            activePath:'',

            // TODO 左侧打开折起开关
            isCollapse:false

        }
    },

    methods:{

   //.FIXME: 退出 home页面
        loginout(){
            //   console.log(666);

            // TODO 1.跳转到 login页面
            this.$router.push('/login');

            // TODO 2.清除掉所有的 token令牌
            sessionStorage.clear();

            // TODO 3.退出成功提示
            this.$message.success('退出成功')

            //.TODO: 到此为止完成登录退出的功能
            // TODO 1.git status 检查文件状态
            // TODO 2.git add .
            // TODO 3.git commit -m '备注信息'
            // TODO 4.git checkout master 切回主分支
            // TODO 5.git merge login(分支名)
            // TODO 6.git push
            // TODO 7.推送分支 git push -u origin login

        },

   //.TODO: 获取左侧菜单列表数据
      async getMenuList(){
               const {data:res} = await this.$http('menus');
               if(res.meta.status !=200) return this.$message.error('获取失败')
                //  console.log(res);

            //    console.error('获取数据失败,请稍后重试')
                // console.log(res);

                 this.menulist = res.data;
      },

    //.TODO: 修改激活路径
    savePath(path){
           //   console.log(path); // 当前的 path 进行保存
        this.activePath = path;


        // TODO 将路径保存到本地存储中
        sessionStorage.setItem('path',path)

     
    }

    },

    //.FIXME: 钩子函数
    created(){
        // TODO  在钩子函数中调用获取左侧数据方法
        this.getMenuList();


       // TODO 将保存的 path 重新赋值
          //console.log(sessionStorage.getItem('path')); // 刷新后从本地存储获取的 path
          this.activePath = sessionStorage.getItem('path')


    }

}
</script>


<style lang='less' scope>
// 设置为less ,并加上 scope 不影响其他的

.home_container {
    height: 100%;


// 头部区域
    .el-header {
        background-color: #5F9EA0;
        padding-left: 0;

        >div {
            display: flex;
            // 两段对齐
            justify-content: space-between;
            // 侧轴居中
            align-items: center;
        }

        .left {
            font-size: 20px;
            color: #fff;
            img {
                vertical-align: middle;
                margin-right: 20px;
            }
        }
    }


// 左侧导航栏
    .el-aside {
    background-color: #5F9EA0;
    height: 100%;


// 字体图标
    .icon1 {
      margin-right: 10px;
    color: aquamarine;
    }

// |||控制折起打开开关
   .toggle_btn {
    color: #fff;
    text-align: center;
    background-color: #33E6CC;
    cursor: pointer;
}

// 处理右边的线
  .el_menu {
    border-right: 0;
}


}

.el-main {
    background-color: #4798B3;
}

.nice {
    background-color: #00808C;
    color: brown;
}

#dianshang {
    color: #CCCCFF;
}

}



</style>
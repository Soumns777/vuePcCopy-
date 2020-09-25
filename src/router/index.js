// TODO 如果要在一个模块化工程中使用,必须要通过 Vue.use() 明确的安装路由功能
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//.FIXME: 导入登录组件
import login from '../components/login.vue'

//.FIXME: 导入 home 组件
import home from '../components/home.vue'

//.FIXME: 导入 welcome 组件
import welcome from '../components/welcome.vue'

//.FIXME: 导入 users 组件
import users from '../components/users/users.vue'

//.FIXME: 导入 rights 组件
import rights from '../components/rights/rights.vue'

//.FIXME: 导入 roles组件
import roles from '../components/rights/roles.vue'

//.FIXME: 导入 categories 组件
import categories from '../components/goods/categories.vue'

//.FIXME: 导入 params 组件
import params from '../components/goods/params.vue'

//.FIXME: 导入 goods 组件
import goods from '../components/goods/goods.vue'

//.FIXME: 导入add组件
import add from '../components/goods/add.vue'

//.FIXME: 导入goods组件
import orders from '../components/order/orders.vue'

//.FIXME: 导入reports组件
import reports from '../components/reports/reports.vue'




//.FIXME: 创建路由以及挂载路由规则
const router = new VueRouter({
    routes: [
        // 重定向 (页面开启默认到login页面)
        { path: '/', redirect: '/login' },

        // 挂载login组件的路由规则
        { path: '/login', component: login },

        // 挂载home组件的路由规则
        {
            path: '/home',
            component: home,
            // 重定向到 welcome页面
            redirect: '/welcome',

            // 嵌套路由
            children: [
                // 挂载welcome路由规则
                {
                    path: '/welcome',
                    component: welcome
                },
                // 挂载 users路由规则
                {
                    path: '/users',
                    component: users
                },
                // 挂载 rights 路由规则
                {
                    path: '/rights',
                    component: rights
                },
                // 挂载 roles 路由规则
                {
                    path: '/roles',
                    component: roles
                },
                // 挂载 categories路由规则
                {
                    path: '/categories',
                    component: categories
                },
                // 挂载params路由规则
                {
                    path: '/params',
                    component: params
                },
                // 挂载goods路由规则
                {
                    path: '/goods',
                    component: goods
                },
                // 挂载add路由规则
                {
                    path: '/goods/add',
                    component: add
                },
                // 挂载orders路由规则
                {
                    path: '/orders',
                    component: orders
                },
                // 挂载reports组件
                {
                    path: '/reports',
                    component: reports
                }

            ]
        }
    ]
})

//.FIXME: 前置导航守卫(防止用户没有登录违法登录其他页面,必须要经过登录页面携带token令牌)
router.beforeEach((to, from, next) => {
    // to 表示将要去的路由地址对象
    // from 表示从何处来的路由地址对象
    // next 是一个方法, 用来放行的

    // TODO 如果是访问 login页面 直接放行(可以随便登录)
    // console.log(to);
    // console.log(to.path);

    //.FIXME: 需要写 ==,进行判断
    if (to.path == '/login') {
        // 直接放行
        next()
    }
    // TODO 如果访问不是从登录页面过来的,首先验证 token令牌,有token令牌就放行,没有就 return重新前往登录页面
    else {
        // 获取 token令牌 
        const token = sessionStorage.getItem('token');

        // 查看是否有token令牌(假造的token令牌不行,会跳转但是数据出不来)
        // 没有就强制跳往 login 页面
        if (!token) return next('/login');


        // 最后放行,不然不能跳转
        next();
    }

})

// 导出路由
export default router
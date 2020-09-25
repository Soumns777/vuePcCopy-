// 导入依赖包
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// TODO 导入global文件放在全局 (下间距)
import './assets/css/global.css'

// TODO 导入字体图标 (css文件)
import './assets/fonts/iconfont.css'

// TODO 导入表格 vue-table-with-tree-grid (注册组件)
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// TODO 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

// TODO  导入lodash
var _ = require('lodash');

// TODO 导入nprogress (css也要加入)
import nprogress from 'nprogress'
import '../node_modules/nprogress/nprogress.css'




// TODO 全局导入 axios
import axios from 'axios';

// TODO 基地址 (需要在挂载之前)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// TODO 将 axios当做一个属性挂载给 vue 的函数的原型上,这样在其他文件中也能发送 axios 请求
Vue.prototype.$http = axios;

//.FIXME: 请求拦截器挂载 token令牌 
axios.interceptors.request.use(function(config) {

    //.TODO:  nprogress.start() 加载动画
    nprogress.start()

    // console.log(config);

    // TODO  手动获取 token令牌
    config.headers.Authorization = sessionStorage.getItem('token')
    return config;
}, function(error) {
    return Promise.reject(error);
});

//.FIXME: 响应拦截器
axios.interceptors.response.use(function(config) {

    //.TODO: 加载动画
    nprogress.done();
    return config
})




//.FIXME: 在全局中定义过滤时间的过滤器  (将事件戳转换为 年月日)

// Vue.filter('dateFormate', val => {

//     //console.log(val); // 1599272846177 事件戳

//     // 获取当前时间 (时间戳转换为 当前时间)
//     const date = new Date(val);

//     // 年
//     const year = date.getFullYear();

//     // 月
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');

//     // 日
//     const day = date.getDate().toString().padStart(2, '0');

//     // 时
//     const hour = date.getHours().toString().padStart(2, '0');

//     // 分
//     const min = date.getMinutes().toString().padStart(2, '0');

//     // 秒
//     const sec = date.getSeconds().toString().padStart(2, '0');

//     return `${year}-${month}-${day} ${hour}:${min}:${sec}`

// })



// 


//.FIXME: 导入 moment.js 制作过滤器

import moment from 'moment'
Vue.filter('dateFormate', function(val) {
    return (moment(val).format('YYYY-MM-DD HH:mm:ss'))
})



// 去除控制台日志信息
Vue.config.productionTip = false

// TODO 将路由挂载到vue实例上
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
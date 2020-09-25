// TODO 导入vue
import Vue from 'vue'

// TODO 按需导入 表单组件
import { Button, Input, Form, FormItem, Timeline } from 'element-ui';

// TODO 按需导入  弹出框组件
import { Message } from 'element-ui'

// TODO 按需导入 layout布局
import { Container, Header, Aside, Main } from 'element-ui'

// TODO 按需导入 导航菜单
import { Menu, Submenu, MenuItem } from 'element-ui'

// TODO 按需导入 面包屑导航
import { Breadcrumb, BreadcrumbItem, Card } from 'element-ui'

// TODO 按需导入 栅格布局
import { Row, Col } from 'element-ui'

// TODO 按需导入 表格
import { Table, TableColumn, Switch, Tooltip, Pagination } from 'element-ui'

// TODO 按需导入提示信息
import { Dialog } from 'element-ui'

// TODO 按需导入弹出框 MessageBox组件
import { MessageBox } from 'element-ui'

// TODO 按需导入 tag 组件
import { Tag } from 'element-ui'

// TODO 按需导入 tree(树形结构)
import { Tree } from 'element-ui'

// TODO 按需导入 下拉菜单 selsct
import { Select, Option } from 'element-ui'

// TODO 按需导入 级联选择器 cascader
import { Cascader } from 'element-ui'

// TODO 按需导入 警告提示信息
import { Alert } from 'element-ui'

// TODO 按需导入 Tab栏切换
import { Tabs, TabPane } from 'element-ui'

// TODO  按需导入 Step步骤条
import { Step, Steps } from 'element-ui'

// TODO 按需导入 check-group  多选框组件
import { CheckboxGroup } from 'element-ui'
import { Checkbox } from 'element-ui'

// TODO  按需导入 upload 组件
import { Upload } from 'element-ui'

// TODO 按需导入 timeline、timeline-item时间线组件
import { TimeLine, TimelineItem } from 'element-ui'






// TODO 注册为全局可用的

// 表单
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)

// 左侧菜单导航
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

// 面包导航
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)

// 栅格导航
Vue.use(Row)
Vue.use(Col)

// 表格
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)

// 提示信息
Vue.use(Dialog)

// Tag组件
Vue.use(Tag)

// Tree组件
Vue.use(Tree)

// 下拉框组件
Vue.use(Select)
Vue.use(Option)

// 级联组件
Vue.use(Cascader)

// 警告提示信息
Vue.use(Alert)

// Tab栏组件
Vue.use(Tabs)
Vue.use(TabPane)

// Step组件
Vue.use(Step)
Vue.use(Steps)

// 多选复选框 
Vue.use(CheckboxGroup)
Vue.use(Checkbox)

// upload 组件
Vue.use(Upload)

// 时间线组件
Vue.use(Timeline)
Vue.use(TimelineItem)


//.FIXME: 将弹出框组件 Message 挂载到全局
Vue.prototype.$message = Message;

//.FIXME: 将弹出框组件 MessageBox.confirm 这个方法挂载到全局
Vue.prototype.$confirm = MessageBox.confirm;
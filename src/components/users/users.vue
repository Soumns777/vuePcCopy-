<template>
  <div class="gogogo">
    <!--.TODO: 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当路径为 '/  会自动跳转到 welcome页面-->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- .TODO: 卡片区域 -->
    <el-card class="box-card">
      <!-- gutter 间距 -->
      <el-row :gutter="15">
        <!--双向绑定 queryInfo.query,然后点击按搜索按钮发送请求 -->
        <!-- clearable 删除按钮  clear事件清除信息 -->
        <el-col :span="8"
          ><el-input v-model="queryInfo.query" clearable @clear="getUserList"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button></el-input
        ></el-col>
        <el-col :span="5">
          <el-button type="success" @click="addUserVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- .TODO: Table表格区域 -->

      <!-- 表格边框 border 斑马纹 stripe -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <!-- 添加 type='index' 可以在前面添加索引 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>

        <!-- 可以用作用域插槽来获取状态 -->
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scoped">
            <!-- {{scoped.row.mg_state}} 布尔值 -->
            <!-- change事件调用了 userStateChange事件有一个返回值,但是由于 scoped.row.mg_state 双向绑定可以不用,需要将当前的数据传入进去-->
            <el-switch
              v-model="scoped.row.mg_state"
              @change="userStateChange(scoped.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- 三个按钮 -->
        <el-table-column label="操作">
          <template v-slot="scoped">
            <!-- 定义数据不调用会报错 -->
            ID:{{ scoped.row.id }}
            <br />

            <!-- 点击修改的按钮 触发修改用户的对话框 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="getUserData(scoped.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-delete"
              @click="removeUserById(scoped.row.id)"
            ></el-button>

            <!-- 移入按钮会有提示信息 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色啊弟弟"
              placement="top"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-setting"
                @click="setRoles(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- .TODO: 分页器区域 -->

      <!-- size-change事件, pageSize 改变时会触发, 返回值为每页条数  -->
      <!-- current-change事件,currentPage 改变时会触发,返回值为当前页 -->

      <!-- :current-page 属性绑定当前页 -->
      <!-- :page-sizes 属性绑定每页显示个数选择器的选项设置 -->
      <!-- :page-size 属性绑定每页显示条目个数 -->
      <!-- layout 页面显示哪些内容 -->
      <!-- :total属性绑定总数 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- .TODO: 添加用户的对话框 Dialog-->
      <!-- 设置 visible属性,接收布尔值,当为 true时显示 Dialog   -->
      <!--   close 	Dialog 关闭的回调函数 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserVisible"
        width="50%"
        @close="addFormClose"
      >
        <!-- 表单内容  model 属性绑定一个表单对象 addForm-->
        <!-- 属性绑定校验规则  :rules='addFormRules'-->
        <!-- 添加 ref属性,这样在 对话框中就可以获取 el-form中的方法 -->
        <el-form
          :model="addForm"
          label-width="80px"
          :rules="addFormRules"
          ref="addFormRef"
        >
          <!-- 分别双向绑定这个表单对象里面的属性 -->
          <!-- prop 接收规则里面的属性-->
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>

          <el-form-item label="用户密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <!-- 点击取消退出对话框 -->
          <!-- 点击确认 进行  预校验 ==> 发送请求 ==> 重新渲染数据 ==> 清空表单 -->
          <el-button type="danger" @click="addUserVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="addUserForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- .TODO: 修改用户的对话框 Dialog-->
      <!-- 可以和添加用户的对话框一样的 退出保存回调函数  -->
      <el-dialog
        title="修改用户"
        :visible.sync="editUserVisible"
        width="50%"
        @close="editFormClose"
      >
        <!-- 表单内容  model 属性绑定一个表单对象 editForm-->
        <!-- 属性绑定校验规则  可以跟添加用户的对话框绑定同一个规则-->
        <!-- 添加 ref属性,这样在 对话框中就可以获取 el-form中的方法 进行预校验 -->
        <el-form
          :model="editForm"
          label-width="80px"
          :rules="addFormRules"
          ref="editFormRef"
        >
          <!-- 分别双向绑定这个表单对象里面的属性 -->
          <!-- prop 接收规则里面的属性-->
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <!-- 点击取消退出对话框 -->
          <!-- 点击确认 进行  预校验 ==> 发送请求 ==> 重新渲染数据 ==> 清空表单 -->
          <el-button type="danger" @click="editUserVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="editUserForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- .TODO: 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRolesVisible"
        width="50%"
        @close="setRolesClose"
      >
        <span>当前的用户 : {{ setRolesData.username }}</span>
        <br /><br />
        <span>当前的角色 : {{ setRolesData.role_name }}</span>
        <br /><br />
        <span
          >分配的角色 :
          <!-- FIXME selectValue 双向绑定的是 下拉菜单选中之后的值,会将选中的角色保存到这里面 -->

          <!-- label 绑定的是在页面中显示的内容 -->
          <!-- value 是确认选中的内容,选中记录的是 id值 -->
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
              v-for="item in allRoles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRolesVisible = false" type="warning"
            >取 消</el-button
          >

          <el-button type="primary" @click="setRolesSure">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 两个字定义规则需要写在 data里面
    //  邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(value)
        ? callback()
        : callback(new Error('请输入合法的邮箱'))
    }

    // 手机号校验规则
    var checkMobile = (rule, value, callback) => {
      return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(
        value
      )
        ? callback()
        : callback(new Error('请输入合法的手机号'))
    }

    return {
      // TODO get请求获取数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4,
      },

      // TODO 用户列表
      userList: [],

      // TODO 总数
      total: 0,

      // TODO 设置 visible属性,接收布尔值,当为 true时显示 Dialog  (添加用户对话框)
      addUserVisible: false,

      // TODO 设置 visible属性,接收布尔值,当为 true时显示 Dialog  (修改用户对话框)
      editUserVisible: false,

      // TODO 用来控制分配角色对话框的打开装填 (默认为关闭状态)
      setRolesVisible: false,

      // TODO 添加用户的对话框
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },

      // TODO 修改用户的对话框
      editForm: {
        username: '',
        email: '',
        mobile: '',
      },

      // TODO 表单校验规则  addFormRules
      addFormRules: {
        //  姓名校验规则
        username: [
          { required: true, message: '请输入正确姓名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        //  密码校验规则
        password: [
          { required: true, message: '请输入正确密码', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur',
          },
        ],
        // 邮箱校验规则
        email: [
          { required: true, message: '请输入正确邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        // 手机校验规则
        mobile: [
          { required: true, message: '请输入正确号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },

      // TODO 用来设置分配角色的数据
      setRolesData: {},

      // TODO 获取所有的角色数据
      allRoles: [],

      // TODO 下拉框已经选中的值 (选中的角色,一开始默认为空)
      selectValue: '',

      //
    }
  },

  // 方法
  methods: {
    // TODO  渲染页面数据
    async getUserList() {
      // TODO  利用 axios发送请求 ($http), axios携带参数发送请求需要携带一个 params对象
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      // console.log(res);

      // TODO 先判断返回的状态码是否为200,如果不是就退出,是的就赋值数据
      if (res.meta.status != 200) return this.$message.error('获取数据失败')

      // this.$message.success('获取数据成功')

      // 获取返回的数据并赋值
      this.userList = res.data.users
      //  console.log(this.userList);

      this.total = res.data.total
      // console.log(this.total);
    },

    // TODO 修改每页显示多少条 pagesize 发生变化触发的函数,返回每条页数
    handleSizeChange(newVal) {
      // 重新赋值
      this.queryInfo.pagesize = newVal

      // 重新发送请求 渲染页面
      this.getUserList()
    },

    // TODO currentPage 改变时会触发发,返回当前页
    handleCurrentChange(newVal) {
      // 重新赋值
      this.queryInfo.pagenum = newVal

      // 重新发送请求 渲染页面
      this.getUserList()
    },

    // TODO 修改用户状态 (刷新会保留状态)
    async userStateChange(info) {
      // 用户传入的数据
      // console.log(info);

      // 发送请求修改用户状态 接口里的地址 users/:uId/state/:type ,需要将用户输入的数据传入
      const { data: res } = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      )
      //   console.log(res);

      // 根据返回的状态码反应信息 (优化:防止修改失败,应该将状态取反)
      if (res.meta.status != 200) return this.$message.error('就你也配改状态?')
      this.$message.success('您可真牛啊状态都能改呀!')
    },

    // TODO  添加用户  表单重置
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },

    // TODO 添加表单数据
    //  1.先进行预校验
    //  2.然后发送请求
    //  3.重新渲染数据
    //  4.退出对话框
    addUserForm() {
      //   console.log(66);

      // 1.调用方法进行预校验
      this.$refs.addFormRef.validate(async (val) => {
        // console.log(val); // false

        //   进行返回的布尔值进行判断是否 发送请求
        if (!val) return this.$message.error('请输入完整信息')
        this.$message.success('鲍爷已经潜入北京内部')

        // 2.发送请求
        const { data: res } = await this.$http.post('users', this.addForm)
        //  console.log(res);

        //   根据返回的状态码进行判断
        if (res.meta.status != 201) return this.$message.error('发送请求成败')

        this.$message.success('鲍爷成功获取了共产党绝密文件,请求接应')

        //  3.重新渲染表格数据
        this.getUserList()

        // 4.退出对话框
        this.addUserVisible = false
      })
    },

    // TODO 修改表单数据 表单重置
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },

    // TODO 发送请求获取表单数据 获取传递过来的 id值
    // 根据id发送请求获取数据
    async getUserData(id) {
      // console.log(id);

      // 打开修改用户的对话框
      this.editUserVisible = true

      // 发送请求
      const { data: res } = await this.$http.get(`users/${id}`)
      //  console.log(res);

      //   根据返回的状态码确认是否返回数据
      if (res.meta.status != 200) this.$message.error('查询用户数据失败')
      this.$message.success('鲍爷接应已经到了,速归')

      //  将返回的数据 返回给 editForm
      this.editForm = res.data
    },

    // TODO 修改用户数据的方法
    editUserForm() {
      // console.log(666);

      // 1.先进行预校验
      this.$refs.editFormRef.validate(async (val) => {
        //   console.log( val);

        // 对返回的 val布尔值进行判断 如果不是 false就发送请求
        if (!val) return this.$message.error('鲍爷潜入失败惨遭杀害')
        this.$message.success('鲍爷:哟西,我真的是死啦死啦的吊')

        // 2.发送请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )

        // 3.关闭对话框
        this.editUserVisible = false

        // 4.重新渲染页面
        this.getUserList()

        this.$message.success('鲍爷原子弹都造出来了')
      })
    },

    // TODO 根据id删除对应用户
    async removeUserById(id) {
      // console.log(`%c ${id}`,  'color:springgreen');

      const res = await this.$confirm(
        '个是要把那个小次老子带走',
        '各单位注意',
        {
          // 1. 确认会返回一个 confirm  字符串
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          //2. catch 会把错误获取并返回  cancel字符串
        }
      ).catch((err) => err)

      //   console.log(res);

      // 3. 根据返回的字符串 确认要进行的操作
      if (res != 'confirm') return this.$message.info('还是不太行')

      this.$message.success('干死那个小次老子')

      // 4.确认删除数据 (根据id删除数据)
      const { data: val } = await this.$http.delete(`users/${id}`)

      //   console.log(val);

      // 5.根据返回的状态码判断 是否删除成功
      if (val.meta.status != 200)
        return this.$message.error('连数据都删除不了还删号码')

      this.$message.success('就删这么点数据')

      // 6.重新渲染页面
      this.getUserList()
    },

    // TODO 分配角色 (获取数据)
    async setRoles(role) {
      // 1. 将获取的角色赋值给 setRolesData
      this.setRolesData = role
      //  console.log(role);

      // 2.发送获取所有的角色数据
      const { data: res } = await this.$http.get('roles')
      //  console.log(res);

      // 3.根据返回的状态码 判断是否将数据返回给 allRoles
      if (res.meta.status != 200) return this.$message.error('获取用户角色失败')

      this.allRoles = res.data

      //  .打开分配角色对话框
      this.setRolesVisible = true
    },

    // TODO 关闭对话框  下拉菜单默认选中的值为空(selectValue),且将分配角色的对象数据清空
    setRolesClose() {
      this.selectValue = ''
      this.setRolesData = {}
    },

    // TODO 分配角色 (同步数据到数据库)
    async setRolesSure() {
      // 用户 ID
      //console.log(this.setRolesData.id);
      const id = this.setRolesData.id
      console.log(id)

      // 1.当用户没有选角色时  提醒用户
      if (!this.selectValue) return this.$message.info('麻烦爷选个角色哈')

      // 1.发送请求分配角色
      const { data: res } = await this.$http.put(`users/${id}/role`, {
        rid: this.selectValue,
      })
      // console.log(res);

      // 2.根据响应的状态码 判断是否提示成功
      if (res.meta.status != 200) return this.$message.error('设置角色失败')

      // 3.重新渲染页面,提醒成功,关闭对话框
      this.getUserList()
      this.$message.success('设置成功')
      this.setRolesVisible = false
    },

    //
  },

  // TODO  钩子函数
  created() {
    // 调用写的方法发送 axios 请求
    this.getUserList()
  },
}
</script>

<style lang="less" scope>
// 删除小按钮
.el-icon-delete {
  color: brown;
}
</style>

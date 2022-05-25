<template>
  <div>
    <!--.TODO: 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当路径为 '/  会自动跳转到 welcome页面-->
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- .TODO: 卡片区域 -->
    <el-card class="box-card">
      <!-- 去除后面的 x 号 -->
      <el-alert
        title="只用于为三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
        center
      >
      </el-alert>

      <p>选择商品分类:</p>
      <!-- selectKeys 选中分类的id值 -->
      <!-- 数据源 cateList -->
      <!-- 级联选择框 配置项 cascaderProps -->
      <!-- 级联选择框回调函数,选中节点change时触发 -->

      <!-- 级联选择框 -->
      <el-cascader
        v-model="selectKeys"
        :options="cateList"
        :props="cascaderProps"
        @change="handleChange"
        clearable
      >
      </el-cascader>

      <!-- Tab选项卡 -->
      <!-- 双向绑定  绑定值 ==> 选中选项卡的 name  -->
      <!-- stretch 标签的宽度自动撑开 -->
      <!-- type="border-card" 卡片化 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
        :stretch="false"
        type="border-card"
      >
        <!-- .TODO:  动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 属性绑定  计算属性返回的布尔值,确认按钮的 禁用状态 (只有当选中的是三级分类时,下面的按钮才可以点) -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addAttributeVisible = true"
            >添加参数</el-button
          >

          <!--FIXME  表格区域 -->
          <!-- data 绑定的 激活状态为 many的面板的数据 -->
          <el-table :data="manyData" style="width: 100%" stripe border>
            <!-- 展开列 -->
            <el-table-column type="expand" width="50" label="展开列">
              <!-- 用作用域插槽获取数据 -->
              <template v-slot="scope">
                <!-- {{scope.row.inputVisible}} -->

                <!-- 循环展示的 tag标签 -->
                <!-- closable 可删除 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  type="success"
                  closable
                  @close="delTag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>

                <!-- 添加标签 NewTag -->
                <!-- 布尔值  inputVisible-->
                <!-- inputValue 输入框的值 -->

                <!-- scope.row.inputVisible 作用域插槽获取自己遍历自己的属性 -->

                <!-- 将 scope.row作为参数传进方法里,修改自己的data数据-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>

                <!-- 添加新标签 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  type="success"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- 索引列  -->
            <el-table-column
              type="index"
              width="50"
              label="索引列"
            ></el-table-column>

            <!-- 参数名称列 -->
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>

            <!-- 操作列 -->
            <el-table-column label="操作" width="180">
              <!-- 用作用域插槽获取按钮 id -->
              <template v-slot="scope">
                ID: {{ scope.row.attr_id }} <br /><br />

                <!-- 两个按钮 -->
                <el-button
                  type="warning"
                  class="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- .TODO: 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 属性绑定  计算属性返回的布尔值,确认按钮的 禁用状态 (只有当选中的是三级分类时,下面的按钮才可以点) -->
          <el-button
            type="warning"
            size="mini"
            :disabled="isDisabled"
            @click="addAttributeVisible = true"
            >添加属性</el-button
          >

          <!--FIXME  表格区域 -->
          <!-- data 绑定的 激活状态为 many的面板的数据 -->
          <el-table :data="onlyData" style="width: 100%" stripe border>
            <!-- 展开列 -->
            <el-table-column type="expand" width="50" label="展开列">
              <!-- 用作用域插槽获取数据 -->
              <template v-slot="scope">
                <!-- {{scope.row.inputVisible}} -->

                <!-- 循环展示的 tag标签 -->
                <!-- closable 可删除 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  type="success"
                  closable
                  @close="delTag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>

                <!-- 添加标签 NewTag -->
                <!-- 布尔值  inputVisible-->
                <!-- inputValue 输入框的值 -->

                <!-- scope.row.inputVisible 作用域插槽获取自己遍历自己的属性 -->

                <!-- 将 scope.row作为参数传进方法里,修改自己的data数据-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>

                <!-- 添加新标签 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  type="success"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- 索引列  -->
            <el-table-column
              type="index"
              width="50"
              label="索引列"
            ></el-table-column>

            <!-- 参数名称列 -->
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>

            <!-- 操作列 -->
            <el-table-column label="操作" width="180">
              <!-- 用作用域插槽获取按钮 id -->
              <template v-slot="scope">
                ID: {{ scope.row.attr_id }} <br /><br />

                <!-- 两个按钮 -->
                <el-button
                  type="warning"
                  class="el-icon-edit"
                  size="mini"
                  @click="editParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- .FIXME: 添加参数/添加属性的对话框 -->
      <!-- 可以属性绑定  :title='text' 渲染计算属性 -->
      <!-- 对话框的 close 事件 -->
      <el-dialog
        :title="'添加' + text"
        :visible.sync="addAttributeVisible"
        width="50%"
        @close="addAttributeClose"
      >
        <!-- 表单区域 -->
        <el-form
          :model="addAttributeFormData"
          label-width="80px"
          ref="addAttributeRef"
          :rules="addAttributeRules"
        >
          <el-form-item :label="text" prop="attr_name">
            <el-input v-model="addAttributeFormData.attr_name"> </el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addAttributeVisible = false" type="warning"
            >取 消</el-button
          >

          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- .FIXME: 编辑参数/编辑属性的对话框 -->
      <!-- 可以属性绑定  :title='text' 渲染计算属性 -->
      <!-- 对话框的 close 事件 -->
      <el-dialog
        :title="'编辑' + text"
        :visible.sync="editAttributeVisible"
        width="50%"
        @close="editAttributeClose"
      >
        <!-- 表单区域 -->
        <el-form
          :model="editAttributeFormData"
          label-width="80px"
          ref="editAttributeRef"
          :rules="addAttributeRules"
        >
          <el-form-item :label="text" prop="attr_name">
            <el-input v-model="editAttributeFormData.attr_name"> </el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editAttributeVisible = false" type="warning"
            >取 消</el-button
          >

          <el-button type="primary" @click="editParamsSure">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //.FIXME: 参数列表数据 (默认)
      cateList: [],

      //.FIXME:  级联选择框的选中数组 id
      selectKeys: '',

      //.FIXME: 级联选择框的配置项
      cascaderProps: {
        // 显示的内容
        label: 'cat_name',

        // 父子关联的节点
        children: 'children',

        // 触发时机
        expandTrigger: 'hover',

        // 提交给后台的id值
        value: 'cat_id',

        // 是否严格遵守父子节点不互相关联 (不能加上,只能操作第三级分类)
        // checkStrictly:true,
      },

      //.FIXME: tabs选项卡的激活的面板
      activeName: 'many',

      //.FIXME: 存放动态参数的   数据源
      manyData: [],

      //.FIXME: 存放静态睡醒的  数据源
      onlyData: [],

      //.FIXME: 控制添加参数或属性的对话框的打开状态
      addAttributeVisible: false,

      //.FIXME: 控制编辑参数或属性的对话框的打开状态
      editAttributeVisible: false,

      //.FIXME: 添加参数或属性的表单的数据
      addAttributeFormData: {
        // 渲染的数据
        attr_name: '',
      },

      //.FIXME: 编辑参数或属性的表单的数据
      editAttributeFormData: {
        //  渲染数据
        attr_name: '',

        //  属性id
        attr_id: '',
      },

      //.FIXME: 添加参数或属性的表单的规则、
      addAttributeRules: {
        attr_name: [
          { required: true, message: '请输入正确参数', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },

      //.FIXME: 输入框和tag标签切换的配置属性
      //   inputVisible:false,
      //   inputValue:'',

      //
    }
  },

  // FIXME 方法
  methods: {
    // TODO 获取分类数据列表
    async getCateList() {
      // 1.发送请求获取数据
      const { data: res } = await this.$http.get('categories')
      //console.log(res);

      if (res.meta.status != 200) return this.$message.error('获取分类数据失败')

      //  数据赋值给分类数据列表
      this.cateList = res.data
    },

    // TODO 级联选择框的回调函数  (选中节点发生变化时触发)
    handleChange() {
      // 发生变化时 传回来的是分类id数组
      //   console.log(this.selectKeys);
      //   console.log(this.selectKeys.length);

      // TODO 当将级联选择框清空之后  不再展示表格中的数据 (去掉级联的搜索内容,下面的数据清空)
      if (this.selectKeys.length == 0)
        return (this.manyData = this.onlyData = [])

      // 在改变级联选择框时调用函数
      this.getParamsList()
    },

    // TODO Tab选项卡切换触发的事件
    handleTabClick() {
      // 激活面板的 name值
      console.log(`%c ${this.activeName}`, 'color:springgreen')

      //  切换选项卡时调用函数
      this.getParamsList()
    },

    // TODO: 获取参数数据 (根据激活面板的 activeName 值)
    async getParamsList() {
      // 判断 this.selectKeys.length是否为 3  (当不是选中三级分类时,手动将 this.selectKeys 清空,可能有的二级分类没有三级分类)
      if (this.selectKeys.length != 3) return (this.selectKeys = [])

      // 获取第二级分类数据
      const { data: res } = await this.$http.get(
        `categories/${this.selectKeys[2]}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )

      if (res.meta.status != 200) return this.$message.error('获取参数失败')

      //.FIXME: 在要展开行中渲染多个tag标签,需要将data中的attr_vals以空格分隔转换成数组
      // (空字符串会有一个 空格,优化)

      res.data.forEach((item) => {
        //   console.log(item);
        item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : []

        // 因为输入框和新增tag切换不能共享data中独一份数据,在遍历的时候手动为每一项添加自己的布尔值和value值(把数据放在作用域插槽)
        item.inputVisible = false
        item.inputValue = ''
      })

      // FIXME 根据激活面板的不同  将返回的数据挂载到不同的数据源上用来渲染不同的表格
      this.activeName == 'many'
        ? (this.manyData = res.data)
        : (this.onlyData = res.data)

      // console.log(res);
    },

    // TODO 关闭添加参数和属性的对话框  清空表单
    addAttributeClose() {
      this.$refs.addAttributeRef.resetFields()
    },

    // TODO 关闭编辑参数或属性的对话框 清空表单
    editAttributeClose() {
      this.$refs.editAttributeRef.resetFields()

      // 级联默认选中内容没有内容时,将编辑参数的表单数据清空
      this.editAttributeFormData = {}
    },

    // TODO 添加参数或属性  发送请求同步数据到数据库
    addParams() {
      // 1.先进行预校验
      this.$refs.addAttributeRef.validate(async (boo) => {
        if (!boo) return this.$message.error('请输入必填项')

        // 2.发送请求 同步数据 (分类ID:第三层分类的ID)
        const { data: res } = await this.$http.post(
          `categories/${this.selectKeys[2]}/attributes`,
          {
            attr_name: this.addAttributeFormData.attr_name,
            attr_sel: this.activeName,
          }
        )

        //console.log(res);

        // 3.根据返回的状态码 判断是否同步数据
        if (res.meta.status != 201) return this.$message.error('添加参数失败')

        // 4.重新渲染页面  获取参数数据列表刷新页面
        this.getParamsList()

        // 5.关闭对话框
        this.addAttributeVisible = false

        // 6.提示成功
        this.$message.success('添加成功')
      })
    },

    // TODO  编辑参数或属性 获取数据
    editParams(role) {
      //  console.log(role); //传进来的分类数据
      //console.log(role.attr_name); // 对应的内容
      // console.log(role.attr_id);

      // TODO 赋值 可以将数据全部赋值
      //  this.editAttributeFormData = role;

      //1. 将获取的内容 赋值给表单数据 (点开表单就会默认显示编辑内容)
      this.editAttributeFormData.attr_name = role.attr_name

      // 将属性的 id赋值给  编辑属性的表单数据的 属性id,用来后面的编辑属性
      this.editAttributeFormData.attr_id = role.attr_id

      // 打开编辑参数对话框
      this.editAttributeVisible = true
    },

    // TODO  编辑参数或属性  将数据同步到数据库
    async editParamsSure() {
      //1.FIXME:  获取发送请求所需的参数

      // 分类id this.selectKeys[2]
      // console.log(this.selectKeys[2]);

      // 属性id this.editAttributeFormData.attr_id
      // console.log(this.editAttributeFormData.attr_id);

      //新属性名字 this.editAttributeFormData.attr_name
      //console.log(this.editAttributeFormData.attr_name);

      // 属性类型  this.activeName  激活状态的面板
      //console.log(this.activeName);

      //2.FIXME: 发送请求 同步修改的属性数据到数据库
      const { data: res } = await this.$http.put(
        `categories/${this.selectKeys[2]}/attributes/${this.editAttributeFormData.attr_id}`,
        {
          attr_name: this.editAttributeFormData.attr_name,
          attr_sel: this.activeName,
        }
      )

      //console.log(res);

      //3.FIXME: 根据返回的状态码 判断是否更新属性数据成功
      if (res.meta.status != 200) return this.$message.error('更新属性数据失败')

      //4.FIXME: 重新渲染属性数据、关闭对话框、提示更新成功
      this.getParamsList()
      this.editAttributeVisible = false
      this.$message.success('更新属性数据成功')
    },

    // TODO  删除参数或属性
    async delParams(id) {
      //   1.弹出MessageBox 提示框
      const res = await this.$confirm('是否删除改参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      //console.log(res);

      //   2.根据返回的字符串 判断是否删除改参数
      if (res != 'confirm') return this.$message.info('已经取消删除')

      // console.log(id); // 传过来的id是 attr_id, 参数的id是选中项的最后一项 this.selectKeys[2]

      const { data: val } = await this.$http.delete(
        `categories/${this.selectKeys[2]}/attributes/${id}`
      )

      //  console.log(res);

      //  3.根据返回的状态码 判断是否删除参数成功
      if (val.meta.status != 200) return this.$message.error('删除参数失败')

      // 4.重新渲染数据
      this.getParamsList()

      // 5.关闭对话框
      this.addAttributeVisible = false

      // 6.提示删除成功
      this.$message.success('删除参数成功')
    },

    // TODO:  在input输入完内容后清空input内容并关闭
    async handleInputConfirm(row) {
      //  1.先进行非空校验 (newTag需要输入值)
      if (!row.inputValue.trim().length) {
        // 将input里面的值清空
        row.inputValue = ''
        // 返回 newTag按钮
        row.inputVisible = false
        return
      }

      // 2.添加 newTag (放在代码最前面,防止被清空添加了一个空字符串)
      row.attr_vals.push(row.inputValue.trim())

      // FIXME: 3.发送请求 将修改的Tag标签同步到数据库
      this.saveParam(row)

      // 追加后清空input
      row.inputValue = ''
      // 返回 newTag按钮
      row.inputVisible = false
    },

    // TODO: 点击显示输入框
    showInput(row) {
      row.inputVisible = true

      //   等待dom元素重新更新到页面上,才会触发的函数(显示添加的newTag标签)
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // FIXME: 发送新增 Tag标签的方法
    async saveParam(row) {
      // 分类id
      // console.log(this.selectKeys[2]);

      // 参数id
      // console.log(row.attr_id);

      //  新的属性名
      // console.log(row.attr_name);

      //  attr_sel 面板激活状态
      //console.log(this.activeName);

      //   attr_vals  需要将参数数组转为字符串
      //console.log(row.attr_vals.join(' '));

      //   发送请求
      const { data: res } = await this.$http.put(
        `categories/${this.selectKeys[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' '),
        }
      )

      console.log(res)

      // 根据返回的状态码 判断是否添加参数成功
      if (res.meta.status != 200) return this.$message.error('添加参数失败')

      // 这里不用重新渲染页面,不然会折叠起来
      // 提示成功
      this.$message.success('添加参数成功')
    },

    // TODO 删除 Tag标签  (根据索引来截取数组)
    delTag(i, row) {
      //  截取数组
      row.attr_vals.splice(i, 1)

      // 调用方法,重新渲染
      this.saveParam(row)
    },

    //
  },

  // FIXME 计算属性监听 级联选择框是否选择了三级分类,返回的长度为3
  computed: {
    // 当返回的长度不是3 禁用下面的 tabs选项卡
    isDisabled() {
      return this.selectKeys.length == 3 ? false : true
    },

    // 根据激活面板的不同返回不同的字符 (添加参数还是添加静态属性)
    text() {
      return this.activeName == 'many' ? '动态参数' : '静态属性'
    },
  },

  // FIXME 钩子函数
  created() {
    // 调用方法获取参数列表
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin-top: 10px;
  width: 400px;
  margin-bottom: 20px;
}
.input-new-tag {
  width: 150px !important;
}

.button-new-tag {
  background-color: #48d1cc;
  color: #fff;
}

.el-tag {
  margin-left: 10px;
}
</style>

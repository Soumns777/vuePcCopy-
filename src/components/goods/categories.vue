<template>
  <div>
    <!-- .TODO:  面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当路径为 '/  会自动跳转到 welcome页面-->
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- .TODO: 卡片区域 -->
    <el-card class="box-card">
      <!-- .FIXME: 按钮 -->
      <el-button type="info" @click="showAddCateData">添加分类</el-button>

      <!-- .FIXME: 表格区域 -->
      <!-- data 绑定的是商品数据对象 -->
      <!-- columns 绑定的是列的配置对象 -->
      <!-- selection-type 是否为多选类型表格,去掉复选框 -->
      <!-- show-index 显示索引列 -->
      <!-- expand-type 展开行 -->
      <!-- is-fold 默认 展开数据 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        stripe
        border
        show-index
        :expand-type="false"
        show-header
        :is-fold="true"
        class="tree_table"
      >
        <!--TODO 是否有效列  根据是否删除 (cat_deleted)  显示图标 -->
        <!-- 不能用 v-slot获取数据,版本比较旧-->
        <template slot="deleted" slot-scope="scope">
          <!-- {{scope.row.cat_deleted}} -->

          <span
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
          ></span>
          <span class="el-icon-error" v-else></span>
        </template>

        <!--TODO  排序列 -->
        <template slot="level" slot-scope="scope">
          <!-- {{scope.row.cat_level}} -->

          <!-- 根据不同等级 cat_level 显示不同的Tag标签 -->
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="danger" v-else>三级</el-tag>
        </template>

        <!-- TODO 操作列 -->
        <template slot="operate" slot-scope="scope">
          ID:{{ scope.row.cat_id }}

          <!-- 两个按钮 -->
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="editGoods(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delGoods(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- .FIXME: 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>

      <!-- .FIXME: 添加商品分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addGoodsVisible"
        width="50%"
        @close="addGoodsClose"
      >
        <!-- TODO 表单区域 -->
        <!-- 先给 Form 属性 绑定一个 addGoodsData 对象,再给 input表单元素 双向绑定  addGoodsData对象里面的属性 -->
        <!-- 需要添加 prop,不然验证规则没用 -->
        <el-form
          :model="addGoodsList"
          :rules="addGoodsRules"
          ref="addGoodsRef"
          abel-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addGoodsList.cat_name"></el-input>
          </el-form-item>

          <el-form-item label="父级分类">
            <!-- TODO 级联选择器 -->
            <!-- value选中项绑定值  selectValue -->
            <!-- options 数据源 -->
            <!-- cascaderProps 级联选择器的配置项-->
            <!-- handleChange 选中节点发生变化时触发 -->

            <el-cascader
              v-model="selectValue"
              :options="addCateList"
              :props="cascaderProps"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsVisible = false" type="warning"
            >取 消</el-button
          >
          <el-button type="primary" @click="addGoodsSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- .FIXME: 编辑商品分类的对话框 -->
      <el-dialog
        title="编辑商品分类"
        :visible.sync="editGoodsVisible"
        width="50%"
        @close="editGoodsClose"
      >
        <!-- TODO 表单区域 -->
        <!-- 先给 Form 属性 绑定一个 addGoodsData 对象,再给 input表单元素 双向绑定  addGoodsData对象里面的属性 -->
        <!-- 需要添加 prop,不然验证规则没用 -->
        <el-form
          :model="editGoodsList"
          :rules="editGoodsRules"
          ref="editGoodsRef"
          abel-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editGoodsList.cat_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsVisible = false" type="warning"
            >取 消</el-button
          >
          <el-button type="primary" @click="postGoods">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // TODO 查询信息
      queryInfo: {
        // 默认获取所有级别的分类
        type: 3,

        // 当前页面的值
        pagenum: 1,

        // 每页显示多少条数据
        pagesize: 4,
      },

      // TODO 商品列表数据
      cateList: [],

      // TODO 总数据条数 (做分页用)
      total: 0,

      // TODO 列的配置对象
      columns: [
        {
          // 标题
          label: '分类名称',

          // 需要显示商品列表里的哪一项数据
          prop: 'cat_name',
        },

        // 第一列  template标签列 deleted,名字要和tamplate标签里面 slot 绑定的名称一样

        {
          // 标题
          label: '是否有效',

          // 需要显示商品列表里的哪一项数据
          prop: 'cat_deleted',

          // 将指定列设置为自定义模板列
          type: 'template',

          // 模板列的名称
          template: 'deleted',
        },

        // 第二列  template标签列 level

        {
          // 标题
          label: '排序',

          // 需要显示商品列表里的哪一项数据
          prop: 'cat_level',

          // 将指定列设置为自定义模板列
          type: 'template',

          // 模板列的名称
          template: 'level',
        },

        {
          // 标题
          label: '操作',

          // 需要显示

          // 将指定列设置为自定义模板列
          type: 'template',

          // 模板列的名称
          template: 'operate',
        },
      ],

      // TODO  控制添加商品分类的对话框打开状态 (默认为关闭状态)
      addGoodsVisible: false,

      // TODO 控制编辑商品分类的对话框打开状态 (默认为关闭状态)
      editGoodsVisible: false,

      // TODO 添加商品分类需要发送请求的数据
      addGoodsList: {
        cat_pid: 0,
        cat_level: 0,
        cat_name: '',
      },

      // TODO  编辑商品分类需要的数据
      editGoodsList: {
        cat_name: '',
      },

      // TODO 添加商品对话框分类表单验证规则
      addGoodsRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },

      // TODO 编辑商品分类的标签验证规则
      editGoodsRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '长度在 1 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },

      // TODO 级联选择器选中的数据
      selectValue: '',

      // TODO 二级商品分类数据
      addCateList: [],

      // TODO 级联选择框的配置项
      cascaderProps: {
        //  触发状态
        expandTrigger: 'hover',

        // 父子关联节点
        children: 'children',

        // 提交给后台的 id (用于后面获取id值)
        value: 'cat_id',

        // 给用户看到的数据
        label: 'cat_name',

        // 是否严格遵守父子节点不互相关联
        // checkStrictly:true,
      },

      //
    }
  },

  //.FIXME: 方法
  methods: {
    // TODO 获取所有的商品信息数据
    async getCateList() {
      // 1.发送请求获取数据
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      //   console.log(res);

      // 2.根据返回的状态码 判断是否将数据赋值
      if (res.meta.status != 200) return this.$message.error('获取商品分类失败')
      // this.$message.success('获取商品分类数据成功')

      // 3.将数据赋值
      this.cateList = res.data.result
      this.total = res.data.total
    },

    // TODO pageSize 改变时会触发
    handleSizeChange(newVal) {
      //   console.log(newVal);

      //   赋值给最新的 pageSize
      this.queryInfo.pagesize = newVal

      // 重新渲染数据
      this.getCateList()
    },

    // TODO currentPage 改变时会触发
    handleCurrentChange(newVal) {
      //   console.log(newVal);

      // 赋值给最新的 pagenum
      this.queryInfo.pagenum = newVal

      // 重新渲染页面
      this.getCateList()
    },

    // TODO  获取所有的二级商品分类
    async showAddCateData() {
      // 1.获取所有的二级商品分类
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      //   console.log(res);

      // 2.根据返回的状态码判断是否获取 所有的二级商品分类成功
      if (res.meta.status != 200)
        return this.$message.error('获取二姐商品分类失败')

      // 3.手动赋值
      this.addCateList = res.data

      // 4.打开对话框
      this.addGoodsVisible = true
    },

    // TODO 当选中节点变化时触发,返回选中节点的值
    handleChange() {
      // 级联选择框绑定的值 (选中id的数组)
      //   console.log(this.selectValue);

      //  先判断 有没有选择父级分类,如果没有选就是一级分类
      if (this.selectValue == 0) {
        // 一级分类
        this.selectValue.cat_level = 0
        // 父级id
        this.pid = 0
      } else {
        // 等级和选中id的数组长度相等 0代表一级
        this.addGoodsList.cat_level = this.selectValue.length

        // 分类父id取选中id的数组最后一项
        this.addGoodsList.cat_pid =
          this.selectValue[this.selectValue.length - 1]
      }
    },

    // TODO  添加分类 数据同步到数据库
    addGoodsSure() {
      // 1.先进行预校验
      this.$refs.addGoodsRef.validate(async (boo) => {
        if (!boo) return this.$message.error('请输入要添加的分类名称')

        // 发送请求
        const { data: res } = await this.$http.post(
          'categories',
          this.addGoodsList
        )

        console.log(res)

        // 根据返回的状态码 判断是否重新渲染数据
        if (res.meta.status != 201) return this.$message.error('添加分类失败')

        // 提示成功
        this.$message.success('添加分类成功')

        // 打开对话框
        this.addGoodsVisible = false

        // 重新渲染页面
        this.getCateList()
      })
    },

    // TODO 添加分类对话框关闭 重置数据
    addGoodsClose() {
      // 重置表单
      this.$refs.addGoodsRef.resetFields()

      // 重新级联选择器的数组
      this.selectValue = []

      // 为了防止用户直接添加一级分类,将上一次添加的分类数据清空
      this.addGoodsList.cat_pid = 0
      this.addGoodsList.cat_level = 0
    },

    // TODO  编辑分类对话框关闭 重置数据
    editGoodsClose() {
      // 重置表单
      this.$refs.editGoodsRef.resetFields()
    },

    // TODO 编辑分类  获取数据
    async editGoods(id) {
      // console.log(id);

      // 1.发送请求
      const { data: res } = await this.$http.get(`categories/${id}`)
      //console.log(res);

      // 2.根据返回的状态码 判断是否将数据赋值给编辑分类表单
      if (res.meta.status != 200)
        return this.$message.error('获取当前分类数据失败')

      this.editGoodsList = res.data

      //   console.log(this.editGoodsList);

      // 3.打开编辑分类对话框
      this.editGoodsVisible = true
    },

    // TODO  编辑分类 将数据同步到数据库
    postGoods() {
      // 分类id
      // console.log(this.editGoodsList.cat_id);

      // 分类名称
      // console.log(this.editGoodsList.cat_name);

      // 1.先进行预校验
      this.$refs.editGoodsRef.validate(async (boo) => {
        //   console.log(boo);

        if (!boo) return this.$message.error('预校验失败')

        // 2.发送请求 将修改后的数据同步到数据库
        const { data: res } = await this.$http.put(
          `categories/${this.editGoodsList.cat_id}`,
          {
            cat_name: this.editGoodsList.cat_name,
          }
        )

        //console.log(res);

        //   3.根据返回的状态码 判断是否重新渲染页面
        if (res.meta.status != 200) return this.$message.error('编辑分类失败')

        // 4.重新渲染页面、关闭对话框、提示成功
        this.getCateList()
        this.editGoodsVisible = false
        this.$message.success('编辑分类成功')
      })
    },

    // TODO 删除分类  根据分类id输出数据
    async delGoods(id) {
      //    console.log(id);

      // 1.先弹出MessageBox提示框
      const val = await this.$confirm('确认删除此分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      //   console.log(val);
      // 2.根据返回的字符串 判断是否进行删除操作
      if (val != 'confirm') return this.$message.info('取消删除成功')

      // 3.根据分类id 发送请求进行删除操作
      const { data: res } = await this.$http.delete(`categories/${id}`)
      console.log(res)

      //   4.根据返回的状态码 判断是否重新渲染页面
      if (res.meta.status != 200) return this.$message.error('删除分类失败')

      // 5.重新渲染页面、关闭对话框、提示成功
      this.getCateList()
      this.editGoodsVisible = false
      this.$message.success('删除分类成功')
    },
  },

  //.FIXME: 钩子函数
  created() {
    // 调用方法获取商品数据列表
    this.getCateList()
  },
}
</script>

<style lang="less" scope>
.el-icon-success {
  color: springgreen;
}

.el-icon-error {
  color: red;
}

.tree_table {
  margin: 20px;
}

.el-cascader {
  width: 100%;
}
</style>

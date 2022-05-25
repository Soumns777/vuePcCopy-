<template>
  <div>
    <!--.TODO: 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当路径为 '/  会自动跳转到 welcome页面-->
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品展示</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- .TODO: 卡片区域 -->
    <el-card class="box-card">
      <!-- elert提示信息 -->
      <el-alert
        title="添加商品信息"
        show-icon
        type="info"
        :closable="false"
        center
      >
      </el-alert>

      <!-- Step步骤条 -->
      <!-- 这里属性绑定的 需要一个数字型的 ,需要转为数字型-->
      <el-steps
        :space="200"
        :active="+activeName"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"> </el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs标签页 -->
      <!-- 这里双向绑定的 需要是一个 string型的 -->
      <!-- 设置 name值对应响应的 step标签,激活的name会自动绑定到 v-model 上 -->

      <!-- 将一个表单form包裹着tabs组件 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="(tabPosition = 'left')"
          v-model="activeName"
          @tab-click="handleChange"
          :before-leave="beforeLeave"
        >
          <!-- TODO 表单 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- prop 接收验证规则 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>

            <!-- 最后会一起提交作为添加商品的参数 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 只能选择三级分类 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="cascaderChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- TODO 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- v-for 来遍历 manyData-->
            <!-- 属性绑定 数据 ==> 视图, 显示不同的 attr_names -->
            <el-form-item
              v-for="(item, i) in manyData"
              :key="i"
              :label="item.attr_name"
            >
              <!-- 双向绑定  attr_vals 数组,只要点击复选框 attr_vals 数组也会同步变化 -->
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 遍历 动态参数 -->
                <el-checkbox
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                  :label="item1"
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- TODO 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- v-for 来遍历 onlyData-->
            <!-- 属性绑定 数据 ==> 视图, 显示不同的 attr_name -->
            <el-form-item
              v-for="item in onlyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 双向绑定  attr_vals 数组,只要点击复选框 attr_vals 数组也会同步变化 -->
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- TODO 添加照片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 修改请求地址 -->
            <!-- 添加请求头 token 才能发送请求 -->

            <!-- on-preview 绑定的是点击文件列表中已上传的文件时的钩子函数 -->
            <!-- on-remove 绑定的是文件列表移除文件时的钩子函数 -->
            <!-- on-success 绑定的是文件上传成功时的钩子函数 -->
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <!-- TODO 富文本编辑器 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本 双向绑定了 addForm 里的  goods_introduce属性-->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>

            <!-- 添加按钮 -->
            <el-button type="primary" class="addIt" @click="postFormData"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- .FIXME: 控制预览图片的对话框 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewUrl" width="100%" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // TODO 获取商品列表的查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6,
      },

      // TODO 步骤条绑定的数据 (Step和tabs同时绑定的数据)
      activeName: '0',

      // TODO 添加商品表单项对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,

        // 级联默认选中项
        goods_cat: [],

        // FIXME  保存上传的图片路径 数组
        pics: [],

        // FIXME 商品描述信息 (富文本)
        goods_introduce: '',

        //.FIXME: 用来存放添加商品的 attrs 字段
        attrs: [],
      },

      // TODO 添加商品表单项验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },

      // TODO 商品分类数据列表
      cateList: [],

      // TODO  级联配置项  (配置项的内容要有加引号)
      cascaderProps: {
        // 次联菜单的打开方式
        expandTrigger: 'hover',

        // 使得只能选中第三级分类
        // checkStrictly:false,

        // 选中项  绑定数据为 cat_id
        value: 'cat_id',

        // 选中项  显示内容
        label: 'cat_name',

        // 父子节点之间联系的节点
        children: 'children',
      },

      // TODO 动态参数列表数据
      manyData: [],

      // TODO 静态属性列表数据
      onlyData: [],

      // TODO 配置请求头信息  如果不配置请求头信息 会返回 无效   token
      headerObj: {
        // Authorization 字段不能更改
        Authorization: sessionStorage.getItem('token'),
      },

      // TODO 控制预览图片对话框的布尔值
      previewVisible: false,

      // TODO 预览图片url
      previewUrl: '',

      //
    }
  },

  // 方法
  methods: {
    // TODO  封装方法获取动态参数或静态属性并赋值 (会返回一个 promise对象)
    async getIt(val) {
      // 发送请求获取数据
      const { data: res } = await this.$http.get(
        `categories/${this.addForm.goods_cat[2]}/attributes`,
        {
          params: { sel: 'val' },
        }
      )
      // console.log(res);

      // 根据返回的状态码 判断是否进行数据赋值
      if (res.meta.status != 200) return this.$message.error('获取动态参数失败')

      return res.data
    },

    // .TODO: tab被选中时触发(点击tabs标签时)  切换tabs时发送请求获取动态参数和静态属性
    async handleChange() {
      // console.log(this.activeName);

      // 1.根据 对应的面板的 name值 (绑定的activeName) 判断是添加参数还是属性

      if (this.activeName === '1') {
        // 赋值
        // this.manyData = await  this.getIt('many')

        // 添加参数面板
        // 发送请求获取数据
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'many' },
          }
        )
        //console.log(res);

        // 根据返回的状态码 判断是否进行数据赋值
        if (res.meta.status != 200)
          return this.$message.error('获取动态参数失败')

        // 数据赋值
        this.manyData = res.data
        //console.log(this.manyData);

        // .TODO: 将数据字符串转为数组
        this.manyData.forEach((item) => {
          //  split 不会修改 原数组
          item.attr_vals = item.attr_vals.split(' ')
        })
      } else if (this.activeName === '2') {
        // 赋值
        // this.onlyData =  await this.getIt(only)

        // 添加静态属性
        // 发送请求获取数据
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'only' },
          }
        )

        // 根据返回的状态码 判断是否进行数据赋值
        if (res.meta.status != 200)
          return this.$message.error('获取静态属性失败')

        // 数据赋值
        this.onlyData = res.data
        // console.log(this.onlyData);

        // .TODO: 将数据字符串转为数组  不用转为数组
        //  this.onlyData.forEach(item=>{
        //       //  split 不会修改 原数组
        //  item.attr_vals =  item.attr_vals.length? item.attr_vals.split(' '):[]
        //  })
      }
    },

    // .TODO: 获取级联选择器的数据
    async getCateList() {
      // 1.发送请求
      const { data: res } = await this.$http.get('categories')

      // 2.根据返回的状态码 判断是否获取商品分类列表成功
      if (res.meta.status != 200)
        return this.$message.error('获取商品列表数据失败')

      // 3.赋值 (将返回的数据 赋值给保存商品列表数据的数组)
      this.cateList = res.data
    },

    //.TODO: 级联选中项变化 触发函数
    cascaderChange() {
      // 级联选择框默认选中项 (会返回一个分类id组成的数组)
      // console.log(this.addForm.goods_cat);

      // 1.只能选中 级联选择器的第三项 (返回的 good_cat 的数组长度只能为3,不是3就返回空)
      if (this.addForm.goods_cat.length != 3) this.addForm.goods_cat = []
    },

    //.TODO: tabs 跳转
    beforeLeave(newVal, oldVal) {
      // newVal 表示即将要跳转的tab页
      // oldVal 表示从哪里跳转的旧的tab页
      //console.log(newVal);
      // console.log(oldVal);

      // 1.如果级联没有选中第三项进行跳转时 会提示用户选中商品分类
      if (
        newVal === '1' &&
        oldVal === '0' &&
        this.addForm.goods_cat.length != 3
      ) {
        // 提示选中 商品分类
        this.$message.error('请选中商品分类')

        // 阻止默认行为
        return false
      }
    },

    //.FIXME: 上传图片(Upload区域)

    //.TODO:  预览图片 点击文件列表中已上传的文件时的钩子函数 (点击才触发)
    handlePreview(file) {
      //  console.log(file);

      // 图片的完整路径
      //console.log(file.response.data.url);

      this.previewUrl = file.response.data.url
      this.previewVisible = true
    },

    //.TODO:  移除图片 文件列表移除文件时的钩子函数
    handleRemove(file) {
      //  将对应删除图片的临时路径获取到
      //  console.log(file+'-------');

      //  1.根据遍历的每一项的路径获取索引 并根据索引删除对应项
      const i = this.addForm.pics.findIndex(
        (item) => item.pic === file.response.data.tem_path
      )

      console.log(i)

      // 2.根据索引截取数组 (根据索引)
      this.addForm.pics.splice(i, 1)
    },

    //.TODO: 文件上传成功时的钩子函数 (上传成功触发)
    handleSuccess(response) {
      // response 参数只是响应对象
      //  console.log(response);

      //  file包含图片的详细信息 file中包含response
      // console.log(file);

      // 1.将上传图片成功时返回的对象里面的 图片地址保存到定义的保存图片地址的数组里
      const obj = {
        pic: response.data.tmp_path,
      }

      // console.log(obj);

      // 将新上传的  图片地址保存到数组中
      this.addForm.pics.push(obj)

      // console.log(this.addForm.pics);
    },

    //.FIXME:  添加新的商品
    async postFormData() {
      // console.log(666);

      // TODO: 1.获取发送请求 需要的参数

      //.FIXME: 手动获取需要携带的参数 attrs (动态参数和静态属性)
      //  需要将 manyData 和 onlyData 中的 attr_id 和 attr_value 属性定义在一个对象并 push到 addForm 中的 attrs 数组中

      // FIXME 先将 manyData中的 attr_id 和 attr_values 两个字段放入一个对象中并 push 进 attrs这个数组

      // 需要点击 参数的tabs 面板发送请求获取数据
      this.manyData.forEach((item) => {
        // 定义一个对象保存 attr_id 和 attr_value 两个字段
        // attr_value 当前的参数 attr_vals,由于已经转为了数组所以需要重新转为字符串
        const obj = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' '),
        }

        // 放进 attrs 数组中
        this.addForm.attrs.push(obj)
      })

      //  console.log(this.addForm.attrs);

      // FIXME 再将 onlyData中的 attr_id 和 attr_value 两个字段放入一个对象中并 push 进 attrs这个数组
      // 需要点击 属性的tabs面板 获取请求获取数据
      this.onlyData.forEach((item) => {
        // 先定义一个对象 保存 onlyData 中的 attr_id 和 attr_value 两个字段
        // 这里的 attr_vals 由于之前没有转成数组,所以不需要再重新转回字符串
        const obj = {
          attr_id: item.attr_id,
          // attr_value:item.attr_vals.join(' ')
          attr_value: item.attr_vals,
        }

        // 将定义的对象 push 进 attrs数组
        this.addForm.attrs.push(obj)
      })

      //  FIXME 最后的 attrs数组,已经涵盖了所有的信息
      //  console.log(this.addForm.attrs);

      // TODO: 2.需要深拷贝 attrs 这个数组,并将 里面的 goods_cat 转为字符串进行发送请求
      // 而 goods_cat 需要的数据是一个 字符串,而级联选择器的默认选中项需要的是一个 数组,所以造成冲突,需要重新深拷贝一个 addForm

      // 深拷贝出一个 newForm
      // var newForm = JSON.parse(JSON.stringify(this.addForm))

      // TODO:  使用 lodash 深拷贝
      var newForm = _.cloneDeep(this.addForm)

      // 将 newForm 中的 goods_cat 字段转为字符串再发送请求
      // join 原数组不变,需要重新赋值
      newForm.goods_cat = newForm.goods_cat.join(',')

      // TODO 3.发送请求 添加商品
      const { data: res } = await this.$http.post(`goods`, newForm)
      // console.log(res);

      // TODO 4.根据返回的状态码 判断是否添加成功
      if (res.meta.status != 201) return this.$message.error('添加商品失败')

      // TODO 5.提示成功、编程式导航跳转到 goods页面
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
    },

    //  方法截止
  },

  // 钩子函数
  created() {
    //  获取商品列表数据
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px;
}

.el-tab-pane {
  color: rgb(165, 42, 118);
}

.el-cascader {
  width: 400px;
}

.quill-editor {
  height: 240px;
}

.ql-container {
  height: 200px !important;
}

.addIt {
  margin: 50px 0;
}
</style>

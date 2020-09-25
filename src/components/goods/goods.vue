<template>
  <div>
    <!--.TODO: 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当路径为 '/  会自动跳转到 welcome页面-->
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品展示</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- .TODO: 卡片区域 -->
    <el-card class="box-card">
      <!-- gutter 间距 -->
      <el-row :gutter="15">
        <!-- FIXME 模糊匹配 双向绑定 queryInfo.query,然后点击按搜索按钮发送请求  获取商品列表-->
        <!-- clearable 删除按钮  clear事件清除信息  重新获取商品列表 -->
        <el-col :span="8"
          ><el-input v-model="queryInfo.query" clearable @clear="getGoodsList"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button></el-input
        ></el-col>

        <!-- 利用编程式导航  点击添加用户跳转到 goods下的 add组件 -->
        <el-col :span="5">
          <el-button type="success" @click="$router.push('/goods/add')"
            >添加商品</el-button
          ></el-col
        >
      </el-row>

      <!-- .FIXME: 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>

        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column label="创建时间">
          <!-- 用作用域插槽和时间过滤器渲染时间  管道符 | 链接过滤器 -->
          <template v-slot="scoped">
            {{ scoped.row.add_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- .TODO: 用作用域插槽渲染按钮  获取id,进行操作 -->
          <template v-slot="scoped">
            商品ID: <br />
            {{ scoped.row.goods_id }}

            <el-button
              type="primary"
              class="el-icon-setting"
              size="mini"
              @click="editGoodsVisible = true"
              >编辑</el-button
            >

            <el-button
              type="danger"
              class="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scoped.row.goods_id)"
              >删除</el-button
            >
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
        background
      >
      </el-pagination>

      <!-- .TODO:  编辑商品的对话框-->
      <!-- 设置 visible属性,接收布尔值,当为 true时显示 Dialog   -->
      <!--   close 	Dialog 关闭的回调函数 -->
      <el-dialog
        title="编辑商品"
        :visible.sync="editGoodsVisible"
        width="50%"
        @close="editGoodsClose"
      >
        <!-- 表单内容  model 属性绑定一个表单对象 addForm-->
        <!-- 属性绑定校验规则  :rules='addFormRules'-->
        <!-- 添加 ref属性,这样在 对话框中就可以获取 el-form中的方法 -->
        <el-form
          :model="editGoodsForm"
          label-width="80px"
          :rules="editGoodsRules"
          ref="editGoodsRef"
        >
          <!-- 分别双向绑定这个表单对象里面的属性 -->
          <!-- prop 接收规则里面的属性-->
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoodsForm.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editGoodsForm.goods_price"></el-input>
          </el-form-item>

          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editGoodsForm.goods_weight"></el-input>
          </el-form-item>

          <el-form-item label="创建时间" prop="add_time">
            <el-input v-model="editGoodsForm.add_time"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <!-- 点击取消退出对话框 -->
          <!-- 点击确认 进行  预校验 ==> 发送请求 ==> 重新渲染数据 ==> 清空表单 -->
          <el-button type="danger" @click="editGoodsVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="editGoodsVisible = false"
            >确 定</el-button
          >
        </span>
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
        query: "",
        pagenum: 1,
        pagesize: 4
      },

      // TODO 保存商品列表的数组
      goodsList: [],

      // TODO 商品总数 (用来做分页器)
      total: 0,

      // TODO 控制编辑商品对话框的打开状态
      editGoodsVisible: false,

      // TODO 添加商品的表单的验证规则
      editGoodsRules: {
        goods_name: [
          { required: true, message: "请好好输入", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15个字符", trigger: "blur" }
        ],

        goods_price: [
          { required: true, message: "请好好输入", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15个字符", trigger: "blur" }
        ],

        goods_weight: [
          { required: true, message: "请好好输入", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15个字符", trigger: "blur" }
        ],

        add_time: [
          { required: true, message: "请好好输入", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15个字符", trigger: "blur" }
        ]
      },

      // TODO 用来编辑商品的表单数据
      editGoodsForm: {
        goods_name: "",
        goods_weight: "",
        goods_price: "",
        add_time: ""
      }

      // TODO

      //
    };
  },

  // 方法
  methods: {
    // FIXME  获取所有商品列表数据
    async getGoodsList() {
      // 1.发送请求  获取商品列表数据
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      //console.log(res);

      // 2.根据返回的状态码 判断是否进行赋值
      if (res.meta.status != 200)
        return this.$message.error("获取商品列表数据失败");
      //    this.$message.success('获取商品列表数据成功');

      // 3.赋值给保存商品列表的数组
      this.goodsList = res.data.goods;

      // 将商品总数赋值
      this.total = res.data.total;
    },

    // FIXME  修改每页显示多少条 pagesize 发生变化触发的函数,返回每条页数
    handleSizeChange(newVal) {
      // 重新赋值
      this.queryInfo.pagesize = newVal;

      // 重新发送请求 渲染页面
      this.getGoodsList();
    },

    // FIXME currentPage 改变时会触发发,返回当前页
    handleCurrentChange(newVal) {
      // 重新赋值
      this.queryInfo.pagenum = newVal;

      // 重新发送请求 渲染页面
      this.getGoodsList();
    },

    // FIXME 关闭添加商品对话框触发  清空表单
    editGoodsClose() {
      this.$refs.editGoodsRef.resetFields();
    },

    // FIXME 根据商品id删除对应的商品
    async removeGoodsById(id) {
      //   console.log(id);

      // 1.点击删除 提示消息框提示是否删除
      const val = await this.$confirm("确认删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      console.log(val);

      // 2.根据返回的字符串 判断是否需要进行删除操作
      if (val != "confirm") return this.$message.info("取消删除成功");

      // 3.发送请求 删除对应商品id的商品
      const { data: res } = await this.$http.delete(`goods/${id}`);
      console.log(res);

      // 4.根据返回的状态码 判断是否删除商品成功
      if (res.meta.status != 200) return this.$message.error("删除商品失败");

      // 5.重新渲染页面、提示成功
      this.getGoodsList();
      this.$message.success("删除商品成功");
    }

    //
  },

  // 钩子函数
  created() {
    // 调用方法 获取所有商品列表数据
    this.getGoodsList();
  }
};
</script>

<style lang="less" scoped></style>

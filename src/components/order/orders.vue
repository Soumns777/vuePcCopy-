<template>
  <div>
    <!--.TODO: 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当路径为 '/  会自动跳转到 welcome页面-->
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- .TODO: 卡片区域 -->
    <el-card class="box-card">
      <!-- .FIXME: 搜索框区域 -->
      <!-- gutter 间距 -->
      <el-row :gutter="15">
        <!--双向绑定 queryInfo.query,然后点击按搜索按钮发送请求 -->
        <!-- clearable 删除按钮  clear事件清除信息 -->
        <el-col :span="8"
          ><el-input clearable v-model="queryInfo.query" @clear="getOrdersList"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button></el-input
        ></el-col>
        <el-col :span="5"> </el-col>
      </el-row>

      <!-- .FIXME: 表格区域 -->
      <el-table :data="orderList" stripe border style="width: 100%">
        <!-- 索引 -->
        <el-table-column type="index" label="#"> </el-table-column>

        <!-- 订单编号 -->
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>

        <!-- 订单价格 -->
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>

        <!-- 是否付款 -->
        <el-table-column label="是否付款">
          <!-- 利用作用域插槽来渲染按钮 -->
          <template v-slot="scoped">
            <!-- {{scoped.row.pay_status}} -->
            <el-button
              type="danger"
              size="mini"
              v-if="scoped.row.pay_status == 0"
              >未付款</el-button
            >
            <el-button type="success" size="mini" v-else>已付款</el-button>
          </template>
        </el-table-column>

        <!-- 是否发货 -->
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>

        <!-- 下单时间 -->
        <el-table-column label="下单时间">
          <!-- 利用作用域插槽  加载时间过滤器-->
          <template v-slot="scoped">
            {{ scoped.row.create_time | dateFormate('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作">
          <!-- 利用作用域插槽 渲染按钮 -->
          <template v-slot="scoped">
            {{ scoped.row.order_id }}

            <el-button
              type="primary"
              size="mini"
              class="el-icon-setting"
              @click="editOrdersgVisible = true"
              >编辑</el-button
            >

            <el-button
              type="success"
              size="mini"
              class="el-icon-location"
              @click="showInfo"
              >定位</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- .FIXME: 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>

      <!-- .FIXME: 编辑对话框 -->
      <el-dialog
        title="编辑订单"
        :visible.sync="editOrdersgVisible"
        width="50%"
        @close="editOrdersClose"
      >
        <el-form ref="editOrdersRef" :model="editForm" :rules="editOrderRules">
          <!-- 需要加 prop 属性 不然规则不生效 -->
          <el-form-item label="请输入省市区县" prop="address">
            <!-- 级联 -->
            <el-cascader
              v-model="selectKeys"
              :options="cityData"
              :props="cascaderProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="请输入详细地址" prop="addressInfo">
            <el-input v-model="editForm.addressInfo"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editOrdersgVisible = false" type="warning"
            >取 消</el-button
          >
          <el-button type="primary" @click="editOrdersgVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- .FIXME: 查看物流信息对话框 -->
      <el-dialog title="物流信息" :visible.sync="lookVisible" width="50%">
        <!-- 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(item, i) in progress"
            :key="i"
            icon="el-icon-more"
            color="skyblue"
            :timestamp="item.ftime"
          >
            {{ item.context }}
          </el-timeline-item>
        </el-timeline>

        <span slot="footer" class="dialog-footer">
          <el-button @click="lookVisible = false" type="warning"
            >取 消</el-button
          >
          <el-button type="primary" @click="lookVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// TODO 导入省市区县js数据
import cityData from './citydata'

export default {
  data() {
    return {
      // FIXME 获取订单列表数据的查询参数
      queryInfo: {
        query: '',
        //  当前页
        pagenum: 1,
        //  显示订单条数
        pagesize: 6,
      },

      // FIXME 订单列表数据
      orderList: [],

      // FIXME  用来做分页 不能写空的字符串
      total: 0,

      // FIXME 控制编辑对话框的打开状态
      editOrdersgVisible: false,

      // FIXME 编辑对话框里面的表单数据对象
      editForm: {
        address: '',
        addressInfo: '',
      },

      // FIXME 编辑对话框里面的表单验证规则
      editOrderRules: {
        address: [
          { required: true, message: '请输入省市区县', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],

        addressInfo: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },

      // FIXME 级联默认选中项
      selectKeys: [],

      // FIXME 级联配置项
      cascaderProps: {
        // 次级菜单默认展开方式
        expandTrigger: 'hover',

        // 绑定的数据源里的属性 选中返回的值是这个value
        value: 'value',

        //  父子之间联系的节点
        children: 'children',

        //  要显示的内容
        label: 'label',
      },

      // TODO 数据源 cityData:cityData
      cityData,

      // TODO 控制查看物流信息的对话框打开状态
      lookVisible: false,

      // TODO 存储物流信息的数据
      progress: [],
    }
  },

  methods: {
    // TODO 获取订单列表
    async getOrdersList() {
      //  1.发送请求获取数据
      const { data: res } = await this.$http.get(`orders`, {
        params: this.queryInfo,
      })
      //console.log(res);

      // 2.根据返回的状态码 判断是否获取成功
      if (res.meta.status != 200)
        return this.$message.error('获取订单列表数据失败')

      //  3.提示成功,数据赋值
      //this.$message.success('获取订单列表成功');
      this.orderList = res.data.goods

      this.total = res.data.total

      //   console.log(this.orderList);
    },

    // TODO 当 pagesize发生变化时 触发函数
    handleSizeChange(newVal) {
      //  赋值
      this.queryInfo.pagesize = newVal
      // 重新渲染数据
      this.getOrdersList()
    },

    // TODO 当pagenum 发生变化时 触发函数
    handleCurrentChange(newVal) {
      // 赋值
      this.queryInfo.pagenum = newVal
      // 重新渲染数据
      this.getOrdersList()
    },

    // TODO 监听编辑订单的对话框关闭事件 表单重置
    editOrdersClose() {
      this.$refs.editOrdersRef.resetFields()
    },

    // TODO 级联默认选中项 发生变化时触发函数
    handleChange() {
      console.log(this.selectKeys)
    },

    // TODO 发送请求获取物流信息
    async showInfo() {
      // 1.发送请求
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`)
      console.log(res)

      // 2.根据返回的状态码 判断是否获取成功
      if (res.meta.status != 200) return this.$message.error('获取物流信息失败')

      // 3.将返回的数据 重新赋值
      this.progress = res.data

      // 4.打开对话框
      this.lookVisible = true
    },
    //
  },

  //  vue3中已经抛弃了 created
  created() {
    // 调用自己的方法
    this.getOrdersList()
  },
}
</script>

<style lang="less" scoped></style>

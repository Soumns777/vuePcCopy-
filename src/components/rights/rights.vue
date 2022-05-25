<template>
  <div>
    <!-- .TODO:  面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当路径为 '/  会自动跳转到 welcome页面-->
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- .TODO: 卡片区域 -->
    <el-card class="box-card">
      <!-- .FIXME: 表格区域 -->
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index" width="50"></el-table-column>

        <el-table-column prop="authName" label="权限名称" width="400">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="400">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- 组件与组件之间只能放插槽来渲染 -->
          <!-- 通过 v-solt='scoped'获取插槽绑定的数据  -->
          <template v-slot="scoped">
            <!-- {{scoped.row.level}} -->

            <!-- 通过 v-if进行渲染 频繁切换用 v-show, 不频繁切换用 v-if -->
            <el-tag v-if="scoped.row.level == 0">小谷只会一奈奈</el-tag>
            <el-tag v-else-if="scoped.row.level == 1" type="warning"
              >正常人有手就行</el-tag
            >
            <el-tag v-else type="danger">徐鲍爷的背影都看不见</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    }
  },

  // 方法
  methods: {
    async getRightsList() {
      // 1.发送请求 获取所有的权限数据
      const { data: res } = await this.$http.get('/rights/list')
      //console.log(res);

      //   2.根据返回的状态码进行判断  是否把数据保存在 rightsList 里面
      if (res.meta.status != 200) return this.$message.error('获取权限列表失败')

      //  3. 将返回的权限列表数据返回给 rightsList
      this.rightsList = res.data
    },
  },

  // 钩子函数
  created() {
    //.FIXME: 调用自己写的方法获取权限数据
    this.getRightsList()
  },
}
</script>

<style lang="less" scope></style>

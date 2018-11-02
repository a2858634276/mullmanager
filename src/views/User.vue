<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input placeholder="请输入内容" clearable class="searchInput">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
      <el-table
        :data="list"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="160">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="120">
        </el-table-column>
        <el-table-column
          label="创建日期"
          width="160">
          <template slot-scope="scope">
            <!-- 使用全局过滤器格式化时间 -->
            {{scope.create_time | fmtDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="120">
          <!-- 单元格中的内容不是字符串，如果是其他组件时，需要在这些组件外包一层容器(template) -->
          <template slot-scope="scope">
            <!-- slot-scope用来传值的
            "scope"是随便命名的
            scope是list
            scope.row 就是list中的每个元素，这里是{}对象 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
            <el-button type="success" icon="el-icon-check" size="mini" plain circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    <!-- 分页 -->
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      loading: true
    }
  },
  created () {
    this.loadTabDate()
  },
  methods: {
    async loadTabDate () {
      // 给header添加token
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get('users?pagenum=1&pagesize=4')
      console.log(res)
      const {
        data: {users},
        meta: {msg, status}
      } = res.data
      if (status === 200) {
        this.list = users
        this.loading = false
        this.$message.success(msg)
      }
    }
  }
}
</script>

<style>
.box-card{
  height: 100%;
}
.searchArea{
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput{
  width: 350px;
}
</style>

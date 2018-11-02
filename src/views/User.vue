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
        <el-input placeholder="请输入内容" clearable class="searchInput"
        v-model="searchVal">
          <el-button slot="append" icon="el-icon-search"
          @click="checkUser()"></el-button>
        </el-input>
        <el-button type="success" plain
        @click="showAppUserDia()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAppuser">
      <el-form :model="formdata">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formdata.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="formdata.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formdata.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAppuser = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
      <el-form :model="formdata">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="formdata.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
        <el-button type="primary"
        @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配用户权限" :visible.sync="dialogFormVisibleSetrole">
      <el-form :model="formdata">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{username}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- el-select的v-model绑定的值如果和el-option的value值一样就显示当前el-option的label -->
          <el-select v-model="currRoleId">
            <!-- 请选择 -->
            <el-option disabled label="请选择" :value="-1">

            </el-option>
            <!-- 遍历数组 -->
            <el-option
              v-for="(item, index) in roles"
              :key="index"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSetrole = false">取 消</el-button>
        <el-button type="primary"
        @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>

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
            scope 变量得到的就是渲染表格时使用的数据
            scope.row 就是list中的每个元素，这里是{}对象 -->
            <el-switch
              @change="handleSwitchMgstate(scope.row)"
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
            <el-button type="primary" icon="el-icon-edit" size="mini" plain circle
            @click="showEditBox(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" plain circle
            @click="showDeleBox(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-check" size="mini" plain circle
            @click="showRoleBox(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      // 加载动画
      loading: true,
      // 分页相关的变量
      pagenum: 1,
      pagesize: 2,
      currentPage: 1,
      total: 0,
      // 要查寻的关键字
      searchVal: '',
      // 添加用户对话框的属性
      dialogFormVisibleAppuser: false,
      // 添加用户的表单数据
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 对话框中input的宽度
      formLabelWidth: '120px',
      // 编辑用户对话框属性
      dialogFormVisibleEdituser: false,
      // 分配用户权限对话框属性
      dialogFormVisibleSetrole: false,
      // 分配权限的用户名
      username: '',
      // 当前角色名
      currRoleId: -1,
      // 所有角色(主管/测试角色...)
      roles: [],
      // 当前角色的id
      userId: 0
    }
  },
  created () {
    // 查询数据渲染列表
    this.loadTabDate()
  },
  methods: {
    // 分配用户权限 -> 发送请求
    async setRole () {
      // 发送请求
      const res = await this.$http.put(`users/${this.userId}/role`, {rid: this.currRoleId})
      console.log(res)
      const {
        meta: {msg, status}
      } = res.data
      if (status === 200) {
        // 提示框
        this.$message.success(msg)
        // 关闭对话框
        this.dialogFormVisibleSetrole = false
        // 重新渲染
        this.loadTabDate()
      }
    },
    // 分配用户权限 -> 显示对话框
    async showRoleBox (user) {
      // 将用户id赋值给 userId
      this.userId = user.id
      this.username = user.username
      this.dialogFormVisibleSetrole = true
      // 发送请求
      const res = await this.$http.get(`roles`)
      // 将获取到的角色数组赋值给 roels
      this.roles = res.data.data
      // 发送请求获取当前用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`)
      // 将当前用户的角色id赋值给 currRoleId
      this.currRoleId = res2.data.data.rid
    },
    // 编辑用户 -> 发送请求
    async editUser () {
      // 发送put请求
      const res = await this.$http.put(`users/${this.formdata.id}`, this.formdata)
      const {
        meta: {msg, status}
      } = res.data
      // 提示框
      if (status === 200) {
        this.$message.success(msg)
        // 关闭当前对话框
        this.dialogFormVisibleEdituser = false
        // 重新渲染列表
        this.pagenum = 1
        this.loadTabDate()
      }
    },
    // 编辑用户->显示对话框
    async showEditBox (user) {
      this.dialogFormVisibleEdituser = true
      // 发送请求获取要编辑用户的数据
      const res = await this.$http.get(`users/${user.id}`)
      // 将要编辑用户的数据赋值给 formdata
      this.formdata = res.data.data
    },
    // 添加用户的方法
    async addUser () {
      // 关闭对话框
      this.dialogFormVisibleAppuser = false
      // 发送请求
      const res = await this.$http.post('users', this.formdata)
      const {
        meta: {msg, status}
      } = res.data
      // 提示框
      if (status === 201) {
        this.$message.success(msg)
        // 重新渲染页面
        this.loadTabDate()
        // 清空添加用户的表单数据
        // 遍历对象
        for (const key in this.formdata) {
          // 判断对象中key是否为空
          if (this.formdata.hasOwnProperty(key)) {
            // 如果为空就清空key
            this.formdata[key] = ''
          }
        }
      } else {
        this.$message.error(msg)
      }
    },
    // 显示添加的对话框
    showAppUserDia (user) {
      this.dialogFormVisibleAppuser = true
    },
    // 显示删除提示框的方法
    showDeleBox (user) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${user.id}`)
        const {
          meta: {status, msg}
        } = res.data
        if (status === 200) {
          this.$message.success(msg)
          console.log(this)
          // 删除成功后渲染列表
          this.loadTabDate()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改用户状态的方法
    async handleSwitchMgstate (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
      console.log(res)
    },
    // 查询用户方法
    checkUser () {
      this.loadTabDate()
    },
    // 分页的方法
    // 每页显示条数改变时触发的方法
    handleSizeChange (val) {
      // 将pagesize设置为当前的显示条数
      this.pagesize = val
      // 重新渲染页面
      this.loadTabDate()
      console.log(`每页 ${val} 条`)
    },
    // 当前页码改变时触发的方法
    handleCurrentChange (val) {
      // 设置pagenum为当前页
      this.pagenum = val
      // 重新渲染
      this.loadTabDate()
      console.log(`当前页: ${val}`)
    },
    async loadTabDate () {
      // 给header添加token
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      console.log(res)
      const {
        data: {users},
        meta: {msg, status}
      } = res.data
      if (status === 200) {
        this.list = users
        this.loading = false
        // 给总条数 total 赋值
        this.total = res.data.data.total
        // 将页数设置为第一页
        this.pagenum = 1
        // 将当前页码 currentPage设置为 1
        this.currentPage = 1
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

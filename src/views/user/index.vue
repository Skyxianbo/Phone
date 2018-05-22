<style lang="scss" scoped>
.filter {
  .el-input {
    width: 300px;
  }
  .el-button {
    margin-left: 10px;
  }
}

</style>
<template>
  <div class="app-container">
    <div class="filter">
      <el-form class="form-container">
        <el-input v-model="keywords" size="medium" placeholder="请输入用户ID/名字"></el-input>
        <el-button type="primary" size="medium" @click="fetchData()">查询</el-button>
        <router-link v-bind="{to:'/user/add'}">
          <el-button size="medium" type="primary">添加</el-button>
        </router-link>
      </el-form>
    </div>
    <div ref="indexTable">
      <el-table :height="height" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label='ID' align="center">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            {{scope.row.userName}}
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" align="center">
          <template slot-scope="scope">
            {{scope.row.realName}}
          </template>
        </el-table-column>
        <el-table-column label="身份证" align="center">
          <template slot-scope="scope">
            {{scope.row.idCard}}
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">
            {{scope.row.adress}}
          </template>
        </el-table-column>
        <el-table-column label="资金" align="center">
          <template slot-scope="scope">
            {{scope.row.income}} 元
          </template>
        </el-table-column>
        <el-table-column label="等级" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.level}}</div>
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.lastLoginTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="其它" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.other}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.status}}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status == '1'" @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <router-link style="color: #409EFF" :to="{path: '/user/add/id/'+scope.row.id, query: { name: scope.row.name }}">编辑</router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" ref="pages">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getUser, addUser } from '@/api/user';
export default {
  data() {
    return {
      boxTop: '',
      height: '',
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      keywords: ''
    }
  },
  created() {
    // this.fetchData();
  },
  mounted() {
    this.boxTop = this.$refs.indexTable.getBoundingClientRect().top;
    this.height = document.documentElement.clientHeight - this.boxTop - 50
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    fetchData() {
      let param = {
        keywords: this.keywords,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      getUser(param).then(res => {
        this.list = res.returnValue.list;
        this.total = res.returnValue.total;
      })
    },
    handleResize() {
      this.height = document.documentElement.clientHeight - this.boxTop - 50;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchData();
    },
    changeStatus(row) {
      this.$confirm(`您确认要${row.status == '1' ? '关闭' : '开启'}此用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addUser({
          id: row.id,
          userName: row.userName,
          passWord: row.passWord,
          realName: row.realName,
          idCard: row.idCard,
          adress: row.adress,
          income: row.income,
          level: row.level,
          lastLoginTime: row.lastLoginTime,
          token: row.token,
          other: row.other,
          status: row.status == '1' ? '0' : '1'
        }).then(res => {
          this.$message({
            type: 'success',
            message: '更新成功!'
          });
          this.fetchData();
        })
      })
    }
  }
}

</script>

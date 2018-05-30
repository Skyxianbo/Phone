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
        <el-button type="primary" size="medium" @click="fetchData">查询</el-button>
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
            {{scope.row.income || 0}} 元
          </template>
        </el-table-column>
        <el-table-column label="等级" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.level || '-'}} 级</div>
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.lastLoginTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.status | status}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <router-link style="color: #409EFF" :to="{path: '/user/update/id/'+scope.row.id, query: { name: scope.row.name }}">编辑</router-link>
          </template>
        </el-table-column>
      </el-table>
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
      keywords: ''
    }
  },
  activated() {
    this.fetchData();
  },
  mounted() {
    this.boxTop = this.$refs.indexTable.getBoundingClientRect().top;
    this.height = document.documentElement.clientHeight - this.boxTop - 50
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    fetchData() {
      let param = {
        keywords: this.keywords
      }
      getUser(param).then(res => {
        this.list = res.returnValue;
      })
    },
    handleResize() {
      this.height = document.documentElement.clientHeight - this.boxTop - 50;
    }
  },
  filters: {
    status(status) {
      return status == 1 ? '启用' : '停用';
    }
  }
}

</script>

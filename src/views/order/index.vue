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
        <el-input v-model="keywords" size="medium" placeholder="请输入订单ID/商品名称"></el-input>
        <el-button type="primary" size="medium" @click="fetchData()">查询</el-button>
      </el-form>
    </div>
    <div ref="indexTable">
      <el-table :height="height" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label='ID' align="center">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            {{scope.row.goodsName}}
          </template>
        </el-table-column>
        <el-table-column label="串码" align="center">
          <template slot-scope="scope">
            {{scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{scope.row.creatTime}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column label="付款图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" style="width: 50px;height: 50px; cursor: pointer" @click="openImgBox(scope.row.imageUrl)">
          </template>
        </el-table-column>
        <el-table-column label="是否审核" align="center">
          <template slot-scope="scope">
            {{scope.row.audit}}
          </template>
        </el-table-column>
        <el-table-column label="用户名称" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.userName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="快递单号" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.trackingNumber}}</div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.updateTime}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
          	<a href="#" style="color: #409EFF">通过</a>
          	<a href="#" style="color: #409EFF">输入快递单号</a>
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
import { getOrder, addOrder } from '@/api/order';
import { openImageBox } from '@/utils/common';
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
      getOrder(param).then(res => {
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
    openImgBox(img) {
      openImageBox(img);
    },
    changeStatus(row) {
      this.$confirm(`您确认要${row.status == '1' ? '关闭' : '开启'}此用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addOrder({
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

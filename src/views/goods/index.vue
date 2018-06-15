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
        <el-input v-model="keywords" size="medium" placeholder="请输入商品ID/名称"></el-input>
        <el-button type="primary" size="medium" @click="fetchData()">查询</el-button>
        <router-link v-bind="{to:'/goods/add'}">
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
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">
            {{scope.row.classifyName}}
          </template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">
            {{scope.row.brandName}}
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center">
          <template slot-scope="scope">
            {{scope.row.model}}
          </template>
        </el-table-column>
        <el-table-column label="配置" align="center">
          <template slot-scope="scope">
            {{scope.row.config}}
          </template>
        </el-table-column>
        <el-table-column label="颜色" align="center">
          <template slot-scope="scope">
            {{scope.row.color}}
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            {{scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <div>{{scope.row.remark}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <router-link style="color: #409EFF" :to="{path: '/goods/update/id/'+scope.row.id, query: { name: scope.row.name }}">编辑</router-link>
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
import { getGoods, addGoods } from '@/api/goods';
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
    this.fetchData();
  },
  mounted() {
    this.boxTop = this.$refs.indexTable.getBoundingClientRect().top;
    this.height = document.documentElement.clientHeight - this.boxTop - 125
    window.addEventListener('resize', this.handleResize);
  },
  activated() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let param = {
        keywords: this.keywords,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      getGoods(param).then(res => {
        this.list = res.returnValue.list;
        this.total = res.returnValue.totalCount;
      })
    },
    handleResize() {
      this.height = document.documentElement.clientHeight - this.boxTop - 125;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchData();
    }
  }
}

</script>

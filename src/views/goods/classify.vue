<style lang="scss" scoped>
.filter {
  .el-input {
    width: 200px;
  }
}

</style>
<template>
  <div class="app-container">
    <div class="filter">
      <el-form class="form-container">
        <el-button type="primary" size="medium" @click="ifDialog = true">添加</el-button>
      </el-form>
    </div>
    <div ref="indexTable">
      <el-table :height="height" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label='ID' align="center">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="父级分类ID" align="center">
          <template slot-scope="scope">
            {{scope.row.parent}}
          </template>
        </el-table-column>
        <el-table-column label="父级分类名称" align="center">
          <template slot-scope="scope">
            {{scope.row.parentName}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否可用" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status == '1'" @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <a href="#" style="color: #409EFF" @click="openDialog(scope.row)">编辑</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="block" ref="pages">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> -->
    </div>
    <el-dialog :title="isEdit ? '分类编辑' : '分类添加'" :visible.sync="ifDialog" width="700px" v-if="ifDialog">
      <el-form ref="dataForm" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="分类名称：" prop="name">
          <el-input size="medium" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" prop="classifyId">
          <el-select size="medium" v-model="formData.parent" clearable filterable placeholder="请选择父级分类" style="width: 300px">
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ifDialog = false">取 消</el-button>
        <el-button type="primary" @click="sendData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getClassify, addClassify } from '@/api/goods';
export default {
  data() {
    return {
      boxTop: '',
      height: '',
      list: [],
      // total: 0,
      // pageNum: 1,
      // pageSize: 20,
      ifDialog: false,
      isEdit: false,
      formData: {
        name: '',
        parent: ''
      },
      currentId: ''
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.boxTop = this.$refs.indexTable.getBoundingClientRect().top;
    this.height = document.documentElement.clientHeight - this.boxTop - 50
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    fetchData() {
      getClassify().then(res => {
        this.list = res.returnValue;
      })
    },
    handleResize() {
      this.height = document.documentElement.clientHeight - this.boxTop - 50;
    },
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.fetchData();
    // },
    // handleCurrentChange(val) {
    //   this.pageNum = val;
    //   this.fetchData();
    // },
    // changeStatus(row) {
    //   this.$confirm(`您确认要${row.status == '1' ? '关闭' : '开启'}此分类吗？`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     addGoods({
    //       id: row.id,
    //       name: row.name,
    //       classifyId: row.classifyId,
    //       status: row.status == '1' ? '0' : '1'
    //     }).then(res => {
    //       this.$message({
    //         type: 'success',
    //         message: '更新成功!'
    //       });
    //       this.fetchData();
    //     })
    //   })
    // },
    getClassify(row) {
      this.currentId = row.id;
      getClassify({
        id: row.id
      }).then((res) => {
        this.formData = {
          name: res.returnValue.name,
          parent: res.returnValue.parent
        }
      })
    },
    sendData() {
      let param = {
        name: this.formData.name,
        parent: this.formData.parent ? this.formData.parent : 0
      }
      param.id = this.isEdit ? this.currentId : '';
      addClassify(param).then(() => {
        this.$message('已添加');
        this.ifDialog = false;
        this.formData = {
          name: '',
          parent: ''
        };
        this.fetchData();
      })
    },
    initDialog() {
      this.ifDialog = false;
      this.formData.name = '';
      this.formData.parent = '';
      this.currentId = '';
    }
  }
}

</script>

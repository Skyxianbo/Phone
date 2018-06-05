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
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <a href="#" style="color: #409EFF" @click="openDialog(scope.row)">编辑</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="isEdit ? '品牌编辑' : '品牌添加'" :visible.sync="ifDialog" width="700px" v-if="ifDialog">
      <el-form ref="dataForm" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="品牌名称：" prop="name">
          <el-input size="medium" v-model="formData.name"></el-input>
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
import { getBrand, addBrand } from '@/api/goods';
export default {
  data() {
    return {
      boxTop: '',
      height: '',
      list: [],
      ifDialog: false,
      isEdit: false,
      formData: {
        name: ''
      },
      currentId: ''
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
  methods: {
    fetchData() {
      getBrand({
        parent: 1
      }).then(res => {
        this.list = res.returnValue;
      })
    },
    handleResize() {
      this.height = document.documentElement.clientHeight - this.boxTop - 125;
    },
    openDialog(row) {
      this.currentId = row.id;
      getBrand({
        id: row.id
      }).then((res) => {
        this.formData.name = res.returnValue[0].name;
        this.isEdit = true;
        this.ifDialog = true;
      })
    },
    sendData() {
      let param = {
        name: this.formData.name,
        parent: 1
      }
      param.id = this.isEdit ? this.currentId : '';
      addBrand(param).then(() => {
        const message = this.isEdit ? '已编辑' : '已添加';
        this.$message.success(message);
        this.ifDialog = false;
        this.formData.name = '';
        this.fetchData();
      })
    },
    initDialog() {
      this.ifDialog = false;
      this.formData.name = '';
      this.currentId = '';
    }
  }
}

</script>

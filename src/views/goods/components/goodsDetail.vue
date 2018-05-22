<template>
  <div class="createPost-container" v-if="flag">
    <el-form class="form-container" :model="formData" :rules="rules" ref="dataForm">
      <div class="title-block">基本信息</div>
      <el-row>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="name" label="商品名称:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.name" placeholder="请输入商品名称" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="classifyId" label="商品分类:" class="postInfo-container-item">
            <el-select size="medium" v-model="formData.classifyId" clearable filterable placeholder="请选择商品分类" style="width: 400px">
              <el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="supplierId" label="供应商:" class="postInfo-container-item">
            <el-select size="medium" v-model="formData.supplierId" clearable filterable placeholder="请选择供应商" style="width: 400px">
              <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="number" label="串码:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.number" placeholder="请输入商品串码" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="price" label="价格:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.price" placeholder="请输入商品价格" style="width: 200px">
            </el-input> 元
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="remark" label="备注:" class="postInfo-container-item">
            <el-input type="textarea" size="medium" v-model="formData.remark" placeholder="请输入商品备注" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="image" label="图片">
            <el-upload class="upload-demo" :action="uploadUrl" :on-success="fileUploadData" :limit="1" :file-list="fileList" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="sub-navbar draft">
      <el-button type="primary" @click="sendData">{{isEdit ? '修 改' : '添 加'}}</el-button>
    </div>
  </div>
</template>
<script>
import { getGoods, addGoods, getClassify } from '@/api/goods';
import { getSupplier } from '@/api/supplier';
export default {
  name: 'goodsDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      classifyList: [],
      supplierList: [],
      formData: {},
      flag: true,
      uploadUrl: '',
      fileList: [],
      rules: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    view() {
      var view;
      this.visitedViews.forEach((v) => {
        if (v.path === this.$route.path) {
          view = v;
        }
      })
      return view;
    }
  },
  created() {
    this.initData();
    // this.getClassify();
    // this.getSupplier();
    if (this.isEdit) {
      this.getGoods();
    }
  },
  mounted() {
    this.view.new = false;
  },
  activated() {
    if (this.view.new) {
      this.isEdit ? this.getGoods() : this.clearForm();
      this.view.new = false;
    }
  },
  methods: {
    initData() {
      this.formData = {
        classifyId: '',
        supplierId: '',
        name: '',
        number: '',
        price: '',
        image: '',
        remark: ''
      };
      this.rules = {
        classifyId: [{ required: true, message: "请选择商品分类" }],
        supplierId: [{ required: true, message: "请选择供应商" }],
        name: [{ required: true, message: "请输入商品名称" }],
        number: [{ required: true, message: "请输入商品串码" }],
        price: [{ required: true, message: "请输入商品价格" }]
      };
      this.uploadUrl = `${process.env.BASE_API}/image/upload`;
      this.fileList = [];
    },
    getClassify() {
      getClassify().then(res => {
        this.classifyList = res.returnValue.list;
      })
    },
    getSupplier() {
      getSupplier().then(res => {
        this.supplierList = res.returnValue.list;
      })
    },
    getGoods() {
      getGoods({
        id: this.$route.params.id
      }).then(res => {
        const data = res.returnValue;
        this.formData = {
          classifyId: data.classifyId,
          supplierId: data.supplierId,
          name: data.name,
          number: data.number,
          price: data.price,
          image: data.image,
          remark: data.remark
        };
        this.fileList = [{ name: this.formData.image, url: this.formData.image }];
      });
    },
    sendData() {
      let param = {
        classifyId: this.formData.classifyId,
        supplierId: this.formData.supplierId,
        name: this.formData.name,
        number: this.formData.number,
        price: this.formData.price,
        image: this.formData.image,
        remark: this.formData.remark
      };
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          param.id = this.isEdit ? this.$route.params.id : '';
          const msg = this.isEdit ? `您确认要编辑id为${param.id}，名称为${param.name}的商品吗？` : `您确认要添加名称为${param.name}的商品吗？`;
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addGoods(param).then((res) => {
              if (this.isEdit) {
                this.closeTag();
              } else {
              	this.$alert(`您所添加的商品ID为${res.returnValue}`, '提示', {
                  confirmButtonText: '确认',
                  callback: action => {
                    this.clearForm();
                    this.closeTag();
                  }
                })
              }
            })
          }).catch(() => {})
        }
      })
    },
    fileUploadData(res) {
      this.formData.image = res.returnValue;
    },
    closeTag() {
      this.$store.dispatch('delVisitedViews', this.view).then((views) => {
        const latestView = views.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView.path)
        } else {
          this.$router.push({ name: 'goods' });
        }
      })
    },
    clearForm() {
      this.initData();
      this.$refs["dataForm"].resetFields();
    },
  }
}

</script>
<style>
	.title-block {
  border-bottom: solid 1px #e6e6e6;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
</style>
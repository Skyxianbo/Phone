<template>
  <div class="createPost-container" v-if="flag">
    <el-form class="form-container" :model="formData" :rules="rules" ref="dataForm">
      <div class="title-block">基本信息</div>
      <el-row>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="userName" label="用户名:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.userName" placeholder="请输入用户名" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isEdit">
          <el-form-item label-width="100px" prop="passWord" label="密码:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.passWord" placeholder="请输入密码" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="realName" label="真实姓名:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.realName" placeholder="请输入真实姓名" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="idCard" label="身份证:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.idCard" placeholder="请输入身份证" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="adress" label="地址:" class="postInfo-container-item">
            <el-input type="textarea" size="medium" v-model="formData.adress" placeholder="请输入地址" style="width: 400px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="income" label="押金:" class="postInfo-container-item">
            <el-input size="medium" v-model="formData.income" placeholder="请输入押金" style="width: 400px">
            </el-input> 元
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="100px" prop="level" label="等级:" class="postInfo-container-item">
            <el-select size="medium" v-model="formData.level" placeholder="请选择等级" style="width: 150px">
              <el-option v-for="n in 5" :key="n" :label="n" :value="n"></el-option>
            </el-select>
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
import { getUser, addUser } from '@/api/user';
export default {
  name: 'userDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      flag: true
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
    if (this.isEdit) {
      this.getUser();
    }
  },
  mounted() {
    this.view.new = false;
  },
  activated() {
    if (this.view.new) {
      this.isEdit ? this.getUser() : this.clearForm();
      this.view.new = false;
    }
  },
  methods: {
    initData() {
      this.formData = {
        userName: '',
        passWord: '',
        realName: '',
        idCard: '',
        adress: '',
        income: '',
        level: ''
      };
      if (this.isEdit) {
        this.rules = {
          userName: [{ required: true, message: "请输入用户名" }],
        }
      } else {
        this.rules = {
          userName: [{ required: true, message: "请输入用户名" }],
          passWord: [{ required: true, message: "请输入密码" }]
        }
      };
    },
    getUser() {
      getUser({
        id: this.$route.params.id
      }).then(res => {
        const data = res.returnValue[0];
        this.formData = {
          userName: data.userName,
          passWord: data.passWord,
          realName: data.realName,
          idCard: data.idCard,
          adress: data.adress,
          income: data.income,
          level: data.level
        };
      });
    },
    sendData() {
      let param = {
        userName: this.formData.userName,
        realName: this.formData.realName,
        idCard: this.formData.idCard,
        adress: this.formData.adress,
        income: this.formData.income,
        level: this.formData.level,
        status: 1
      };
      if (this.isEdit) {
        param.id = this.$route.params.id;
      } else {
        param.passWord = this.formData.passWord;
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const msg = this.isEdit ? `您确认要编辑id为${param.id}，名称为${param.userName}的用户吗？` : `您确认要添加名称为${param.userName}的用户吗？`;
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addUser(param).then((res) => {
              if (this.isEdit) {
                this.closeTag();
              } else {
                this.$alert(`您所添加的用户ID为${res.returnValue}`, '提示', {
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
    closeTag() {
      this.$store.dispatch('delVisitedViews', this.view).then((views) => {
        const latestView = views.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView.path)
        } else {
          this.$router.push({ name: 'user' });
        }
      })
    },
    clearForm() {
      this.initData();
      this.$refs["dataForm"].resetFields();
    }
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

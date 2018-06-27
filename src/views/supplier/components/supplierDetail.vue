<template>
    <div class="createPost-container" v-if="flag">
        <el-form class="form-container" :model="formData" :rules="rules" ref="dataForm">
            <div class="title-block">基本信息</div>
            <el-row>
                <el-col :span="24">
                    <el-form-item label-width="150px" prop="name" label="供应商名称:" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.name" placeholder="请输入供应商名称" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="150px" prop="adress" label="供应商地址:" class="postInfo-container-item">
                        <el-input type="textarea" size="medium" v-model="formData.adress" placeholder="请输入供应商地址" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="150px" prop="person" label="供应商联系人:" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.person" placeholder="请输入供应商联系人" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="150px" prop="tel" label="供应商电话:" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.tel" placeholder="请输入供应商电话" style="width: 200px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="150px" prop="other" label="其他:" class="postInfo-container-item">
                        <el-input type="textarea" size="medium" v-model="formData.other" placeholder="请输入其他" style="width: 400px">
                        </el-input>
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
import { getSupplier, addSupplier } from '@/api/supplier';
export default {
    name: 'supplierDetail',
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {},
            flag: true,
            rules: {
                name: [{ required: true, message: "请输入供应商名称" }]
            }
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
            this.getSupplier();
        }
    },
    mounted() {
        this.view.new = false;
    },
    activated() {
        if (this.view.new) {
            this.isEdit ? this.getSupplier() : this.clearForm();
            this.view.new = false;
        }
    },
    methods: {
        initData() {
            this.formData = {
                name: '',
                adress: '',
                person: '',
                tel: '',
                other: ''
            };
        },
        getSupplier() {
            getSupplier({
                id: this.$route.params.id
            }).then(res => {
                const data = res.returnValue[0];
                this.formData = {
                    name: data.name,
                    adress: data.adress,
                    person: data.person,
                    tel: data.tel,
                    other: data.other
                };
            });
        },
        sendData() {
            let param = {
                name: this.formData.name,
                adress: this.formData.adress,
                person: this.formData.person,
                tel: this.formData.tel,
                other: this.formData.other
            };
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    param.id = this.isEdit ? this.$route.params.id : '';
                    const msg = this.isEdit ? `您确认要编辑id为${param.id}，名称为${param.name}的供应商吗？` : `您确认要添加名称为${param.name}的供应商吗？`;
                    this.$confirm(msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        addSupplier(param).then((res) => {
                            if (this.isEdit) {
                                this.closeTag();
                            } else {
                                this.$alert(`您所添加的供应商ID为${res.returnValue}`, '提示', {
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
                    this.$router.push({ name: 'supplier' });
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

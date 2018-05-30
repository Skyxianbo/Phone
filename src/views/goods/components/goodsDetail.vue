<template>
    <div class="createPost-container" v-if="flag">
        <el-form class="form-container" :model="formData" :rules="rules" ref="dataForm">
            <div class="title-block">基本信息</div>
            <el-row>
                <!-- 商品名称 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="name" label="名称" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.name" placeholder="请输入商品名称" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品分类 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="classifyId" label="分类" class="postInfo-container-item">
                        <el-select size="medium" v-model="formData.classifyId" clearable filterable placeholder="请选择商品分类" style="width: 400px">
                            <el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- 商品品牌 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="brandId" label="品牌" class="postInfo-container-item">
                        <el-select size="medium" v-model="formData.brandId" clearable filterable placeholder="请选择商品品牌" style="width: 400px">
                            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- 商品型号 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="model" label="型号" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.model" placeholder="请输入商品型号" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品配置 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="config" label="配置" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.config" placeholder="请输入商品配置" style="width: 200px">
                        </el-input> 元
                    </el-form-item>
                </el-col>
                <!-- 商品颜色 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="color" label="颜色" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.color" placeholder="请输入商品颜色" style="width: 200px">
                        </el-input> 元
                    </el-form-item>
                </el-col>
                <!-- 商品数量 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="number" label="数量" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.number" placeholder="请输入商品数量，仅用于展示" style="width: 200px">
                        </el-input> 元
                    </el-form-item>
                </el-col>
                <!-- 商品备注 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="remark" label="备注" class="postInfo-container-item">
                        <el-input type="textarea" size="medium" v-model="formData.remark" placeholder="请输入商品备注" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="title-block">高级配置</div>
            <el-row>
                <!-- 会员价格 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" label="会员价格" class="postInfo-container-item">
                        <price-config :selectData="formData.priceConf"></price-config>
                    </el-form-item>
                </el-col>
                <!-- 供应商配置 -->
                <!-- <el-col :span="24">
                    <el-form-item label-width="100px" label="供应商配置" class="postInfo-container-item">
                        <supplier-config :selectData="formData.providerConf"></supplier-config>
                    </el-form-item>
                </el-col> -->
            </el-row>
        </el-form>
        <div class="sub-navbar draft">
            <el-button type="primary" @click="sendData">{{isEdit ? '修 改' : '添 加'}}</el-button>
        </div>
    </div>
</template>
<script>
import { getGoods, addGoods, getClassify } from '@/api/goods';
import { priceConfig, supplierConfig } from '../components';
export default {
    name: 'goodsDetail',
    components: {
        priceConfig,
        supplierConfig
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            classifyList: [],
            brandList: [],
            flag: true,
            formData: {},
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
        this.getClassify();
        this.getBrand();
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
        // 初始化数据
        initData() {
            this.formData = {
                name: '', //商品名称
                classifyId: '', //商品分类
                brandId: '', //商品品牌
                model: '', //商品型号
                config: '', //商品配置
                color: '', //商品颜色
                number: '', //商品数量（仅用于展示）
                remark: '', //备注
                priceConf: [{
                    level: 1,
                    price: ''
                }, {
                    level: 2,
                    price: '',
                }, {
                    level: 3,
                    price: ''
                }, {
                    level: 4,
                    price: ''
                }, {
                    level: 5,
                    price: ''
                }], //会员等级对应价格配置
                providerConf: [] //供应商配置
            };
            this.rules = {
                name: [{ required: true, message: "请输入商品名称" }],
                classifyId: [{ required: true, message: "请选择商品分类" }],
                brandId: [{ required: true, message: "请选择商品品牌" }],
                model: [{ required: true, message: "请选择商品型号" }],
                config: [{ required: true, message: "请输入商品配置" }],
                color: [{ required: true, message: "请输入商品颜色" }]
            };
        },
        // 获取分类列表
        getClassify() {
            getClassify().then(res => {
                this.classifyList = res.returnValue.list;
            })
        },
        // 获取品牌列表
        getBrand() {
            getClassify().then(res => {
                this.brandList = res.returnValue.list;
            })
        },
        // 获取商品信息
        getGoods() {
            getGoods({
                id: this.$route.params.id
            }).then(res => {
                const data = res.returnValue;
                this.formData = {
                    name: data.name,
                    classifyId: data.classifyId,
                    brandId: data.brandId,
                    model: data.model,
                    config: data.config,
                    color: data.color,
                    number: data.number,
                    remark: data.remark,
                    priceConf: data.priceConf,
                    providerConf: data.providerConf
                };
            });
        },
        // 新增/编辑商品
        sendData() {
            console.log(this.formData.priceConf);
            return;
            let param = {
                name: this.formData.name,
                classifyId: this.formData.classifyId,
                brandId: this.formData.brandId,
                model: this.formData.model,
                config: this.formData.config,
                color: this.formData.color,
                number: this.formData.number,
                remark: this.formData.remark,
                priceConf: JSON.stringify(this.formData.priceConf),
                providerConf: JSON.stringify(this.formData.providerConf)
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
        // 关闭标签
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
        // 重置表单信息
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

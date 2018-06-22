<template>
    <div class="createPost-container" v-if="flag">
        <el-form class="form-container" :model="formData" :rules="rules" ref="dataForm">
            <div class="title-block">基本信息</div>
            <el-row>
                <!-- 商品型号 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="model" label="型号" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.model" placeholder="请输入商品型号" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品名称 -->
                <!-- <el-col :span="24">
                    <el-form-item label-width="100px" prop="name" label="名称" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.name" placeholder="请输入商品名称" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col> -->
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
                <!-- 商品配置 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="config" label="配置" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.config" placeholder="请输入商品配置" style="width: 200px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品颜色 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="color" label="颜色" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.color" placeholder="请输入商品颜色" style="width: 200px">
                        </el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品数量 -->
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="number" label="数量" class="postInfo-container-item">
                        <el-input size="medium" v-model="formData.number" placeholder="请输入商品数量，仅用于展示" style="width: 200px">
                        </el-input>
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
                <el-col :span="24">
                    <el-form-item label-width="100px" label="供应商配置" class="postInfo-container-item">
                        <supplier-config :selectData="formData.providerConf"></supplier-config>
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
            rules: {
                // name: [{ required: true, message: "请输入商品名称" }],
                classifyId: [{ required: true, message: "请选择商品分类" }],
                brandId: [{ required: true, message: "请选择商品品牌" }],
                model: [{ required: true, message: "请选择商品型号" }],
                config: [{ required: true, message: "请输入商品配置" }],
                color: [{ required: true, message: "请输入商品颜色" }]
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
                // name: '', //商品名称
                classifyId: '', //商品分类
                brandId: '', //商品品牌
                model: '', //商品型号
                config: '', //商品配置
                color: '', //商品颜色
                number: '', //商品数量（仅用于展示）
                remark: '', //备注
                priceConf: [{
                    level: 1,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 2,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 3,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 4,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 5,
                    price: '',
                    provincePrice: ''
                }], //会员等级对应价格配置, price为全国价格，provincePrice为省内价格
                providerConf: [] //供应商配置
            };
        },
        // 获取分类列表
        getClassify() {
            getClassify({
                parent: 0
            }).then(res => {
                this.classifyList = res.returnValue;
            })
        },
        // 获取品牌列表
        getBrand() {
            getClassify({
                parent: 1
            }).then(res => {
                this.brandList = res.returnValue;
            })
        },
        // 获取商品信息
        getGoods() {
            getGoods({
                id: this.$route.params.id,
                pageNum: 1,
                pageSize: 20
            }).then(res => {
                const data = res.returnValue.list[0];
                this.formData = {
                    // name: data.name,
                    classifyId: data.classifyId,
                    brandId: data.brandId,
                    model: data.model,
                    config: data.config,
                    color: data.color,
                    number: data.number,
                    remark: data.remark,
                    priceConf: this.formatPrice('get', JSON.parse(data.priceConf)),
                    providerConf: JSON.parse(data.providerConf)
                };
            });
        },
        // 新增/编辑商品
        sendData() {
            let param = {
                // name: this.formData.name,
                classifyId: this.formData.classifyId,
                brandId: this.formData.brandId,
                model: this.formData.model,
                config: this.formData.config,
                color: this.formData.color,
                number: this.formData.number,
                remark: this.formData.remark,
                priceConf: JSON.stringify(this.formatPrice('set', this.formData.priceConf)),
                providerConf: JSON.stringify(this.formData.providerConf)
            };
            param.classifyName = (this.classifyList.find(item => item.id == param.classifyId) || {}).name;
            param.brandName = (this.brandList.find(item => item.id == param.brandId) || {}).name;
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    param.id = this.isEdit ? this.$route.params.id : '';
                    const msg = this.isEdit ? `您确认要编辑id为${param.id}，型号为${param.model}的商品吗？` : `您确认要添加型号为${param.model}的商品吗？`;
                    this.$confirm(msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        addGoods(param).then((res) => {
                            if (this.isEdit) {
                                this.closeTag();
                            } else {
                                this.clearForm();
                                this.closeTag();
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
        },
        formatPrice(type, initial_data) {
            if (type == 'set') {
                const result_data = [];
                initial_data.forEach((x) => {
                    // 编辑时需push id和goodsId，新增时不需要
                    if (this.isEdit) {
                        // push全国价格
                        result_data.push({
                            id: x.id,
                            goodsId: x.goodsId,
                            level: x.level,
                            price: x.price,
                            type: 1
                        })
                        // push省内价格
                        result_data.push({
                            id: x.id,
                            goodsId: x.goodsId,
                            level: x.level,
                            price: x.provincePrice,
                            type: 2
                        })
                    } else {
                        // push全国价格
                        result_data.push({
                            level: x.level,
                            price: x.price,
                            type: 1
                        })
                        // push省内价格
                        result_data.push({
                            level: x.level,
                            price: x.provincePrice,
                            type: 2
                        })
                    }
                })
                return result_data;
            } else if (type == 'get') {
                const result_data = [{
                    level: 1,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 2,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 3,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 4,
                    price: '',
                    provincePrice: ''
                }, {
                    level: 5,
                    price: '',
                    provincePrice: ''
                }]
                initial_data.forEach((x) => {
                    if (x.type == 1) {
                        result_data[x.level - 1].price = x.price;
                    } else if (x.type == 2) {
                        result_data[x.level - 1].provincePrice = x.price;
                    }
                })
                return result_data;
            }
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

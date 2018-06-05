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
                <el-date-picker v-model="datetime" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="medium">
                </el-date-picker>
                <el-button type="primary" size="medium" @click="fetchData()">查询</el-button>
            </el-form>
        </div>
        <div ref="indexTable">
            <el-table :height="height" :data="list" element-loading-text="Loading" border fit highlight-current-row>
                <el-table-column label='订单ID' align="center">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.goodsName}}
                    </template>
                </el-table-column>
                <el-table-column label="单价" align="center">
                    <template slot-scope="scope">
                        {{scope.row.price}}
                    </template>
                </el-table-column>
                <el-table-column label="订单数量" align="center">
                    <template slot-scope="scope">
                        {{scope.row.number}}
                    </template>
                </el-table-column>
                <el-table-column label="串码" align="center">
                    <template slot-scope="scope">
                        {{scope.row.numberConf.number}}
                    </template>
                </el-table-column>
                <el-table-column label="总价" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.totalPrices}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="实际价格" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.actualPrices}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="成本" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.cost}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="利润" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.profit}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="是否付款" align="center">
                    <template slot-scope="scope">
                        {{scope.row.isPay}}
                    </template>
                </el-table-column>
                <el-table-column label="付款图片" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.imageUrl" style="width: 50px;height: 50px; cursor: pointer" @click="openImgBox(scope.row.imageUrl)">
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" align="center">
                    <template slot-scope="scope">
                        {{scope.row.audit}}
                    </template>
                </el-table-column>
                <el-table-column label="快递单号" align="center">
                    <template slot-scope="scope">
                        {{scope.row.trackingNumber}}
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.datetime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <a href="#" style="color: #409EFF" @click.prevent="openCostDialog(scope.row)">输入成本</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" ref="pages">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="发货" :visible.sync="ifCostDialog" width="600px" v-if="ifCostDialog">
            <el-form ref="dataForm" :model="formData" :rules="rules" label-width="120px">
                <el-form-item class="el-form-item" label="成本：" prop="cost">
                    <el-input size="medium" v-model.number="formData.cost" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click.prevent="sendData">提 交</el-button>
            </div>
        </el-dialog>
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
            keywords: '',
            datetime: [new Date(Date.now()), new Date(Date.now())],
            ifCostDialog: false,
            currentOrder: {},
            formData: {},
            rules: {
                cost: [{ required: true, type: "integer", message: "请输入成本" }]
            }
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
            this.height = document.documentElement.clientHeight - this.boxTop - 125;
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
        openCostDialog(row) {
            this.currentOrder = row;
            this.ifCostDialog = true;
            this.formData = {
                cost: this.currentOrder.cost,
            };
        },
        sendData() {
            let param = {
                id: this.currentOrder.id,
                goodsId: this.currentOrder.goodsId,
                goodsName: this.currentOrder.goodsName,
                number: this.currentOrder.number,
                imageUrl: this.currentOrder.imageUrl,
                audit: this.currentOrder.audit,
                userId: this.currentOrder.userId,
                trackingNumber: this.currentOrder.trackingNumber,
                userName: this.currentOrder.userName,
                price: this.currentOrder.price,
                datetime: this.currentOrder.datetime,
                adress: this.currentOrder.adress,
                person: this.currentOrder.person,
                tel: this.currentOrder.tel,
                isPay: this.currentOrder.isPay,
                totalPrices: this.currentOrder.totalPrices,
                actualPrices: this.currentOrder.actualPrices,
                cost: this.formData.cost,
                profit: this.currentOrder.profit,
                numberConf: JSON.stringify(this.currentOrder.numberConf)
            }
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    addOrder(param).then(res => {
                        this.ifCostDialog = false;
                    })
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.filter {
    .el-input {
        width: 300px;
    }
    .el-button {
        margin-left: 10px;
    }
}

.red {
    color: red;
}

</style>
<template>
    <div class="app-container">
        <div class="filter">
            <el-form class="form-container">
                <el-input v-model="keywords" size="medium" placeholder="请输入订单ID/商品名称"></el-input>
                <el-input v-model="number" size="medium" placeholder="请输入串码"></el-input>
                <!-- <el-select size="medium" v-model="isPay" clearable placeholder="请选择付款状态">
                    <el-option :key="1" :label="已付款" :value="1"></el-option>
                    <el-option :key="0" :label="未付款" :value="0"></el-option>
                </el-select> -->
                <el-select size="medium" v-model="audit" clearable placeholder="请选择发货状态">
                    <el-option :key="1" :label="已发货" :value="1"></el-option>
                    <el-option :key="0" :label="未发货" :value="0"></el-option>
                </el-select>
                <el-date-picker v-model="datetime" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="medium">
                </el-date-picker>
                <el-button type="primary" size="medium" @click="fetchData()">查询</el-button>
            </el-form>
        </div>
        <div ref="indexTable">
            <el-table :height="height" :data="list" element-loading-text="Loading" border fit highlight-current-row :row-class-name="tableRowClassName">
                <el-table-column label='订单ID' align="center">
                    <template slot-scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column label="单价" align="center">
                    <template slot-scope="scope">
                        {{scope.row.price}}
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
                <el-table-column label="订单数量" align="center">
                    <template slot-scope="scope" v-if="scope.row.number != '合计'">
                        {{scope.row.number}}
                    </template>
                </el-table-column>
                <el-table-column label="串码" align="center">
                    <template slot-scope="scope">
                        <div v-if="getNumber(scope.row.numberConf).length <= 13">{{getNumber(scope.row.numberConf)}}</div>
                        <div v-else>
                            <span>{{getNumber(scope.row.numberConf).substring(0, 13)}}...</span>
                            <a href="#" style="color: #409EFF" @click="showContent(getNumber(scope.row.numberConf))">查看更多</a>
                        </div>
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
                    <template slot-scope="scope" v-if="scope.row.number != '合计'">
                        <span :class="{red: scope.row.isPay == 0}" v-if="scope.row.number != '合计'">
                            {{scope.row.isPay == 1 ? '已付款' : '未付款'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="付款图片" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.imageUrl" style="width: 50px;height: 50px; cursor: pointer" @click="openImgBox(scope.row.imageUrl)" v-if="scope.row.number != '合计'">
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" align="center">
                    <template slot-scope="scope">
                        <span :class="{red: scope.row.audit == 0}" v-if="scope.row.number != '合计'">
                            {{scope.row.audit == 1 ? '已发货' : '未发货'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="快递单号" align="center">
                    <template slot-scope="scope">
                        {{scope.row.trackingNumber}}
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <a href="#" style="color: #409EFF" @click.prevent="openCostDialog(scope.row)" v-if="scope.row.number != '合计'">输入成本</a>
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
        <el-dialog title="串码" :visible.sync="ifDialog" width="600px">
            <p style="wordWrap: break-word">{{content}}</p>
        </el-dialog>
    </div>
</template>
<script>
import { getOrder, addOrder } from '@/api/order';
import { openImageBox } from '@/utils/common';
import { formatDate } from '@/utils/data';
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
            number: '',
            // isPay: '',
            audit: '',
            datetime: [new Date(Date.now() - 86400000 * 30), new Date(Date.now())],
            ifCostDialog: false,
            currentOrder: {},
            formData: {},
            rules: {
                cost: [{ required: true, message: "请输入成本" }]
            },
            content: '',
            ifDialog: false
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
                number: this.number,
                startTime: formatDate(this.datetime[0]) + ' 00:00:00',
                endTime: formatDate(this.datetime[1]) + ' 23:59:59',
                // isPay: this.isPay,
                audit: this.audit,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                type: 2
            }
            getOrder(param).then(res => {
                this.list = res.returnValue.list;
                this.total = res.returnValue.totalCount;
                const arr = this.list.splice(this.list.length - 1, 1);
                arr[0].id = '合计';
                this.list.unshift(arr[0]);
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
                numberConf: this.currentOrder.numberConf
            }
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    addOrder(param).then(res => {
                        this.ifCostDialog = false;
                    })
                }
            })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 0) {
                return 'success-row';
            }
            return '';
        },
        getNumber(numberConf) {
            if (!numberConf) {
                return '';
            } else {
                return JSON.parse(numberConf)[0].number;
            }
        },
        showContent(content) {
            this.content = content;
            this.ifDialog = true;
        }
    }
}

</script>

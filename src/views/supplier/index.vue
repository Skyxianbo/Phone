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
                <el-input v-model="keywords" size="medium" placeholder="请输入供应商ID/名称"></el-input>
                <el-button type="primary" size="medium" @click="fetchData">查询</el-button>
                <router-link v-bind="{to:'/supplier/add'}">
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
                <el-table-column label="供应商名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商地址" align="center">
                    <template slot-scope="scope">
                        {{scope.row.adress}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商联系人" align="center">
                    <template slot-scope="scope">
                        {{scope.row.person}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商电话" align="center">
                    <template slot-scope="scope">
                        {{scope.row.tel}}
                    </template>
                </el-table-column>
                <el-table-column label="其他">
                    <template slot-scope="scope">
                        <div>{{scope.row.other}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <router-link style="color: #409EFF" :to="{path: '/supplier/update/id/'+scope.row.id, query: { name: scope.row.name }}">编辑</router-link>
                        <a style="color: #409EFF" href="#" @click.prevent="deleteSupplier(scope.row.id)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getSupplier, addSupplier, deleteSupplier } from '@/api/supplier';
export default {
    data() {
        return {
            boxTop: '',
            height: '',
            list: [],
            keywords: ''
        }
    },
    activated() {
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
                keywords: this.keywords
            }
            getSupplier(param).then(res => {
                this.list = res.returnValue;
            })
        },
        handleResize() {
            this.height = document.documentElement.clientHeight - this.boxTop - 125;
        },
        deleteSupplier(id) {
            this.$confirm(`您确认要删除此供应商吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSupplier({
                    id: id,
                }).then(res => {
                    this.$message.success('删除成功！');
                    this.fetchData();
                })
            }).catch(() => {})
        }
    }
}

</script>

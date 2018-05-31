<template>
	<el-form-item class="postInfo-container-item">
		<div class="price-config" style="width: 600px">
			<div class="item">
				<el-select v-model="supplierId" size="medium" placeholder="请选择供应商" style="width: 150px;">
					<el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-input v-model="length" size="medium" placeholder="请输入串码长度" style="width: 150px;"></el-input>
				<el-button size="medium" type="primary" @click="addSupplier()">添加供应商</el-button>
			</div>
			<el-table max-height="300px" :data="selectData" element-loading-text="Loading" border fit highlight-current-row style="marginTop: 10px">
				<el-table-column label="供应商" align="center">
					<template slot-scope="scope">
						{{scope.row.supplierName}}
					</template>
				</el-table-column>
				<el-table-column label="串码长度" align="center">
					<template slot-scope="scope">
						{{scope.row.length}}
					</template>
				</el-table-column>
				<el-table-column label="串码" align="center">
					<template slot-scope="scope">
						<a href="#" style="color: #409EFF" @click="openNumberDialog(scope.$index)">查看串码</a>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<a href="#" style="color: #409EFF" @click="deleteData(scope.$index)">删除</a>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog title="查看串码" :visible.sync="ifDialog" width="600px" v-if="ifDialog">
			<el-input type="textarea" :autosize="{minRows: 2, maxRows: 10}" placeholder="请输入串码，串码间无需分隔" v-model="number"></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="commitNumber">提 交</el-button>
				<el-button type="primary" @click="ifDialog = false">关 闭</el-button>
			</div>
		</el-dialog>
	</el-form-item>
</template>
<script>
import { getSupplier } from '@/api/supplier';

export default {
	props: {
		selectData: {
			type: Array,
			default () {}
		}
	},
	data() {
		return {
			supplierList: [],
			supplierId: '',
			length: '',
			number: '',
			ifDialog: false,
			index: ''
		}
	},
	created() {
		this.getSupplier();
	},
	methods: {
		getSupplier() {
			getSupplier().then(res => {
				this.supplierList = res.returnValue;
			})
		},
		addSupplier() {
			if (!this.supplierId) {
				this.$message.warning('请选择供应商');
				return;
			}
			if (!this.length) {
				this.$message.warning('请输入串码');
				return;
			}
			if (this.selectData.findIndex(item => item.id == this.supplierId) > -1) {
				this.$message.warning('不可重复选择供应商，请重新选择');
				return;
			}
			const supplierId = this.supplierId,
				supplier = this.supplierList.find(item => item.id == supplierId);
			this.selectData.push({
				supplierId: supplier.id,
				supplierName: supplier.name,
				length: this.length,
				number: ''
			});
			this.supplierId = '';
			this.length = '';
		},
		deleteData(index) {
			this.selectData.splice(index, 1);
		},
		openNumberDialog(index) {
			this.index = index;
			this.number = this.selectData[index].number;
			this.ifDialog = true;
		},
		commitNumber() {
			this.selectData[this.index].number = this.number;
			this.index = '';
			this.number = '';
			this.ifDialog = false;
		}
	}
}

</script>
<style lang="scss" scoped>
.el-table {
	input {
		text-align: center;
	}
}

</style>

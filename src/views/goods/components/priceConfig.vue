<template>
	<el-form-item class="postInfo-container-item">
		<div class="price-config" style="width: 600px">
			<el-table :data="selectData" element-loading-text="Loading" border fit highlight-current-row>
				<el-table-column label="会员等级" align="center">
					<template slot-scope="scope">
						{{scope.row.level}} 级
					</template>
				</el-table-column>
				<el-table-column label="全国价格" align="center">
					<template slot-scope="scope">
						<input v-model="scope.row.price"></input> 元
					</template>
				</el-table-column>
				<el-table-column label="省内价格" align="center">
					<template slot-scope="scope">
						<input v-model="scope.row.provincePrice"></input> 元
					</template>
				</el-table-column>
			</el-table>
		</div>
	</el-form-item>
</template>
<script>
	export default {
		props: {
			selectData: {
				type: Array,
				default() {}
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
<template>
	<div class="app-container">
        <el-form class="form-container" ref="dataForm">
                <!-- 通知公告 -->
            <el-row>
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="notice" label="通知公告" class="postInfo-container-item">
                        <el-input type="textarea" :rows="4" size="medium" v-model="notice.content" placeholder="请输入通知公告" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
                <!-- 合作须知 -->
            <el-row>
                <el-col :span="24">
                    <el-form-item label-width="100px" prop="cooperation" label="合作须知" class="postInfo-container-item">
                        <el-input type="textarea" :rows="4" size="medium" v-model="cooperation.content" placeholder="请输入合作须知" style="width: 400px">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="sub-navbar draft">
            <el-button type="primary" @click="update">保 存</el-button>
        </div>
    </div>
</template>
<script>
import { getNotice, updateNotice } from '@/api/system';
export default {
	name: 'system',
	data() {
		return {
			notice: {
				id: '',
				type: '',
				content: ''
			},
			cooperation: {
				id: '',
				type: '',
				content: ''
			}
		}
	},
	created() {
		this.getNotice();
		this.getCooperation();
	},
	methods: {
		getNotice() {
			getNotice({
				type: 1
			}).then(res => {
				this.notice = res.returnValue;
			})
		},
		getCooperation() {
			getNotice({
				type: 2
			}).then(res => {
				this.cooperation = res.returnValue;
			})
		},
		update() {
			Promise.all([this.updateNotice(), this.updateCooperation()]).then(results => {
				this.$message.success('已保存');
			})
		},
		updateNotice() {
			return new Promise((resolve, reject) => {
				updateNotice({
					id: this.notice.id,
					type: 1,
					content: this.notice.content
				}).then(res => {
					resolve();
				}).catch(res => {
					reject();
				})
			})
		},
		updateCooperation() {
			return new Promise((resolve, reject) => {
				updateNotice({
					id: this.cooperation.id,
					type: 2,
					content: this.cooperation.content
				}).then(res => {
					resolve();
				}).catch(res => {
					reject();
				})
			})
		}
	}
}

</script>

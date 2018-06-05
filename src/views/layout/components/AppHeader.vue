<template>
	<div class="app-header" v-if="show">
		<div class="app-name">
			<p>管理后台</p>
        </div>
		<div class="top-right">
			<section class="date">
				<p>{{date}}</p>
				<p class="user">
					<span>当前用户：{{username}}</span>
					<el-button size="mini" type="primary" @click.prevent="logout">退出</el-button>
				</p>
			</section>
		</div>
	</div>
</template>
<script>
export default {
	computed: {
		date: function() {
			const myDate = new Date(),
				week = ['日', '一', '二', '三', '四', '五', '六'];
			return myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日' + ' 星期' + week[myDate.getDay()];
		},
		username: function() {
			return this.$store.state.user.name || 'Sky';
		},
		show: function() {
			return (this.$route.name != 'login' && this.$route.name != 'error');
		}
	},
	methods: {
		logout() {
			this.$store.dispatch('LogOut').then(() => {
				location.reload();
			})
		}
	}
}

</script>
<style lang="scss" scoped>
.app-header {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 75px;
	color: white;
	background-color: #72768f;
	z-index: 100;
	.app-name {
		padding: 0;
		margin: 0;
		float: left;
		height: 75px;
		text-align: left;
		margin-left: 30px;
		p {
			font-size: 30px;
			margin: 0;
			line-height: 75px;
			letter-spacing: 5px;
		}
	}
	.top-right {
		float: right;
		margin-right: 30px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		.date {
			font-size: 16px;
			p {
				margin: 10px;
			}
			.el-button {
				margin-left: 10px;
			} // 	.user a {
			// 		margin-left: 10px;
			// 		color: #409EFF;
			// 	}
		}
	}
}

</style>

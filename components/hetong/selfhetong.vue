<template> 
	<view class=""> 
		<!-- 插件预览pdf -->
		<web-view :src="slefurl">个人借款合同</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return { 
				slefurl: ''
			}
		},
		onLoad() {
			this.slefurl = 'http://msbuc.oss-cn-shenzhen.aliyuncs.com/documentation/LoanContract.pdf'
		},
		onBackPress(options) {
			//监听返回按钮 
			if (options.from === 'navigateBack') { 
				return false;
			}
			this.back();
			return true;
		},
		methods: { 
			//监听返回按钮执行的方法
			back() {
				uni.navigateTo({
					url: '/pages/agreview/agreview'
				});
			},
		}
	}
</script>

<style>
</style>

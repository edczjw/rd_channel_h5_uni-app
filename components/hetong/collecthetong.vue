<template>
	<view class=""> 
		<!-- 插件预览pdf -->
		<web-view :src="collecturl">个人信息采集授权书</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				collecturl: '',
			}
		},
		onLoad() {
			this.collecturl = 'http://msbuc.oss-cn-shenzhen.aliyuncs.com/documentation/InfoCollectContract.pdf'
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

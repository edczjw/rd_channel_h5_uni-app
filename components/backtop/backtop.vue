<template> 
	<view>
		<u-back-top :scroll-top="deliverscrollTop" :custom-style="cusTyle" top="400" icon="arrow-up"></u-back-top> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cusTyle: {
					backgroundColor: '#eee'
				}
			}
		},
		props:{
			deliverscrollTop:Number,
		},
	};
</script>

<style> 
</style>

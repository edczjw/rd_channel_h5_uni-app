<template>
	<view class="">
		<u-notice-bar mode="horizontal" :speed="200" type="error" :list="list"></u-notice-bar>
	</view>
</template>

<script>
	export default {
			data() {
				return {
					list: [
						'带有符号  *  的为必填输入',
					]
				}
			}
		}
</script>

<style>
</style>

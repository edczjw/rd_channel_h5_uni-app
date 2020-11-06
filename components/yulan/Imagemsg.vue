<template>
	<!-- 影像信息 -->
	<view class="loanImgview loancommon">
		<view class="loantitle">
			影像信息
		</view>
		<view class="wrap"> 
			<u-swiper :list="listImage" indicator-pos="bottomCenter" :title="true" :effect3d="true">
				<view class="u-swiper-title u-line-1">
					111
				</view>
			</u-swiper> 
		</view>
	</view> 
</template>

<script>
	export default{
		data(){
			return{
				listImage:[]
			}
		},
		props:{
			image:Array
		},
		watch: { 
			//必须监听  不然不会更新
			image (newV, oldV) {
				this.listImage = newV
			}
		},
		mounted() { 
			this.listImage = this.image; 
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped> 
	.u-field{
		padding: 10px 0;
	} 
	.wrap {
		padding: 40rpx;
	}
</style>

<template>
	<view class="app_wrap_view">
		<!-- 三大板块 -->
		<loanPeomsg :custList="custList"></loanPeomsg>
		<loanmsg :loan="loan"></loanmsg>
		<Imagemsg :image="image"></Imagemsg> 
		
		<!-- 按钮 -->
		<view class="tiheight" style="background-color: #f3f9fc;"></view>
		<!-- 底部按钮 -->
		<view class="footer_button">
			<view class="btn" @click="handleSubmit">
				确认提交
			</view>
		</view>
		<u-toast ref="uToast" /> 
		<u-top-tips ref="uTips"></u-top-tips>
		<back-top :deliverscrollTop="scrollTop"></back-top>
	</view>
</template>

<script>
	import loanPeomsg from '../../components/yulan/loanPeomsg.vue'
	import loanmsg from '../../components/yulan/loanmsg.vue'
	import Imagemsg from '../../components/yulan/Imagemsg.vue' 
	import backTop from '@/components/backtop/backtop.vue'
	export default {
		data(){
			return{
				scrollTop:0,
				mobile:"广东省", 
				
				custList:[],
				image:[],
				loan:{}
			}
		},
		components: { 
			loanPeomsg,
			loanmsg,
			Imagemsg,
			backTop
		},
		//下拉刷新监听
		onPullDownRefresh (){ 
			console.log('下拉刷新开始');
			this.getMsg()
			var _that = this
			setTimeout(function () {
				uni.stopPullDownRefresh();
				_that.$refs.uTips.show({
					title: '刷新成功',
					type: 'success',
					duration: '1000'
				}) 
			}, 1000);
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		created() { 
			this.getMsg()
		}, 
		methods:{
			//确认提交
			handleSubmit(){  
				for (let key in this.loan) {
					if(this.loan[key] === "" || !this.loan[key]){
						this.$refs.uTips.show({
							title: key+'不能为空！',
							type: 'error',
							duration: '2300'
						}) 
						return false
					}
				}
				uni.navigateTo({
					url: '/pages/agreview/agreview'
				});
			},
			getMsg(){
				let clerk = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token'),
					template = Date.now()
				this.$http.get('/v1/channel/jm/preview', {
					params:{
						clerk:clerk,
						template:template
					},
					header: {token},
				}).then(res => {
						var resp = res.data
						if(resp.code === 200){  
								this.custList = resp.data.custList
								this.image = resp.data.imageList
								this.loan = resp.data.loan 
						}else if(resp.code === 401){
							this.$refs.uTips.show({
								title: '登录已失效，请重新登录',
								type: 'error',
								duration: '2300'
							}) 
							//搭配提示延时跳转至引导页
							setTimeout(()=>{ 
								uni.navigateTo({
									url: '/pages/index/index'
								});
							},2300)
						}else{
							this.$refs.uTips.show({
								title: resp.msg,
								type: 'error',
								duration: '2300'
							}) 
						}
				}).catch(err => { 
						this.$refs.uTips.show({
							title: err,
							type: 'warning',
							duration: '2300'
						}) 
				})
			},
			//借款用途
			handleConfirm(e){ 
				this.form.sex = this.selectorObj[parseInt(e[0])].name
			},
		}
	}
</script>

<style lang="scss">
	.app_wrap_view{
		width: 100%;
		height: 100%;
		padding: 31upx; 
		.loancommon{
			padding: 51upx;
			background-color: #ffffff;
			border: 1px solid #e2edf7;
			margin: 0 0 31upx;  
			position: relative;
			box-shadow: 0 0 10upx 2upx #eee;
		}
		.loanPeoview{
			flex: 1;
			width: 100%; 
		}
		.loanMsgview{
			flex: 1;
			width: 100%;   
		}
		.loanImgview{
			flex: 1;
			width: 100%; 
		}
		
		.msgview{
			padding: 10upx 0;
			display: flex; 
			white-space:nowrap;
			word-wrap: break-word;
			overflow-x: scroll;
			width: 100%;
			flex-wrap: wrap;
			align-items: center;
		}
		
	}
</style>

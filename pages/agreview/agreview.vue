<template>
	<view class="arge_box">
		<view class="arge_title">
			将进行以下两份协议的签署
		</view>
		<u-checkbox-group :wrap="true">
			<u-checkbox size="36" label-size="36" v-model="checked" shape="circle" :label-disabled="true" active-color="#19a9ba">
					<!-- <navigator url="../../components/hetong/selfhetong" style="color:#2b85e4;text-decoration: underline;">《个人借款合同》</navigator> -->
					<u-link href="http://msbuc.oss-cn-shenzhen.aliyuncs.com/documentation/LoanContract.pdf">《个人借款合同》</u-link>
			</u-checkbox>
			
			<u-checkbox size="36" label-size="36" v-model="checked1" shape="circle" :label-disabled="true" active-color="#19a9ba">
					<!-- <navigator url="../../components/hetong/collecthetong" style="color:#2b85e4;text-decoration: underline;">《个人信息采集授权书》</navigator> -->
					<u-link href="http://msbuc.oss-cn-shenzhen.aliyuncs.com/documentation/InfoCollectContract.pdf">《个人信息采集授权书》</u-link> 
			</u-checkbox>
		</u-checkbox-group>
		
		<!-- 底部按钮 -->
		<view class="footer_button">
			<view class="btn" @click="makeSure">
				确定签约
			</view>
		</view>  
		
		<!-- 验证码模态框 -->
		<codeMdfin :deliverShowyz="showyz" :deliverText="text" :deliversignCustList="signCustList" :deliverForm="form" @cancelChowyz="cancelChowyz"></codeMdfin>
		
		<!-- 提示信息 -->
		<u-toast ref="uToast" /> 
		<u-top-tips ref="uTips"></u-top-tips>
		
		<!-- 已结束签约流程弹窗 -->
		<u-modal v-model="showEnd" :content="contentEnd" :title-style="{color: 'red'}" width="90%" @cancel="returnHome" :show-cancel-button="true" cancel-text="返回引导页" :show-confirm-button="false"></u-modal>
	</view>
</template>

<script> 
	//验证码模态框
	import codeMdfin from '@/components/code-model/codeMdfin.vue'
	export default {
		data() {
			return { 
				showEnd:false,
				contentEnd:'您已完成合同签署，请返回引导页。',
				text:"", 
				checked: true,
				checked1: true,
				showyz: false, 
				form:{
					clerk:"",
					custType:"", 
				},
				signCustList:[],//借款发短信集合
			}
		},
		components:{
			codeMdfin
		},
		onBackPress(options) {
			//监听返回按钮
			if (options.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		mounted() { 
		},
		methods: {
			//签约结束返回引导页
			returnHome(){ 
				//搭配提示延时跳转至引导页
				setTimeout(()=>{ 
					uni.navigateTo({
						url: '/pages/mainMenu/mainHome'
					});
				},2300)
			},
			//获取待签约客户类型
			getnextSign(){
				let clerk = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
				let data = {
					clerk: clerk
				}
				this.$http.post('/v1/channel/jm/nextSignCust',data,{header: {token}}).then(res=>{ 
					var resp = res.data
					if(resp.code === 200){ 
						
						//赋值给custType
						this.form.custType = resp.data
						
						//判断显示类型
						if(resp.data === '0'){
							this.showEnd = true
						}else if(resp.data === '1'){
							//显示弹框
							this.showyz = true
							//调接口
							this.sendyzm()
							this.text = '请输入借款人收到的合同签署验证码'
						}else if (resp.data === '2') {
							//显示弹框
							this.showyz = true
							//调接口
							this.sendyzm()
							this.text = '请输入共同借款人收到的合同签署验证码'
						} else if (resp.data === '3') {
							//显示弹框
							this.showyz = true
							//调接口
							this.sendyzm()
							this.text = '请输入担保人（一）收到的合同签署验证码'
						} else if (resp.data === '4') {
							//显示弹框
							this.showyz = true
							//调接口
							this.sendyzm()
							this.text = '请输入担保人（二）收到的合同签署验证码'
						} 
					}else if(resp.code === 401){
						this.showloading = false
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
						this.showloading = false
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
			//监听返回按钮执行的方法
			back() {
				uni.navigateTo({
					url: '/pages/mainMenu/mainHome'
				});
			},
			
			//点击确定签署
			makeSure() {
				//是否勾选
				if(!this.checked || !this.checked1){
					this.$refs.uTips.show({
						title: '请勾选并同意签署《个人借款合同》《个人信息采集授权书》!',
						type: 'error',
						duration: '2300'
					})
				}else{ 
					//获取当前状态值
					this.getnextSign()
				}
			},
			
			//获取合同编号
			sendyzm(){
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
				let data = {
					clerk:mobile
				}
				this.$http.post('/v1/channel/jm/signContrAndAuth', data,{header: {token}}).then(res => {
						var resp = res.data
						if(resp.code === 200){ 
							//将合同号存入缓存
							uni.setStorageSync('contrNo',resp.data.contrNo)  
							//调用发送验证码
							this.submit()
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
			
			//首次提交发送短信验证码接口
			submit(){
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
					this.form.clerk = mobile 
				this.$http.post('/v1/channel/jm/sendSignCode', this.form,{header: {token}}).then(res => {
						var resp = res.data
						if(resp.code === 200){   
							console.log('借款人验证码发送成功')
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
			
			cancelChowyz(e) {
				this.showyz = e
			},
		}
	}
</script>

<style lang="scss">
	.arge_box {
		padding: 31upx;

		.arge_title {
			margin-bottom: 30upx;
			font-size: 32upx;
		}
	}
</style>

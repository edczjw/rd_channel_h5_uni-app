<template>
	<view class=""> 
		<view class="code_model">
				<!-- 自动以键盘 -->
				<u-keyboard :safe-area-inset-bottom="true" :tooltip="false" :mask-close-able="false" ref="uKeyboard" @change="valChange" @backspace="backspace" mode="number" :dot-enabled="false" v-model="deliverShowyz"> 			
				<view class="iner_kb">
					<view class="modelText">
						<u-icon name="info-circle"></u-icon>{{deliverText}}
					</view>
					<view class="cd_ip">
							<u-message-input :maxlength="6" :disabled-keyboard="true" :focus="true" :breathe="true" :value="code"></u-message-input>
					</view> 
					<view class="cm_fot">
						<view class="cacel" @click="cancel">取消</view>
						<view class="subm" @click="submit">确定</view>
					</view>
				</view>
				</u-keyboard>
		<!-- 提示信息 -->
		<u-toast ref="uToast" />
		<u-top-tips ref="uTips"></u-top-tips>
		</view> 
	</view>
</template>

<script>
	export default{
		data(){
			return{
				code:"",
			}
		},
		props:{
			deliverText:String,
			deliverShowyz:Boolean, 
			deliverForm:Object
		}, 
		methods:{
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.code.length<6){ 
					this.code += val; 
					this.deliverForm.validCode = this.code
				}
			},
			// 退格键被点击
			backspace() {
				// 删除value的最后一个字符
				if(this.code.length) this.code = this.code.substr(0, this.code.length - 1);
				this.deliverForm.validCode = this.code 
			},
			submit(){  
				let token = uni.getStorageSync('storage_token')
				 if(this.deliverForm.validCode.length===6){
					 this.$http.post('/v1/channel/jm/addCust', this.deliverForm,{header: {token}}).then(res => {
					 		var resp = res.data
					 		if(resp.code === 200){ 
					 			this.$refs.uTips.show({
					 				title: '提交成功！',
					 				type: 'success',
					 				duration: '2300'
					 			}) 
								//搭配提示延时跳转至引导页
								if(this.deliverForm.custType === 1){ 
									setTimeout(()=>{ 
										uni.navigateTo({
											url: '/pages/applyInfo/commonApplypeople'
										});
									},2300)
								}else if(this.deliverForm.custType === 2){ 
									setTimeout(()=>{ 
										uni.navigateTo({
											url: '/pages/applyInfo/danBaopeo1'
										});
									},2300)
								}else if(this.deliverForm.custType === 3){ 
									setTimeout(()=>{ 
										uni.navigateTo({
											url: '/pages/applyInfo/danBaopeo2'
										});
									},2300)
								}else if(this.deliverForm.custType === 4){ 
									setTimeout(()=>{ 
										uni.navigateTo({
											url: '/pages/applyMsgdetail/loanMsg'
										});
									},2300)
								}else{
									setTimeout(()=>{
										uni.navigateTo({
											url: '/pages/mainMenu/mainHome'
										});
									},2300)
								}
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
				 }else{
					 this.$refs.uTips.show({
					 	title: '请输入6位数字验证码！',
					 	type: 'error',
					 	duration: '2300'
					 }) 
				 }
			}, 
			cancel(){
				this.code = ""
				this.$emit("cancelChowyz", false);
			}
		}
	}
</script>

<style lang="scss">
@import "common/css/color.scss";
.u-tips{
	z-index: 9999999 !important;
}
.iner_kb{
	margin: 20px 0;
	padding: 0 31upx 40upx;
}
.code_model{
	padding: 30upx 32upx; 
	text-align: center;
	z-index: 9999999;
	.cd_ip{
		margin-top: 40upx;
	}
	.cm_fot{
		margin-top: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 80upx;
		line-height: 80upx;
		.cacel{
			flex: 1; 
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #eee;
		}
		.subm{
			flex: 1;
			color: #fff;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: $wholecolor;
		}
		.subm:active{
			color: #eee;
			background-color: #aaf0ff; 
		}
	}
}
</style>

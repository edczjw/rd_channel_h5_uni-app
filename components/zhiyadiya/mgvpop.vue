<template>
	<view class="collapse_box_inner">
			<u-form :model="formmortgageVO" ref="uFormmgv" label-width="185" :borderBottom="false" label-position="top">
				<u-form-item label="* 名称" prop="name">
					<u-input v-model="formmortgageVO.name" border input-align="left" placeholder="请输入名称"/>
				</u-form-item>
				<u-form-item label="* 品牌" prop="brand">
					<u-input v-model="formmortgageVO.brand" border input-align="left" placeholder="请输入品牌"/>
				</u-form-item>
				<u-form-item label="* 规格型号" prop="model">
					<u-input v-model="formmortgageVO.model" border input-align="left" placeholder="请输入规格型号"/>
				</u-form-item>
				<u-form-item label="* 面积尺寸" prop="area">
					<u-input v-model="formmortgageVO.area" border input-align="left" placeholder="请输入面积尺寸"/>
				</u-form-item> 
				<u-form-item label="* 所在位置">
					<u-input v-model="formmortgageVO.location" border input-align="left" placeholder="请输入所在位置"/>
				</u-form-item> 
				<u-form-item label="* 登记所有权人">
					<u-input v-model="formmortgageVO.ownership" border input-align="left" placeholder="请输入登记所有权人"/>
				</u-form-item> 
				<u-form-item label="* 其他">
					<u-input v-model="formmortgageVO.other" border input-align="left" placeholder="请输入其他信息"/>
				</u-form-item> 
			</u-form>   
			<view class="piced">
				<u-upload :action="action" :file-list="fileList" :form-data="formdata2" :header="header" @on-success="onSuccess2" :show-tips="false" @on-remove="onRemove2" :max-size="5 * 1024 * 1024"
				max-count="1"></u-upload> 
				<text style="color: #ee461c;">[ 抵押品权证页 ]</text>
			</view> 
			<!-- 提示信息 -->
			<u-toast ref="uToast" /> 
			<u-top-tips ref="uTips"></u-top-tips>
			
			<u-button type="primary" @click="submitMlo">提交抵押信息</u-button>
	</view>
</template>

<script>  
	export default{
		data(){
			return{
				//抵押
				formmortgageVO:{
					area:"",
					brand:"",
					clerk:"",
					imageUrl:"",
					location:"",
					model:"",
					name:"",
					other:"",
					ownership:"",
				},
				action: '/v1/channel/jm/uploadFile',
				fileList: [],//图片列表
				header:{
					token:""
				},//上传头
				//抵押照
				formdata2:{
					clerk:"", 
					fileType:3,
					node:5
				}
			}
		}, 
		mounted() { 
			this.getformmortgageVO()
			//获取token
			this.header.token = uni.getStorageSync('storage_token')  
			this.formdata2.clerk = uni.getStorageSync('storage_clerk') 
			this.formmortgageVO.clerk = uni.getStorageSync('storage_clerk')  
		},
		methods:{ 
			getformmortgageVO(){
				if(uni.getStorageSync('formmortgageVO')){
					this.formmortgageVO = JSON.parse(uni.getStorageSync('formmortgageVO')) 
				}
			},
			//提交抵押
			submitMlo(){ 
				if(!this.formmortgageVO.area.length || !this.formmortgageVO.brand.length ||!this.formmortgageVO.clerk.length ||!this.formmortgageVO.imageUrl.length ||!this.formmortgageVO.location.length ||!this.formmortgageVO.model.length ||!this.formmortgageVO.name.length ||!this.formmortgageVO.other.length ||!this.formmortgageVO.ownership.length){
					this.$refs.uToast.show({
						title: '请补齐抵押信息！',
						type: 'error'
					})
				}else{
					let mobile = uni.getStorageSync('storage_clerk'),
						token = uni.getStorageSync('storage_token')
						this.formmortgageVO.clerk = mobile
					this.$http.post('/v1/channel/jm/addMortgage', this.formmortgageVO,{header: {token}}).then(res => {
							var resp = res.data
							if(resp.code === 200){  
								//将质押记录存入缓存中
								uni.setStorageSync('formmortgageVO',JSON.stringify(this.formmortgageVO))
								this.$refs.uToast.show({
									title: '提交抵押信息成功！',
									type: 'success'
								})
								//给父组件发信号状态置为已添加
								//子组件触发父组件方法
								this.$emit('changemortgageVO',1)
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
				}
			},
			//抵押照上传成功动作
			onSuccess2(e) { 
				if(e.code === 200){ 
					this.formmortgageVO.imageUrl = e.data
					this.$refs.uToast.show({
						title: '抵押照上传成功！',
						type: 'success'
					})
				}else if(e.code === 401){
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
				}
				else{
					this.$refs.uToast.show({
						title: e.msg,
						type: 'error'
					})
				}
			},
			onRemove2(index, lists) {
				this.formmortgageVO.imageUrl = ""
				this.$refs.uToast.show({
					title: '图片已被移除',
					type: 'success'
				})
			},
		}
	}
</script>

<style lang="scss" scoped> 
	@import "common/css/color.scss";
	uni-modal{
		z-index: 99999999999 !important;
	}
	.piced{ 
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;   
		border: 2upx dashed $wholecolor;
		padding: 20upx;
		margin-bottom: 40rpx;
	} 
	.u-collapse-body{ 
		height: 100% !important;
	} 
	.collapse_box_inner{ 
		padding: 35upx 55upx;
	}
	.u-collapse-item{ 
		margin: 40upx 0;  
		border-bottom: 2upx solid #eee;
	}
</style>

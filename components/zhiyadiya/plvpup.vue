<template>
	<view class="collapse_box_inner">
				<u-form :model="formpledgeVO" ref="uFormplv" label-width="185" :borderBottom="false" label-position="top">
					<u-form-item label="* 名称" prop="name">
						<u-input v-model="formpledgeVO.name" border input-align="left" placeholder="请输入名称"/>
					</u-form-item>
					<u-form-item label="* 标的性质" prop="type">
						<u-input v-model="formpledgeVO.type" border input-align="left" placeholder="请输入标的性质"/>
					</u-form-item>
					<u-form-item label="* 标的价值" prop="worth">
						<u-input v-model="formpledgeVO.worth" border input-align="left" placeholder="请输入标的价值"/>
					</u-form-item>
					<u-form-item label="* 登记所有权人" prop="ownership">
						<u-input v-model="formpledgeVO.ownership" border input-align="left" placeholder="请输入登记所有权人"/>
					</u-form-item> 
					<u-form-item label="* 其他" prop="other">
						<u-input v-model="formpledgeVO.other" border input-align="left" placeholder="请输入其他信息"/>
					</u-form-item> 
				</u-form>   
				<view class="piced">
					<u-upload ref="loadimg" :action="action" :file-list="fileList" :form-data="formdata1" :header="header" @on-success="onSuccess1" :show-tips="false" @on-remove="onRemove1" :max-size="5 * 1024 * 1024"
	max-count="1"></u-upload> 
					<text style="color: #ee461c;">[ 质押品权证页 ]</text>
				</view>
				
				<u-button type="primary" @click="submitplo">提交质押信息</u-button>
			<!-- 提示信息 -->
			<u-toast ref="uToast" /> 
			<u-top-tips ref="uTips"></u-top-tips>
			</view>
</template>

<script> 
	export default{
		data(){
			return{
				//质押
				formpledgeVO:{
					clerk:"",
					imageUrl:"",
					name:"",
					other:"",
					ownership:"",
					type:"",
					worth:""
				},
				action: '/v1/channel/jm/uploadFile',
				fileList: [],//图片列表
				header:{
					token:""
				},//上传头s
				//质押照
				formdata1:{
					clerk:"", 
					fileType:4,
					node:5
				}, 
			}
		},
		mounted() { 
			//获取缓存中的记录
			this.getformpledgeVO();
			
			//获取token
			this.header.token = uni.getStorageSync('storage_token') 
			this.formdata1.clerk = uni.getStorageSync('storage_clerk') 
			this.formpledgeVO.clerk = uni.getStorageSync('storage_clerk')   
		},
		methods:{ 
			getformpledgeVO(){
				if(uni.getStorageSync('formpledgeVO')){ 
					this.formpledgeVO = JSON.parse(uni.getStorageSync('formpledgeVO')); 
				}
			},
			//提交质押信息
			submitplo(){ 
				if(!this.formpledgeVO.clerk.length || !this.formpledgeVO.imageUrl.length ||!this.formpledgeVO.name.length ||!this.formpledgeVO.other.length ||!this.formpledgeVO.ownership.length ||!this.formpledgeVO.type.length ||!this.formpledgeVO.worth.length){
					this.$refs.uToast.show({
						title: '请补齐质押信息！',
						type: 'error'
					})
				}else{
					let mobile = uni.getStorageSync('storage_clerk'),
						token = uni.getStorageSync('storage_token')
						this.formpledgeVO.clerk = mobile
					this.$http.post('/v1/channel/jm/addPledge', this.formpledgeVO,{header: {token}}).then(res => {
							var resp = res.data
							if(resp.code === 200){  
								//将质押记录存入缓存中
								uni.setStorageSync('formpledgeVO',JSON.stringify(this.formpledgeVO))
								//给父组件发信号状态置为已添加
								//子组件触发父组件方法
								this.$emit('changedgeVO',1)
								this.$refs.uToast.show({
									title: '提交质押信息成功！',
									type: 'success'
								})
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
			//质押照上传成功动作
			onSuccess1(e) { 
				if(e.code === 200){ 
					this.formpledgeVO.imageUrl = e.data
					this.$refs.uToast.show({
						title: '质押照上传成功！',
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
			onRemove1(index, lists) {
				this.formpledgeVO.imageUrl = ""
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
		padding: 70upx;
	}
	.u-collapse-item{ 
		margin: 40upx 0;  
		border-bottom: 2upx solid #eee;
	}
</style>

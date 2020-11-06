<template>
	<!-- 借款人信息和共同借款人信息资料录入 -->
	<view class="app_wrap">
		<u-tag text="担保人(二)基本信息" />
		<u-form :model="form" ref="uForm" label-width="135" :borderBottom="false" label-position="top">
			<u-form-item label="* 姓名" prop="name">
				<u-input v-model="form.name" border input-align="left" placeholder="请输入姓名" />
			</u-form-item>
			<u-form-item label="* 身份证号" prop="idNo">
				<u-input v-model="form.idNo" border maxlength="18" input-align="left" placeholder="请输入身份证号" />
			</u-form-item>
			<u-form-item label="* 联系电话" prop="mobile">
				<u-input v-model="form.mobile" border maxlength="11" input-align="left" placeholder="请输入联系电话" />
			</u-form-item>
			<u-form-item label="* 电子邮箱" prop="email">
				<u-input v-model="form.email" border input-align="left" placeholder="请输入电子邮箱" />
			</u-form-item>
			<u-form-item label="* 联系地址">
				<u-input v-model="form.address" disabled border @click="active = true" input-align="left" placeholder="请选择省市区" />
			</u-form-item>
			<u-form-item label="* 详细地址" prop="addressDetail">
				<u-input type="textarea" auto-height border v-model="form.addressDetail" input-align="left" placeholder="请输入具体地址" />
			</u-form-item>
		</u-form>

		<u-gap height="80" bg-color="#fff"></u-gap>
		<u-tag text="上传影像信息" />
		<view class="app_pic app_border">
			<view class="pic">
				<text>* 身份证照片面</text>
				<u-upload :action="action" :file-list="fileList" :form-data="formdata1" :header="header" @on-success="onSuccess" :show-tips="false" @on-remove="onRemove1" :max-size="5 * 1024 * 1024"
				 max-count="1"></u-upload>
			</view>
			<view class="pic">
				<text>* 身份证国徽面</text>
				<u-upload :action="action" :file-list="fileList" :form-data="formdata2" :header="header"   @on-success="onSuccess1" :show-tips="false" @on-remove="onRemove2" :max-size="5 * 1024 * 1024"
				 max-count="1"></u-upload>
			</view>
		</view>
		<!-- 验证码模态框 -->
		<cdModel :deliverText="text" :deliverShowyz="showyz" :deliverForm="form" @cancelChowyz="cancelChowyz"></cdModel>

		<view class="tiheight"></view>
		<!-- 底部按钮 -->
		<view class="footer_button">
			<view class="btn" @click="nextbu">下一步</view>
			<view class="btn_No" @click="outMh">暂不添加</view> 
		</view>
		<!-- 提示信息 -->
		<u-toast ref="uToast" />

		<!-- 省市区 -->
		<pca-picker limitRegion="areasCode" :active.sync="active"  @change="change" :defaultValue="defaultValue"></pca-picker>
		
		<back-top :deliverscrollTop="scrollTop"></back-top>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import backTop from '@/components/backtop/backtop.vue'
	//验证码模态框
	import cdModel from '@/components/code-model/codeModel.vue'
	import rules from '../../common/js/rules.js'
	// 省市区联动
	import pcaPicker from '@/components/pca-picker/pca-picker.vue'
	export default {
		data() {
			return {
				scrollTop:0,
				showyz: false, 
				text: '请输入担保人（二）收到的进行实名认证验证码',
				addressDetail: "", //具体地址
				// 演示地址，请勿直接使用
				action: '/v1/channel/jm/uploadFile',
				fileList: [], //图片列表
				form: {
					name: '',
					idNo: '',
					mobile: '',
					email: '',
					address: '',
					addressDetail: "", //具体地址
					idFront:"",
					idBack:"",
					validCode:"",//验证码
					flowId:"",//流水号
					custType:4,//类型
					clerk:""
				},
				header:{
					token:""
				},//上传头
				
				//正面照
				formdata1:{
					clerk:"", 
					fileType:1,
					node:4
				},
				//国徽照
				formdata2:{
					clerk:"", 
					fileType:2,
					node:4
				},
				active: false,
				defaultValue: {
					provinceCode: '', //省code
					citiesCode: '', //市code
					areasCode: '', //区code 
				},
				rules: {}
			}
		}, 
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() { 
			//获取token
			this.formdata1.clerk = uni.getStorageSync('storage_clerk')  
			this.formdata2.clerk = uni.getStorageSync('storage_clerk') 
			this.header.token = uni.getStorageSync('storage_token') 
		},
		onBackPress(options) {
			//监听返回按钮 
			if (options.from === 'navigateBack') { 
				return false;
			}
			this.back();
			return true;
		},
		components: {
			cdModel,
			pcaPicker,
			backTop
		},
		onReady() {
			this.rules = rules
			this.$refs.uForm.setRules(this.rules);
			//获取token
			this.header.token = uni.getStorageSync('storage_token') 
			this.formdata1.clerk = uni.getStorageSync('storage_clerk')  
			this.formdata2.clerk = uni.getStorageSync('storage_clerk') 
		},
		methods: { 
			//暂不添加
			outMh(){
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
					
				let data = {
					clerk:mobile,
					custType:this.form.custType
				}
				this.$http.put('/v1/channel/jm/skipCust', data,{header: {token}}).then(res => {
						var resp = res.data
						if(resp.code === 200){  
							uni.navigateTo({
								url: '/pages/applyMsgdetail/loanMsg'
							});
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
			//下一步
			nextbu(){
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if(this.form.addressDetail === "" || this.form.idFront === "" || this.form.idBack === ""){
							this.$refs.uToast.show({
								title: '请补齐信息！',
								type: 'error'
							})
						}else{  
							this.sendYm()
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			
			//发送三要素验证码
			sendYm(){
				let clerk = uni.getStorageSync('storage_clerk')
				let data = {
					idNo:this.form.idNo,
					mobile:this.form.mobile,
					name:this.form.name,
					clerk:clerk
				}
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
				this.$http.post('/v1/channel/jm/sendValidCode', data,{header: {token}}).then(res => {
						var resp = res.data
						if(resp.code === 200){ 
							this.form.clerk = mobile
							//赋值流水号
							this.form.flowId = resp.data.flowId
							//显示模态框
							this.showyz = true 
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
			//正面照上传成功动作
			onSuccess(e) { 
				if(e.code === 200){ 
					this.form.idFront = e.data
					this.$refs.uToast.show({
						title: '上传成功！',
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
			//正面照上传成功动作
			onSuccess1(e) { 
				if(e.code === 200){ 
					this.form.idBack = e.data
					this.$refs.uToast.show({
						title: '上传成功！',
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
			//监听返回按钮执行的方法
			back() {
				uni.navigateTo({
					url: '/pages/mainMenu/mainHome'
				});
			},
			cancelChowyz(e) {
				this.showyz = e
			},
			onRemove1(index, lists) {
				this.form.idFront = ""
				this.$refs.uToast.show({
					title: '图片已被移除',
					type: 'success'
				})
			},
			onRemove2(index, lists) {
				this.form.idBack = ""
				this.$refs.uToast.show({
					title: '图片已被移除',
					type: 'success'
				})
			},
			change(e) {
				this.form.address = ""
				e.forEach(i => {
					this.form.address = this.form.address + i.name
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'components/pca-picker/pca-picker.scss';

	.app_wrap {
		width: 100%;
		.app_pic {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 60upx 0;
			margin-top: 20upx;
			background-color: #fff;

			.pic {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
			}
		}
	}
</style>

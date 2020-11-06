<template>
	<!-- 借款信息 -->
	<view class="app_wrap">
		<!-- <gunDong></gunDong> -->
		<u-tag text="借款信息"/> 
		<u-form :model="form" ref="uForm" label-width="215" :borderBottom="false"  label-position="top">
			<u-form-item label="* 贷款金额(小写)" prop="amount">
				<u-input v-model="form.amount" border type="number" maxlength="10" @blur="oblur" input-align="left" placeholder="请输入金额(数值不得大于5000000)"/>
			</u-form-item>
			<u-form-item label="* 贷款金额(大写)">
				<u-input v-model="form.amountCh" border input-align="left" disabled placeholder="无须输入,自动转换成大写"/>
			</u-form-item>
			<u-form-item label="* 贷款年利率(%)" prop="annualRate">
				<u-input v-model="form.annualRate" border type="number" maxlength="5" input-align="left" placeholder="请输入贷款年利率（不超过24，如18）"/>
			</u-form-item>
			<u-form-item label="* 违约金(%)" prop="fineRate">
				<u-input v-model="form.fineRate" border type="number" input-align="left" placeholder="请输入违约金比例（不超过0.1，如0.05）"/>
			</u-form-item>
			<u-form-item label="* 借款到期日">
				<u-picker mode="time" v-model="showDate" :params="paramsDate" @confirm="handleDateConfirm"></u-picker>
				<u-input v-model="form.expireDate" border type="select" input-align="left" placeholder="请选择借款到期日" @click="showDate = true"/>
			</u-form-item>
			<u-form-item label="* 借款用途">
				<u-picker mode="selector" v-model="show1"  :default-selector="[0]" :range="selectorObj" range-key="name" @confirm="handleConfirm"></u-picker>
				<u-input v-model="form.loanUse" border type="select" input-align="left" placeholder="请选择借款用途" @click="show1 = true"/>
			</u-form-item>
		</u-form>   
		<u-gap height="80" bg-color="#fff"></u-gap>
		<u-tag text="质押、抵押信息(请按实际情况添加)"/>
		
		<view class="collapse_box"> 
			<u-cell-item icon="file-text" title="质押信息" :arrow="true" :value="ledgeVO==1? '已添加':'去添加'" center @click="showpledge=true"></u-cell-item>
			<u-cell-item icon="file-text" title="抵押信息" :arrow="true" :value="gageVO==1? '已添加':'去添加'" center  @click="showmortgageVO=true"></u-cell-item>
		</view> 
		<!-- 质押弹出层 -->
		<u-popup v-model="showpledge"  mode="bottom" :safe-area-inset-bottom="true" height="100%" :closeable="true">
			<plvpop @changedgeVO="parchangedgeVO"></plvpop>
		</u-popup>
		
		<!-- 抵押弹出层 -->
		<u-popup v-model="showmortgageVO"  mode="bottom" height="100%" :safe-area-inset-bottom="true" :closeable="true">
			<mgvpop @changemortgageVO="parchangemortgageVO"></mgvpop>
		</u-popup>
		
		<view class="tiheight"></view>
		<!-- 底部按钮 -->
		<view class="footer_button">
			<view class="btn" @click="nextSubmit">
				下一步
			</view>
		</view>
		
		<!-- 提示信息 -->
		<u-toast ref="uToast" /> 
		<u-top-tips ref="uTips"></u-top-tips>
		<back-top :deliverscrollTop="scrollTop"></back-top>
	</view>
</template>

<script> 
	import plvpop from '../../components/zhiyadiya/plvpup.vue'
	import mgvpop from '../../components/zhiyadiya/mgvpop.vue'
	import gunDong from '../../components/gundong/gundong.vue'
	import rules from '../../common/js/rules.js'
	import backTop from '@/components/backtop/backtop.vue'
	import transform from '../../common/js/upWritenum.js'
	export default {
		data() {
			return {  
				showpledge:false,
				showmortgageVO:false,
				scrollTop:0,
				paramsDate:{
					year: true,
					month: true,
					day: true
				},
				showDate:false,
				show1:false,
				selectorObj: [
					{	
						index:0,
						name:'家庭消费'
					}, {
						index:1,
						name:'资金周转'
					}, {
						index:2,
						name:'装修'
					}, {
						index:3,
						name:'购车'
					}],
				addressdetail:"", 
				form: {
					amount:"",
					amountCh:"",
					annualRate:"",
					clerk:"",
					expireDate:"",
					fineRate:"",
					loanUse:""
				},
				header:{
					token:""
				},//上传头
				active: false,
				rules: {} ,
				ledgeVO:0,
				gageVO:0
			}
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
			backTop,
			gunDong,
			plvpop,
			mgvpop
		},
		mounted() {
			this.rules = rules 
			this.$refs.uForm.setRules(this.rules);
			this.form.clerk = uni.getStorageSync('storage_clerk')  
			//获取token
			this.header.token = uni.getStorageSync('storage_token') 
			
			//清除缓存中的质押抵押提交记录
			if(uni.getStorageSync('formpledgeVO') || uni.getStorageSync('formmortgageVO')){ 
				uni.removeStorageSync('formpledgeVO')
				uni.removeStorageSync('formmortgageVO')
			}
		},
		onReady() {
			this.rules = rules 
			this.$refs.uForm.setRules(this.rules); 
			//获取token
			this.header.token = uni.getStorageSync('storage_token')  
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {   
			//子组件触发父组件方法
			parchangedgeVO(index){
				this.ledgeVO = index 
				//关闭pop
				setTimeout(()=>{ 
					this.showpledge = false
				},2300)
			},
			parchangemortgageVO(index){
				this.gageVO = index 
				//关闭pop
				setTimeout(()=>{ 
					this.showmortgageVO = false
				},2300) 
			},
			//金额失去焦点转换大写
			oblur(){
				if(this.form.amount<=5000000){
					this.form.amountCh = transform(this.form.amount) 
				}else{ 
					//清空
					this.form.amount = "" 
					this.$refs.uTips.show({
						title: '借款金额不得大于500万元！',
						type: 'error',
						duration: '2300'
					})  
				}
			},
			//提交
			nextSubmit(){ 
				this.$refs.uForm.validate(valid => {
					if (valid) {
							if(this.form.loanUse.length && this.form.expireDate.length){ 
									this.finsSubmit()
							}else{
								this.$refs.uToast.show({
									title: '请补齐信息！',
									type: 'error'
								})
							}
						} else {
						console.log('验证失败');
					}
				});
			},
			//提交
			finsSubmit(){
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
					this.form.clerk = mobile
				this.$http.post('/v1/channel/jm/addLoan', this.form,{header: {token}}).then(res => {
						var resp = res.data
						if(resp.code === 200){  
								//清除缓存中的质押抵押提交记录
								if(uni.getStorageSync('formpledgeVO') || uni.getStorageSync('formmortgageVO')){ 
									uni.removeStorageSync('formpledgeVO')
									uni.removeStorageSync('formmortgageVO')
								}
								uni.navigateTo({
									url: '/pages/loanpreview/wholeMsgview'
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
			// 借款到期日
			handleDateConfirm(e){
				this.form.expireDate = e.year+'年'+e.month+'月'+e.day+'日'
			},
			//借款用途
			handleConfirm(e){ 
				this.form.loanUse = this.selectorObj[parseInt(e[0])].name
			},
			cancelChowyz(e){
				this.showyz = e 
			}, 
			onRemove(index, lists) {
				this.$refs.uToast.show({
					title: '图片已被移除',
					type: 'success'
				}) 
			},
			//监听返回按钮执行的方法
			back() {
				uni.navigateTo({
					url: '/pages/mainMenu/mainHome'
				});
				//清除缓存中的质押抵押提交记录
				if(uni.getStorageSync('formpledgeVO') || uni.getStorageSync('formmortgageVO')){ 
					uni.removeStorageSync('formpledgeVO')
					uni.removeStorageSync('formmortgageVO')
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "common/css/color.scss";
	@import 'components/pca-picker/pca-picker.scss';
	.app_wrap {
		width: 100%; 
	}
	.u-drawer{
		z-index: 998 !important;
	}
</style>

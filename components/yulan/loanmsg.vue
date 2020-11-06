<template>

	<!-- 借款信息 -->
	<view class="loanMsgview loancommon">
		<view class="loantitle">借款信息</view> 
		<view class="loantext">可修改</view>
		<u-field label-width="195" label-align="left" type="number" required v-model="loan.amount" @blur="oblur"  label="贷款金额(小写):" placeholder="请填写贷款金额" input-align="right">
		</u-field>
		<u-field label-width="195" label-align="left" required disabled v-model="loan.amountCh" label="贷款金额(大写):" placeholder="无需输入此项" input-align="right">
		</u-field>
		<u-field label-width="195" label-align="left" type="number" maxlength="5"  required v-model="loan.annualRate" label="贷款年利率(%):" placeholder="请输入贷款年利率（不超过24，如18）" input-align="right">
		</u-field>
		<u-field label-width="195" label-align="left" type="number" required maxlength="4"  v-model="loan.fineRate" label="违约金(%):" placeholder="请输入违约金比例（不超过0.1，如0.05）" input-align="right">
		</u-field>
		<u-field label-width="195" label-align="left" disabled required v-model="loan.expireDate" label="借款到期日:" @click="showDate = true" placeholder="请选择借款到期日" input-align="right" right-icon="arrow-down">
		</u-field>
		<u-picker mode="time" v-model="showDate" :params="paramsDate" @confirm="handleDateConfirm"></u-picker>
		<u-field label-width="195" label-align="left" required v-model="loan.loanUse" label="借款用途:" placeholder="请选择借款用途" input-align="right"
		 @click="show1 = true" disabled right-icon="arrow-down">
		</u-field>
		<u-picker mode="selector" v-model="show1" :default-selector="[0]" :range="selectorObj" range-key="name" @confirm="handleConfirm"></u-picker>
		<view class="trapSubmit" @click="handleTrap">
			确认修改
		</view>
		<!-- 提示信息 -->
		<u-toast ref="uToast" />
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import rules from '../../common/js/rules.js'
	import transform from '../../common/js/upWritenum.js'
	export default {
		data() {
			return {
				showDate:false,
				show1:false,
				mobile:'',
				paramsDate:{
					year: true,
					month: true,
					day: true
				},
				selectorObj: [
				{	
					index:0,
					name:'家庭消费'
				}, {
					index:1,
					name:'资金周转'
				}, {
					index:2,
					name:'装修和购车'
				}],
			}
		},
		props: {
			loan:Object
		}, 
		methods:{ 
			//修改
			handleTrap(){ 
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
				this.loan.clerk = mobile
				this.$http.put('/v1/channel/jm/modifyLoan', this.loan,{header: {token}}).then(res => {
						var resp = res.data
						if(resp.code === 200){ 
							this.$refs.uTips.show({
								title: '借款信息修改成功！',
								type: 'success',
								duration: '2300'
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
			},
			// 借款到期日
			handleDateConfirm(e){
				this.loan.expireDate = e.year+'年'+e.month+'月'+e.day+'日'
			},
			//借款用途
			handleConfirm(e){ 
				this.loan.loanUse = this.selectorObj[parseInt(e[0])].name
			},
			//金额失去焦点转换大写
			oblur(){
				this.loan.amountCh = transform(this.loan.amount)
			},
		}
	}
</script>

<style lang="scss" scoped> 
	@import "common/css/color.scss";
	.u-field{
		padding: 10px 0;
	} 
	.trapSubmit{
		margin: 40upx 0;
		color: #fff; 
		height: 70upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $wholecolor;
	}
	.trapSubmit:active{
		color: #eee;
		background-color: #e1e5ff;
	}
</style>

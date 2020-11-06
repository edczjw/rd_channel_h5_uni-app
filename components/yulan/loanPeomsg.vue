<template>
	<view class="loanPeoview loancommon" > 
		<view v-for="(item,index) in custList" :key="index">
			<view class="loantitle">
				<text v-if="item.custType==1">借款人信息</text> 
				<text v-else-if="item.custType==2">共同借款人信息</text> 
				<text v-else-if="item.custType==3">担保人（一）信息</text> 
				<text v-else-if="item.custType==4">担保人（二）信息</text> 
			</view>
			<u-field label-width="195" label-align="left" v-model="item.name" label="姓名:" input-align="right" disabled>
			</u-field>
			<u-field label-width="195" label-align="left" v-model="item.idNo" label="身份证号:" input-align="right" disabled>
			</u-field>
			<u-field label-width="195" label-align="left" v-model="item.mobile" label="联系电话:" placeholder="请填写手机号" input-align="right"
			 disabled>
			</u-field>
			<u-field label-width="195" label-align="left" v-model="item.email" label="电子邮箱:" placeholder="请填写手机号" input-align="right"
			 disabled>
			</u-field>
			<u-field label-width="195" label-align="left" v-model="item.address" label="联系地址:" placeholder="请填写手机号" input-align="right"
			 type="textarea" auto-height disabled>
			</u-field> 
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			custList:Array
		},
		data(){
			return{
				
			}
		},
	}
</script>

<style lang="scss" scoped> 
	.u-field{
		padding: 10px 0 !important;
	}
</style>

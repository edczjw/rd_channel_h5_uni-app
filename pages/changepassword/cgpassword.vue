<template>
	<view class="pass_wrap">
		<u-form :model="form" ref="uForm" label-width="130">
			<u-form-item label="账号">
				<u-input v-model="form.mobile" disabled placeholder="请输入账号" />
			</u-form-item>
			<u-form-item label="旧密码" prop="oldPassword">
				<u-input v-model="form.oldPassword" maxlength="16" type="password" placeholder="请输入旧密码" />
			</u-form-item>
			<u-form-item label="新密码" prop="newPassword">
				<u-input v-model="form.newPassword" maxlength="16" type="password" placeholder="请输入新密码" />
			</u-form-item>
		</u-form>

		<!-- 底部按钮 -->
		<view class="footer_button">
			<view class="btn" @click="handleSubmitpass">
				提交
			</view>
		</view>
		<!-- 提示信息 -->
		<u-toast ref="uToast" />
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import rules from '../../common/js/rules.js'
	export default {
		data() {
			return {
				form: {
					mobile: '',
					oldPassword: '',
					newPassword: ''
				},
				rules: {},
				header: {
					token: ""
				}, //上传头
			}
		},
		mounted() {
			this.rules = rules
			this.$refs.uForm.setRules(this.rules);
			//获取token
			this.header.token = uni.getStorageSync('storage_token')
			this.form.mobile = uni.getStorageSync('storage_clerk')
		},
		methods: {
			//提交修改密码
			handleSubmitpass(){ 
				this.$refs.uForm.validate(valid => {
					if (valid) {
						//提交
						//新旧密码不能相同
						if(this.form.oldPassword === this.form.newPassword){ 
								this.$refs.uTips.show({
									title: '新旧密码请勿相同',
									type: 'error',
									duration: '2300'
								}) 
						}else{ 
							this.passMit()
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			
			passMit(){
				this.$http.post('/v1/channel/common/modifyPassword', this.form,{header: this.header}).then(res => {
						var resp = res.data
						if(resp.code === 200){    
							this.$refs.uTips.show({
								title: '密码修改成功！',
								type: 'success',
								duration: '2300'
							}) 
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
		}
	}
</script>

<style lang="scss" scoped>
	.pass_wrap {
		padding: 31upx;
	}
</style>

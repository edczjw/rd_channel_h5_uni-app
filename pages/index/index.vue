<template>
	<!-- 登录 -->
	<view class="content">
		<u-form :model="form" ref="uForm" label-width="140">
			<u-form-item label="手机号码" prop="mobile">
				<u-input border maxlength="11" type="number" v-model="form.mobile" placeholder="请输入手机号码" />
			</u-form-item>
			<u-form-item label="密码" prop="password"> 
				<u-input border maxlength="16" type="password" v-model="form.password" placeholder="请输入密码" /> 
			</u-form-item>
		</u-form>
		<u-button @click="submit" size="default" :ripple="true" ripple-bg-color="#affafa">登录</u-button>
		<!-- 三天内自动记住账号 -->
		<view style="width: 100%;text-align: center;margin-top: 40upx;">
			<u-checkbox-group>
				<u-checkbox 
					@change="checkboxChange" 
					v-model="checked" 
				>三天内自动记住账号</u-checkbox>
			</u-checkbox-group> 
		</view>
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
					password: '',
				},
				rules: {},
				checked:false
			}
		},
		mounted() {
			//清除缓存中的质押抵押提交记录
			if(uni.getStorageSync('formpledgeVO') || uni.getStorageSync('formmortgageVO')){ 
				uni.removeStorageSync('formpledgeVO')
				uni.removeStorageSync('formmortgageVO')
			}
			// 判断时间戳是否相隔三天
			if(uni.getStorageSync('timelogin')){ 
				var timelogin = uni.getStorageSync('timelogin')
				if(Date.now() - timelogin <= 1000*60*60*24*3) { 
					if(uni.getStorageSync('storage_clerk')){
						this.form.mobile = uni.getStorageSync('storage_clerk')
					}
				}
			}
		},
		onLoad() {
			// 按需使用：在页面一进来的时候，添加一个历史记录，popstate不可修改
			// window.history.pushState(null, null, document.URL);
			// 给 window 添加一个 popstate 事件，拦截返回键，执行 this.onBrowserBack 事件，addEventListener 需要指向一个方法
			// window.addEventListener("popstate", this.onReturnBack, false);
		},
		onReady() {
			this.rules = rules 
			this.$refs.uForm.setRules(this.rules);
			//如果存在则清除
			if(uni.getStorageSync('indexop')){ 
				uni.removeStorageSync('indexop')
			}
		},
		methods: {
			//三天内自动记住账号 
			checkboxChange(e) {
				this.checked = e.value
			},
			// onReturnBack() {
			// 	// 这里写点击返回键时候的事件
			// 	// 比如判断需求执行 back() 或者 go(-2) 或者 PopupShow=true 弹出提示框 
			// 	uni.navigateTo({
			// 		url: '/pages/index/index'
			// 	});
			// },
			submit() {
				//登录接口
				this.$refs.uForm.validate(valid => {
					if (valid) {
							this.$http.post('/v1/channel/common/login', this.form).then(res => {
									var resp = res.data
									if(resp.code === 200){ 
										// 缓存token
										uni.setStorageSync('storage_token', resp.data.token);
										uni.setStorageSync('storage_clerk', resp.data.clerk);
										
										// 判断用户是否选择三天自动显示账号
										if(this.checked){
											var timelogin = Date.now()
											uni.setStorageSync('timelogin',timelogin)
										}
										this.$refs.uTips.show({
											title: `登录成功！欢迎用户${resp.data.clerk}`,
											type: 'success',
											duration: '2300'
										}) 
										//搭配提示延时跳转至引导页
										setTimeout(()=>{ 
											uni.navigateTo({
												url: '/pages/mainMenu/mainHome'
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
					} else {
						console.log('验证失败');
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "common/css/color.scss";

	.content {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: $bg-color;

		.u-form {
			width: 100%;
			padding: 100upx 100upx;
			background-color: #fff;
			margin-bottom: 40upx;
		}

		.u-btn {
			width: 90%;
			margin: 0 auto;
			background-color: $wholecolor;
			color: #fff;
		}
	}
</style>

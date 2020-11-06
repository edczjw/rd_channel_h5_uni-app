<template>
	<view class="">
		<view class="code_model">
			<!-- 自动以键盘 -->
			<u-keyboard :safe-area-inset-bottom="true" :tooltip="false" :mask-close-able="false" ref="uKeyboard" @change="valChange"
			 @backspace="backspace" mode="number" :dot-enabled="false" v-model="deliverShowyz">
				<view class="iner_kb">
					<view class="modelText">
						<u-icon name="info-circle"></u-icon>{{deliverText}}
					</view>
					<view class="cd_ip">
						<u-message-input :maxlength="6" :disabled-keyboard="true" :focus="true" :breathe="true" :value="code"></u-message-input>
					</view>
					<view class="cm_fot">
						<view class="cacel" @click="cancel">取消</view>
						<view class="subm" @click="submit1">确定</view>
					</view>
				</view>
			</u-keyboard>
			<!-- 提示信息 -->
			<u-toast ref="uToast" />
			<u-top-tips ref="uTips"></u-top-tips>
		</view>
		<!-- 模态框确认是否放弃节点 -->
		<u-modal v-model="showmd" :title-style="{color: 'red'}" width="90%" @cancel="giveUp" :show-cancel-button="true"
		 cancel-text="退出登录" confirm-text="录入下一笔" @confirm="keepGo">
			<view class="slot-content" style="padding: 30upx;text-align: center;">
				<rich-text :nodes="contentmd"></rich-text>
			</view>
		</u-modal>

		<!-- 模态框确认是否放弃节点 -->
		<u-modal v-model="showmdfalse" :title-style="{color: 'red'}" width="90%" @cancel="showmdfalse = false"
		 :show-cancel-button="true" cancel-text="确定">
			<view class="slot-content" style="padding: 30upx;text-align: center;">
				签约失败！请重新操作
			</view>
		</u-modal> 
		<u-popup v-model="showloading" :mask-close-able="false" mode="center" width="70%" border-radius="14"> 
			<view style="padding: 50upx;text-align: center;">
				<u-loading size="60" color="green" mode="circle"></u-loading>
				<view style="padding-top: 40upx;">正在查询签约结果，请稍等......</view>
			</view>
		</u-popup>
		
		<!-- 验证码过期模态框 --> 
		<u-modal v-model="showout" :show-cancel-button="true" width="90%" @confirm="confirmout" @cancel="cancelout" :content="contentout"></u-modal>
		 
		<!--确认是否发送下一个验证码模态框 --> 
		<u-modal v-model="shownext" :show-cancel-button="true" width="90%" @confirm="confirmnext" @cancel="cancelout" cancel-text="稍后再发" confirm-text="发送" :title-style="{color: 'red'}">
			<view class="slot-content">
				<rich-text :nodes="contentnext"></rich-text>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shownext:false,
				contentnext:"",
				showout:false,
				contentout:"验证码错误或者已失效，是否重新获取验证码？",
				showloading: false,
				showmd: false, //签约成功弹窗
				showmdfalse: false, //签约失败
				contentmd: "签约成功！",
				code: "",
				index: 1,
				nodeIndex:1,//节点信息
			}
		},
		props: {
			deliverText: String,
			deliverShowyz: Boolean,
			deliverForm: Object,
			deliversignCustList: Array
		},
		onUnload() {
			uni.removeStorageSync('indexop')
		},
		methods: { 
			//确认发送下一个验证码
			confirmnext(){
				//每次提交清空输入框的值
				this.code = ""
				//上一个提交成功   下一个自动发送验证码 
				this.makeSure1(this.deliverForm.custType);
			},
			//取消重新发送验证码
			cancelout(){
				//每次提交清空输入框的值
				this.code = ""
				this.cancel()
			},
			//确定重新发送验证码
			confirmout(){  
				//每次提交清空输入框的值
				this.code = ""
				//重新发送验证码
				this.makeSure1(this.deliverForm.custType);
			},
			//退出登录
			giveUp() {
				uni.removeStorageSync('indexop')
				uni.navigateTo({
					url: "../../pages/index/index"
				})
			},
			//继续录入下一笔
			keepGo() {
				uni.removeStorageSync('indexop')
				uni.navigateTo({
					url: "../../pages/mainMenu/mainHome"
				})
			},
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if (this.code.length < 6) {
					this.code += val;
					this.deliverForm.validCode = this.code
				}
			},
			// 退格键被点击
			backspace() {
				// 删除value的最后一个字符
				if (this.code.length) this.code = this.code.substr(0, this.code.length - 1);
				this.deliverForm.validCode = this.code
			},
			//查询签约结果
			checkResult() {
				let clerk = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token'),
					contrNo = uni.getStorageSync('contrNo'),
					template = Date.now()
				this.$http.get('/v1/channel/jm/querySignResult', {
					params: {
						clerk: clerk,
						contrNo: contrNo,
						template: template
					},
					header: {
						token
					},
				}).then(res => {
					var resp = res.data
					if (resp.code === 200) {
						this.showloading = false
						//延时1.2秒显示签约成功
						if (resp.data) {
							this.showmd = true
						} else {
							this.showmdfalse = true
						}
					} else if (resp.code === 401) {
						this.showloading = false
						this.$refs.uTips.show({
							title: '登录已失效，请重新登录',
							type: 'error',
							duration: '2300'
						})
						//搭配提示延时跳转至引导页
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/index/index'
							});
						}, 2300)
					} else {
						this.showloading = false
						this.$refs.uTips.show({
							title: resp.msg,
							type: 'error',
							duration: '2300'
						})
					}
				}).catch(err => {
					this.showloading = false
					this.$refs.uTips.show({
						title: err,
						type: 'warning',
						duration: '2300'
					})
				})
			},

			//提交验证码
			submit1() {
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
				this.deliverForm.clerk = mobile
				if (this.deliverForm.validCode.length === 6) {
					this.$http.post('/v1/channel/jm/commitSignCode', this.deliverForm, {
						header: {
							token
						}
					}).then(res => {
						var resp = res.data
						if (resp.code === 200) {
							this.$refs.uTips.show({
								title: '提交成功',
								type: 'success',
								duration: '2300'
							})
							//获取下一个节点类型
							this.getnextSign1()
						} else if (resp.code === 401) {
							this.$refs.uTips.show({
								title: '登录已失效，请重新登录',
								type: 'error',
								duration: '2300'
							})
							//搭配提示延时跳转至引导页
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/index/index'
								});
							}, 2300)
						}else if (resp.code === 5004) {  
							this.showout = true
						} else if (resp.code === 500) {
							this.$refs.uTips.show({
								title: resp.msg,
								type: 'error',
								duration: '2300'
							})
							//搭配提示延时跳转至引导页
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/index/index'
								}); 
							}, 2300)
						} else { 
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
					this.$refs.uTips.show({
						title: '请输入6位数字验证码！',
						type: 'error',
						duration: '2300'
					})
				}
			},

			//获取待签约客户类型
			getnextSign1() {
				let clerk = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
				let data = {
					clerk: clerk
				}
				this.$http.post('/v1/channel/jm/nextSignCust', data, {
					header: {
						token
					}
				}).then(res => {
					var resp = res.data
					if (resp.code === 200) {
						if (resp.data != 0) {
							this.deliverForm.custType = resp.data 
							if(!this.showout){ 
								this.shownext = true;
							}
							//判断显示类型
							if (resp.data === '1') {
								this.deliverText = '请输入借款人收到的合同签署验证码'
								this.contentnext = "请您确认是否向<b style='color:red;'> 借款人 </b>发送合同签署验证码？"
							} else if (resp.data === '2') {
								this.deliverText = '请输入共同借款人收到的合同签署验证码'
								this.contentnext = "请您确认是否向<b style='color:red;'> 共同借款人 </b>发送合同签署验证码？"
							} else if (resp.data === '3') {
								this.deliverText = '请输入担保人（一）收到的合同签署验证码'
								this.contentnext = "请您确认是否向<b style='color:red;'> 担保人（一） </b>发送合同签署验证码？"
							} else if (resp.data === '4') {
								this.deliverText = '请输入担保人（二）收到的合同签署验证码'
								this.contentnext = "请您确认是否向<b style='color:red;'> 担保人（二） </b>发送合同签署验证码？"
							} 
						}
					} else if (resp.code === 500) {
						//提交最后一个人时查询签约结果
						this.showloading = true
						this.checkResult()
					} else if (resp.code === 401) {
						this.showloading = false
						this.$refs.uTips.show({
							title: '登录已失效，请重新登录',
							type: 'error',
							duration: '2300'
						})
						//搭配提示延时跳转至引导页
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/index/index'
							});
						}, 2300)
					} else {
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

			//发送验证码
			makeSure1(indexe) {
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')

				let data = {
					clerk: mobile,
					custType: indexe
				}
				this.$http.post('/v1/channel/jm/sendSignCode', data, {
					header: {
						token
					}
				}).then(res => {
					var resp = res.data
					if (resp.code === 200) {
						console.log('短信验证码发送成功')
					} else if (resp.code === 401) {
						this.$refs.uTips.show({
							title: '登录已失效，请重新登录',
							type: 'error',
							duration: '2300'
						})
						//搭配提示延时跳转至引导页
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/index/index'
							});
						}, 2300)
					} else {
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
			cancel() {
				this.code = ""
				this.$emit("cancelChowyz", false);
			}
		}
	}
</script>

<style lang="scss">
	@import "common/css/color.scss";

	.u-tips {
		z-index: 9999999 !important;
	}

	.iner_kb {
		margin: 20px 0;
		padding: 0 31upx 40upx;
	}

	.code_model {
		padding: 30upx 32upx;
		text-align: center;
		z-index: 9999999;

		.cd_ip {
			margin-top: 40upx;
		}

		.cm_fot {
			margin-top: 40upx;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			height: 80upx;
			line-height: 80upx;

			.cacel {
				flex: 1;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #eee;
			}

			.subm {
				flex: 1;
				color: #fff;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: $wholecolor;
			}

			.subm:active {
				color: #eee;
				background-color: #aaf0ff;
			}
		}
	}
	.slot-content{
		padding: 40upx;
		text-align: center;
	}
</style>

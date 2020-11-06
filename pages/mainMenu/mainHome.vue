<template>
	<view class="container"> 
		<view class="subsectionClass"> 
			<u-subsection mode="subsection" :list="sectionlist" active-color="#19a9ba" :animation="true" :sectioncurrent="1" @change="sectionChange"></u-subsection>
		</view>
		<!-- 引导页 -->
		<view class="app_wrap_ko" v-if="sectioncurrent === 0"> 
		<u-cell-group> 
			<view class="ko_view" v-for="(item,index) in list" :key="index">
				<u-cell-item :title="item.name" center @click="goRouter(item.index,item.status)" :arrow="item.status == 0? '':false">
					<uni-view>
						<text v-if="item.status == 0" style="color: #19A9BA;">去添加</text>
						<text v-else-if="item.status == 1">待添加</text>
						<text v-else-if="item.status == 2">已添加</text>
					</uni-view>
				</u-cell-item> 
			</view>
		</u-cell-group> 
		<!-- 模态框确认是否放弃节点 -->
		<u-modal v-model="showmd" :title-style="{color: 'red'}" width="90%" @cancel="giveUp" :show-cancel-button="true" cancel-text="放弃" confirm-text="继续操作" @confirm="showmd=false">
			<view class="slot-content">
				<rich-text :nodes="contentmd"></rich-text>
			</view>
		</u-modal>
		<u-top-tips ref="uTips"></u-top-tips>
		</view> 
		
		<view class="app_wrap_ko" v-else>
			<cgpassword></cgpassword>
		</view>
	</view>
</template>

<script>  
	import cgpassword from '../changepassword/cgpassword.vue'
	export default{
		components:{
			cgpassword
		},
		data(){
			return{ 
				sectionlist: [
					{
						name: '引导页'
					}, 
					{
						name: '修改密码'
					}
				],
				sectioncurrent: 0,
				showmd:false,
				contentmd:"",
				list: [{
					index:0,
					name: '借款人信息',
					status:1
				}, {
					index:1,
					name: '共同借款人信息',
					status:1
				}, {
					index:2,
					name: '担保人(一)信息',
					status:1
				}, {
					index:3,
					name: '担保人(二)信息',
					status:1
				}, {
					index:4,
					name: '借款信息',
					status:1
				},  {
					index:5,
					name: '合同签署',
					status:1
				}],
				current: 0
			}
		}, 
		mounted() {
			//如果存在则清除
			if(uni.getStorageSync('indexop')){ 
				uni.removeStorageSync('indexop')
			}
			
			//清除缓存中的质押抵押提交记录
			if(uni.getStorageSync('formpledgeVO') || uni.getStorageSync('formmortgageVO')){ 
				uni.removeStorageSync('formpledgeVO')
				uni.removeStorageSync('formmortgageVO')
			}
			this.queryNode()
		},
		//下拉刷新监听
		onPullDownRefresh (){ 
			console.log('下拉刷新开始');
			this.queryNode()
			var _that = this
			setTimeout(function () {
				uni.stopPullDownRefresh();
				_that.$refs.uTips.show({
					title: '刷新成功',
					type: 'success',
					duration: '1000'
				}) 
			}, 1000);
		},
		onBackPress(options) {
			//监听返回按钮
			if (options.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			//分段器切换
			sectionChange(index) {
				this.sectioncurrent = index;
			},
			// 放弃节点操作
			giveUp(){
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token')
				this.$http.delete('/v1/channel/jm/dropNode', 
					{
						clerk: mobile
					},
					{header: {token},}
				).then(res => {
						var resp = res.data
						if(resp.code === 200){ 
							//更新状态
							this.queryNode()
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
			//监听返回按钮执行的方法
			back() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
			//查询节点信息
			queryNode(){
				let mobile = uni.getStorageSync('storage_clerk'),
					token = uni.getStorageSync('storage_token'),
					timestamp = Date.parse(new Date());
				this.$http.get('/v1/channel/jm/queryNode', {
					params: {
						clerk: mobile,
						timestamp:timestamp
					},
					header: {token},
				}).then(res => {
						var resp = res.data
						if(resp.code === 200){ 
							if(resp.data.node > 0){
								this.showmd = true
								this.contentmd = `当前有一笔借款合同录入中<br>借款人：${resp.data.name}<br>手机号码：${resp.data.mobile}`
							}
							this.list.forEach(i=>{
								if(i.index === resp.data.node){
									i.status = 0
								}else if(i.index < resp.data.node){
									i.status = 2
								}else{
									i.status = 1
								}
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
			goRouter(index,status){
				if(status === 0){
					switch (index){
						case 0: 
							uni.navigateTo({
								url: '/pages/applyInfo/applyPeople'
							});
							break;
						case 1:
							uni.navigateTo({
								url: '/pages/applyInfo/commonApplypeople'
							});
							break;
						case 2:
							uni.navigateTo({
								url: '/pages/applyInfo/danBaopeo1'
							});
							break;
						case 3:
							uni.navigateTo({
								url: '/pages/applyInfo/danBaopeo2'
							});
							break;
						case 4:
							uni.navigateTo({
								url: '/pages/applyMsgdetail/loanMsg'
							});
							break;
						case 5:
							uni.navigateTo({
								url: '/pages/loanpreview/wholeMsgview'
							});
							break;
					} 
				}
					
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		background-color: #fff;
	}
	.app_wrap_ko{
		margin-top: 20upx;
	}
	.slot-content{
		text-align: center;
		padding: 20upx;
		line-height: 60upx;
	}
	.subsectionClass{
		padding: 20upx;
	}
</style>

<script>
	export default { 
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "common/css/reset.min.css";
	@import "common/css/color.scss";
	body{
		background-color: $bg-color;
	}
	uni-page-body{
		height: 100%;
	} 
	.app_wrap{
		padding: 46upx 31upx;
		background-color: #fff;
	} 
	.app_border{
		border: 2upx dashed $wholecolor;
	}
	.tiheight{ 
		width: 100%;
		padding: 180upx 31upx;
		background-color: #fff; 
	}
	.footer_button{  
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		border-top: 2upx solid #eee;
		padding: 40upx 31upx;
		background-color: #fff;
		text-align: center; 
		z-index: 13;
		.btn{
			color: #fff; 
			height: 90upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: $wholecolor;
		}
		.btn_No{  
			color: #dd5d1d;
			height: 90upx;
			display: flex;
			font-weight: bold;
			justify-content: center;
			align-items: center;
			background-color: #a8d2ee;
			margin-top: 20upx;
		}
		.btn_No:active{ 
			color: #eee;
			background-color: #e1e5ff;
		}
		.btn:active{
			color: #eee;
			background-color: #aaf0ff;
		}
	}
	
	.loantitle{ 
		font-weight: bold;
		border-bottom: 1px dotted #aa400a;
		color: #aa400a;
		display: flex; 
		padding:20upx 0 10upx 0;
		font-size: 32upx;  
		line-height: 40upx;
	}  
	.loantext{
		position: absolute;
		right: 0;
		top: 0;
		background-color: $wholecolor;
		color: #fff;
		padding: 3upx 40upx;
		border-left: 1upx solid $wholecolor;
		border-bottom: 1upx solid $wholecolor;
		border-bottom-left-radius: 20upx;
	}
	.modelText{ 
		font-size: 32upx;
		color: #ee631d;
		line-height: 50upx;
		font-weight: bold;  
	}
</style>

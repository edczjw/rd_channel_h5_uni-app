const BASE_URL = "https://pca.bobolalala.com";
class MyRequest {
	constructor() {
		class result {
			sucCallList = []
			failCallList = []
			comCallList = []
			reqFailCallList = []
			success(fn) {
				this.sucCallList.push(fn);
				return this;
			}
			fail(fn) {
				this.failCallList.push(fn);
				return this;
			}
			reqFail(fn) {
				this.reqFailCallList.push(fn);
				return this;
			}
			complete(fn) {
				this.comCallList.push(fn);
				return this;
			}
		}
		this.result = result;
	}
	init(options) {
		let option = {
			url: "",
			method: "post",
			data: {},
			failShowMsg: true
		}
		let result = new this.result();
		option = Object.assign(option, options);
		// if (option.url !== "/xcx/alipayUser" && option.url !== "/xcx/wxOpenid") {
		// 	option.data.openid = uni.getStorageSync("openid") || "";
		// }
		uni.request({
			header: {
				// "content-type": "application/x-www-form-urlencoded"
			},
			timeout: 20000,
			url: BASE_URL + option.url,
			method: option.method,
			data: option.data,
			success: (res) => {
				res = res.data;
				if (res.code === 200) {
						result.sucCallList.forEach((fn) => {
							fn(res);
						})
				
				} else {
						result.failCallList.forEach((fn) => {
							fn(res);
						})
				}
			},
			fail: (res) => {
					result.reqFailCallList.forEach((fn) => {
						fn(res);
					})
					option.failShowMsg && uni.showToast({
						title: "请求失败请重试!!!",
						icon: "none"
					})
			},
			complete: (res) => {
				result.comCallList.forEach((fn) => {
					fn(res);
				})
			}
		})
		return result;
	}
}
export default new MyRequest();

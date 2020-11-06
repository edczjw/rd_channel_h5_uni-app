<template>
	<view class="mask" :class="{ active: actives, show: show }" @tap="close" @touchmove.stop.prevent>
		<view class="pca-picker-box" @tap.stop>
			<view class="picker-head">
				<text>请选择所在地区</text>
				<i @tap.stop="close" class="iconfont icon-guanbi"></i>
			</view>
			<view class="select-al-box">
				<text
					v-for="(item, index) in selectAlList"
					:index="item.title"
					:key="index"
					:style="{ width: itemWidth + '%' }"
					class="select-al-item"
					@tap="selectAl(index)"
					:class="{ active: selectAlIndex === index }"
				>
					{{ item.title }}
				</text>
			</view>
			<swiper class="swiper-box" @change="selectAl" :current="currentIndex">
				<swiper-item v-for="(item, index) in pcaList" :key="index" :index="index">
					<scroll-view :scroll-into-view="'id' + item.target" class="adress-item" scroll-y="true">
						<view
							v-for="(it, inx) in item.list"
							:index="it.code"
							:id="'id' + it.code"
							class="item"
							:key="inx"
							:class="{ active: inx === item.selectIndex }"
							@tap="selectAddress(it, inx, index)"
						>
							<text class="iconfont icon-dagou-copy-copy">{{ it.name }}</text>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import http from './pca-http.js';
let timmer = null;
let limitRegionNum = {
	province: 1,
	city: 2,
	area: 3
};
function promiseContainer(fn, callback) {
	return new Promise((resolve, reject) => {
		fn(resolve, callback);
	});
}
export default {
	props: {
		active: {
			//是否显示激活
			type: Boolean,
			default: false
		},
		defaultValue: {
			//默认省市区值
			type: Object,
			default() {
				return {
					provinceCode: '', //省code
					citiesCode: '', //市code
					areasCode: '', //区code 
				};
			}
		},
		limitRegion: {
			type: String,
			default: 'areasCode'
		}
	},
	data() {
		return {
			itemWidth: 20,
			show: false,
			//省市区列表
			pcaList: [
				{
					selectIndex: -1,
					target: '',
					list: []
				}
			],
			selectAlList: [
				{
					title: '请选择'
				}
			],
			selectAlIndex: 0,
			currentIndex: 0
		};
	},
	created() {
		this.init();
		this.limitMappingNum = limitRegionNum[this.limitRegion] || 3;
		this.itemWidth = Math.floor(100 / this.limitMappingNum);
	},
	destroyed() {
		clearTimeout(timmer);
	},
	computed: {
		actives: {
			get() {
				if (this.active) {
					timmer = setTimeout(() => {
						this.show = true;
					}, 100);
				}
				return this.active;
			},
			set(newVal) {
				this.$emit('update:active', newVal);
			}
		}
	},
	watch: {
		defaultValue() {
			this.init();
		},
		limitRegion(val) {
			this.limitMappingNum = limitRegionNum[this.limitRegion] || 5;
			this.itemWidth = Math.floor(100 / this.limitMappingNum);
		}
	},
	methods: {
		/**
		 * 方法说明
		 * description: 根据传进来的默认code设置值
		 * @param
		 * @return
		 */
		async init() {
			let { provinceCode, citiesCode, areasCode } = this.defaultValue;
			let set = (index, key) => {
				this.pcaList[index].selectIndex = this.pcaList[index].list.findIndex(i => {
					if (i.code === key) {
						this.setAlList(index, i.name);
						return true;
					}
				});
			};
			await this.getAllProvinces();
			if (!provinceCode) return;
			set(0, provinceCode);
			if (this.limitMappingNum <= 1) return;
			await this.getAllCities();
			if (!citiesCode) return;
			set(1, citiesCode);
			if (this.limitMappingNum <= 2) return;
			await this.getAllAreas();
			if (!areasCode) return;
			set(2, areasCode);
			if (this.limitMappingNum <= 3) return;
			// await this.getAllStreets();
			// if (!streetsCode) return;
			// set(3, streetsCode);
			// if (this.limitMappingNum <= 4) return;
			// await this.getAllVillages();
			// if (!villagesCode) return;
			// set(4, villagesCode);
		},
		/**
		 * 方法说明
		 * description: 关闭picker
		 * @param
		 * @return
		 */
		close() {
			this.show = false;
			timmer = setTimeout(() => {
				this.actives = false;
			}, 300);
		},
		/**
		 * 方法说明
		 * description: 获取省份
		 * @param
		 * @return
		 */
		getAllProvinces() {
			return promiseContainer((resolve, callback) => {
				http.init({
					url: '/address/getAllProvinces',
					method: 'get'
				}).success(res => {
					this.pcaList[0].list = res.data;
					callback && callback(res);
					resolve();
				});
			});
		},
		/**
		 * 方法说明
		 * description: 获取市
		 * @param
		 * @return
		 */
		getAllCities() {
			return promiseContainer((resolve, callback) => {
				let { selectIndex, list } = this.pcaList[0];
				http.init({
					url: '/address/getAllCities',
					method: 'get',
					data: {
						provinceCode: list[selectIndex].code
					}
				}).success(res => {
					this.pcaList.splice(1, 4, {
						selectIndex: -1,
						target: '',
						list: res.data
					});
					this.switchSwiper(1);
					callback && callback(res);
					resolve();
				});
			});
		},
		/**
		 * 方法说明
		 * description: 获取区
		 * @param
		 * @return
		 */
		getAllAreas() {
			return promiseContainer((resolve, callback) => {
				let { selectIndex, list } = this.pcaList[1];
				http.init({
					url: '/address/getAllAreas',
					method: 'get',
					data: {
						citiesCode: list[selectIndex].code
					}
				}).success(res => {
					this.pcaList.splice(2, 3, {
						selectIndex: -1,
						target: '',
						list: res.data
					});
					this.switchSwiper(2);
					callback && callback(res);
					resolve();
				});
			});
		},
		/**
		 * 方法说明
		 * description: 获取街道
		 * @param
		 * @return
		 */
		getAllStreets() {
			return promiseContainer((resolve, callback) => {
				let { selectIndex, list } = this.pcaList[2];
				http.init({
					url: '/address/getAllStreets',
					method: 'get',
					data: {
						areasCode: list[selectIndex].code
					}
				}).success(res => {
					this.pcaList.splice(3, 2, {
						selectIndex: -1,
						target: '',
						list: res.data
					});
					this.switchSwiper(3);
					callback && callback(res);
					resolve();
				});
			});
		},
		/**
		 * 方法说明
		 * description: 获取村
		 * @param
		 * @return
		 */
		getAllVillages() {
			return promiseContainer((resolve, callback) => {
				let { selectIndex, list } = this.pcaList[3];
				http.init({
					url: '/address/getAllVillages',
					method: 'get',
					data: {
						streetsCode: list[selectIndex].code
					}
				}).success(res => {
					this.pcaList.splice(4, 1, {
						selectIndex: -1,
						target: '',
						list: res.data
					});
					this.switchSwiper(4);
					callback && callback(res);
					resolve();
				});
			});
		},
		selectAl(index) {
			if (typeof index === 'object') {
				let {
					detail: { current }
				} = index;
				index = current;
			}
			this.selectAlIndex = index;
			this.switchSwiper(index);
		},
		/**
		 * 方法说明
		 * description: 切换轮播图触发事件
		 * @param index
		 * @return
		 */
		switchSwiper(index) {
			this.$nextTick(() => {
				let { selectIndex, list } = this.pcaList[index];
				if (~selectIndex) {
					let setTarget = this.pcaList[index];
					setTarget.target = '';
					this.$nextTick(() => {
						setTarget.target = list[selectIndex].code;
					});
				}
				this.currentIndex = index;
			});
		},
		/**
		 * 方法说明
		 * description: 选择完省市区触发change事件，将值传给parent
		 * @param
		 * @return
		 */
		submit() {
			let result = this.pcaList.map(item => {
				let { selectIndex, list } = item;
				return { code: list[selectIndex].code, name: list[selectIndex].name };
			});
			this.$emit('change', result);
		},
		setAlList(typeIndex, title) {
			if (typeIndex < 4 && typeIndex + 1 !== this.limitMappingNum) {
				this.selectAlList.splice(typeIndex, 5 - typeIndex, { title: title }, { title: '请选择' });
			} else {
				this.selectAlList.splice(typeIndex, 5 - typeIndex, { title: title });
			}
		},
		selectAddress(item, index, typeIndex) {
			this.pcaList[typeIndex].selectIndex = index;
			this.setAlList(typeIndex, item.name);
			this.selectAlIndex = typeIndex + 1;
			switch (typeIndex) {
				case 0:
					if (this.limitMappingNum >= 2) {
						this.getAllCities();
					} else {
						this.submit();
						this.close();
					}
					break;
				case 1:
					if (this.limitMappingNum >= 3) {
						this.getAllAreas();
					} else {
						this.submit();
						this.close();
					}
					break;
				case 2:
					if (this.limitMappingNum >= 4) {
						this.getAllStreets();
					} else {
						this.submit();
						this.close();
					}
					break;
				case 3:
					if (this.limitMappingNum >= 5) {
						this.getAllVillages();
					} else {
						this.submit();
						this.close();
					}
					break;
				case 4:
					this.submit();
					this.close();
					break;
			}
		}
	}
};
</script>

<style lang="scss">
@import './pca-picker.scss';
</style>

<template>
	<view class="header u-p-20"> 
		<view class="u-p-l-10 u-p-r-10">
			<SearchBase></SearchBase>
		</view> 
		<view class="u-flex u-flex-items-center u-p-20  ">
			<view class="text-nowrap u-m-r-20 u-p-10">热点商品</view>
			<view class="u-flex-1">
				<u-tabs
					:list="catelist"  
					lineWidth="0"  
					@click="handleTabsClick"
					:itemStyle="{height: '35px'}"
				></u-tabs>	
			</view>
			
			 
			
		</view>
		<view class="u-p-l-10 u-p-r-10 u-m-b-20">
			<view class="nav u-flex u-flex-wrap u-flex-items-start u-p-20 bg-white u-radius-8">
				<view class="nav-item u-flex-column u-flex-items-center u-m-b-20"
					v-for="(item, index) in catelist2"
					:key="index"
					@click="click"
				>
					<up-image 
						:show-loading="true" 
						:src="item.img" 
						width="50px" 
						height="50px"
						@click="goto(item)" 
					></up-image>
					<view class="u-line-1 u-m-t-10 u-font-28 ">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="u-flex u-flex-between swiper-w u-p-t-10">
			<view class="item u-p-10">
				<view class="swiper " v-if="swiperList.length > 0">
					<u-swiper
						:list="swiperList" 
						keyName="img"
						radius="10"
						height="100%"
						@click="swiperclick"
						indicator
						bgColor="transparent"
					></u-swiper>
				</view>
			</view>
			<view class="item u-flex-column u-flex-between ">
				<view class="u-flex-1 u-p-10" v-for="(item,index) in list" :key="index">
					<img 
						@click="goto(item)"
						class="u-radius-8"
						:src="item.img"
						style="width: 100%;height: 100%;display: block;"
						alt="" />
				</view>
			</view>
		</view>
		<view class="ad-w u-flex u-flex-between u-p-t-10 u-p-b-10" v-if="list2 && list2.length == 2">
			<view class="item u-p-10" v-for="(item,index) in list2" :key="index">
				<img
					@click="goto(item)"
					class="u-radius-8"
					:src="item.img"
					style="width: 100%;height: 100%;display: block;"
					alt="" 
					mode="widthFix"
					/>
				
			</view>
		</view>
		
	</view>
	<view class="u-flex u-flex-items-end u-flex-between u-p-20">
		<up-image :src="originData.ad" height="30px" width="200px" mode="heightFix" ></up-image>
		<view class="item u-flex u-flex-items-center u-font-28 u-info text-nowrap u-p-20" @click="base.handleGoto('/pages/product/productList')" style="position: relative;z-index: 20;">
			<view class="u-m-r-10">全部商品</view>
			<u-icon name="arrow-right" color="#999" size="14"></u-icon>
		</view>
	</view>
	<view class="list u-flex u-flex-wrap u-flex-items-start u-p-10">
		 <view 
			class="list-item u-p-14" 
			v-for="item in dataList" 
			:key="item.id"
			>
		 	<ProductColCard
				:origin="item"
			></ProductColCard>
		 		 
		 </view>	
		
		 		
	</view>
	<template v-if="dataList.length == 0">
		<view class="u-flex u-flex-center u-p-40">
			<u-empty mode="data" :icon="base.empty" />
		</view>
		
	</template>
	<template v-else>
		<u-loadmore :status="loadstatus" />
	</template>  
	
	
	<view class="u-p-b-50 u-p-t-50"></view>
	<u-safe-bottom></u-safe-bottom>
	<MenusBar ></MenusBar>
</template>

<script setup>
	// import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import { share } from '@/composition/share.js'
	import useDataList from '@/composition/useDataList.js'
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore() 
	const { setOnlineControl } = share()
	const $api = inject('$api')
	const keyword = ref('')
	const originData = ref({})
	const shopCurrent = ref(0)
	const swiperList = ref([])
	const shopTabs = ref([])
	const navList = ref([])
	const catelist = computed(() => originData.value.catelist)
	const catelist2 = computed(() => originData.value.catelist2)
	const list = computed(() => originData.value.list)
	const list2 = computed(() => originData.value.list2)
	const shopCurrentLogin = computed(() => {
		return shopTabs.value[shopCurrent.value]?.login || ''
	})
	const shopCurrentData = ref({})
	const options = computed(() => {
		return {
			params: {},
			api: 'web_product',
			getDataCallBack: (res) => {  
				if (res.code == 1) {
					dataList.value = [...dataList.value, ...res.list]
					if(dataList.value.length >= res.total) {
						loadstatus.value = 'nomore'
					}
					else {
						loadstatus.value = 'loadmore'
					}
				}
			}
		}
	})
	
	const { 
		dataList,
		curP,
		loadstatus,
		params,
		getDataList,
		initDataList, 
	} = useDataList(options)
	onLoad(async () => {
		initDataList()
		initHomeData()
		
	}) 
	async function initHomeData() {
		await getHomeData()
		// await getTuijianData()
	}
	async function getHomeData() {
		const res = await $api.web_home();
		if(res.code == 1) {
			originData.value = res
			swiperList.value = res.swiper
			setOnlineControl(res)
		}
	}
	async function getTuijianData() {
		const res = await $api.web_tuijian2({
			params: {
				login: shopCurrentLogin.value
			}
		});
		if(res.code == 1) {
			shopTabs.value = res.list.map(ele => {
				ele.disabled = false;
				return ele
			})
			shopCurrentData.value = {
				company: res.company,
				product: res.product,
			}
		}
	}
	function swiperclick(e) {
		if(swiperList.value[e].url) {
			uni.navigateTo({
				url: swiperList.value[e].url
			})
		}
	}
	function shopTabsClick(e) {
		shopCurrent.value = +e.index
	}
	function goto(data) {
		if(!data.url) return;
		uni.navigateTo({
			url: data.url
		})
	}
	function handleTabsClick(e) { 
		goto(e)
		// base.handleGoto({
		// 	url: '/pages/product/productList',
		// 	type: 'reLaunch',
		// 	params: {
		// 		cate: e.id
		// 	}
		// })
	}
</script>

<style lang="scss" scoped>
.ad-w { 
	box-sizing: border-box;
	.item {
		flex: 0 0 50%;
		padding-top: 100%;
		position: relative;
		box-sizing: border-box;
		.img-w {
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}
}
.swiper-w {
	height: 300px;
	box-sizing: border-box;
	.item {
		height: 100%;
		flex: 0 0 50%;
		box-sizing: border-box;
		.swiper {
			width: 100%;
			height: 100%;
		}
	}
}
.header {
	background-color: #fff;
	background-image: linear-gradient(to bottom, #EBEDFC , #f9f9f9 150px);
}
.nav {
	.nav-item {
		flex: 0 0 20%
	}
}
.u-info-bg {
	background-color: #f2f2f2;
}
.list {
			box-sizing: border-box;
			>.list-item {
				flex: 0 0 50%;
				box-sizing: border-box;
			}
		}
.shop-center { 
	width: 100%;
	white-space: nowrap;
	background-color: #f2f2f2;
	padding: 10px;
	box-sizing: border-box;
	.p {
		display: inline-block;
		margin-right: 10px;
		width: 35vw;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>

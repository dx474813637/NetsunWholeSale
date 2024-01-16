<template>
	<view class="w"
		:style="{
			backgroundImage: `url(${originData.bj})`,
			backgroundSize: '100% auto',
			backgroundRepeat: 'no-repeat',
		}"
	>
		<view class="navbar-w">
			<navBar
				bgColor="transparent" 
				title=""  
				activeColor="#fff"
				titleStyle="color: #fff"
			>
				<template #navLeft>
					<up-image
						height="40px"
						width="auto"
						mode="heightFix"
						:src="originData.logo"
					></up-image>
					<!-- <view class="u-flex u-flex-items-center left-w u-border u-radius-20 u-p-15 u-p-l-30 u-p-r-30" >
						<view class="btn u-m-r-30" @click="handleBack" v-if="backBtnShow">
							<i class="custom-icon custom-icon-back text-white" ></i>
						</view>  
						<view @click="base.handleGoto({url: '/pages/home/home', type: 'reLaunch'})" class="btn" > 
							<i class="custom-icon custom-icon-home text-white" ></i>
						</view>  
					</view> -->
				</template>
			</navBar>
		</view>
		<view class="header u-p-t-10 u-p-b-10 box-border"> 
			<view class="u-p-l-10 u-p-r-10 u-flex u-flex-items-center">
				<view class="bg-white u-p-5 u-radius-30 u-flex-1">
					<SearchBase></SearchBase>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="shopping-cart" size="35" :color="originData.bj_color" @click="base.handleGoto('/pages_user/cart/cart')"></u-icon>
					<!-- <up-image
						width="25px"
						height="25px"
						src="https://wstm.y.netsun.com/Public/tb/m004.png"
						:customStyle="{ 
							filter: 'grayscale(100%) brightness(500%)'
						}"
						@click="base.handleGoto('/pages_user/cart/cart')"
					></up-image> -->
				</view>
			</view> 
			<view class="u-flex u-flex-items-center u-p-10 " v-if="catelist1.length > 0">
				<!-- <view class="text-nowrap u-m-r-20 u-p-10">热点商品</view> -->
				<view class="u-flex-1 text-white" style="overflow: hidden;">
					<u-tabs
						:list="catelist1"  
						lineWidth="0"  
						@click="handleTabsClick"
						:itemStyle="{height: '35px', color: originData.bj_color }"
						:activeStyle="{ color: originData.bj_color }"
						:inactiveStyle="{ color: originData.bj_color }"
					>
						<template #right>
							<view 
								class="u-p-l-8 u-flex u-flex-items-center u-font-28" 
								style="height: 35px;box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.2)"
								@click="base.handleGoto('/pages/cateList/cateList')"
								>
								<u-icon
									name="list"
									size="21"
									bold
									:color="originData.bj_color"
								></u-icon>
								<view class="u-m-l-6" :style="{color: originData.bj_color}">分类</view>
							</view>
						</template>
					</u-tabs>	
				</view> 
			</view> 
			
			
			<view class=" page-bg2" style="border-radius: 20px 20px 0 0;overflow: hidden;"> 
				<view class="" v-if="swiperList1.length > 0">
					<u-swiper
						:list="swiperList1" 
						keyName="img"
						:height="150" 
						:border-radius="13"
						:indicator="swiperList1.length > 1"
						imgMode="scaleToFill"
						circular
						bgColor="transparent"
						@click="swiperclick1"
					></u-swiper>
				</view>
				<view class="u-p-20">
					<view
						class="u-radius-8 box-border bg-white" 
						style=" overflow: hidden;"
						v-if="catelist2[0].length > 0"
					>
						<u-scroll-list 
							:indicator="catelist2[0].length > 5"
							indicatorColor="#f3dedf" 
							:indicatorActiveColor="themeColor"
						>
							<view class="u-flex-column box-border" style="min-width: 100%;">
								<view
									v-for="(ele, i) in catelist2"
									:key="i"
									class="u-flex u-flex-items-center nav box-border u-m-t-5"
									style="width: 100%;"
								>
									<view 
										v-for="(item, index) in ele" 
										:key="index"
										class="nav-item u-flex-column u-flex-items-center box-border" 
										@click="goto(item)"
										>
										<view style="width: 50px; height: 50px;">
											<zeroLazyLoad
												:image="item.img" 
												imgMode="scaleToFill" 
												height="100%"
												></zeroLazyLoad>
										</view>
										<view class="text-base u-line-1 u-m-t-5 u-font-28">{{item.name}}</view>
									</view>
								</view>
							</view>
							
							
						</u-scroll-list>
					</view>
				</view>
				
			</view>
			 
			<view class="ad-w u-flex u-flex-between u-p-t-5 u-p-b-5 bg-white" v-if="list && list.length > 0">
				<view class="item u-p-10 u-flex-1" v-for="(item,index) in list2" :key="index">
					<view @click="goto(item)">
						<zeroLazyLoad
							:image="item.img" 
							imgMode="widthFix" 
							height="auto"
							border-radius="16"
						></zeroLazyLoad> 
					</view> 
				</view>
			</view>
			<view class="ad-w u-flex u-flex-between u-p-t-5 u-p-b-5 bg-white" v-if="list2 && list2.length > 0">
				<view class="item u-p-10 u-flex-1" v-for="(item,index) in list2" :key="index">
					<view @click="goto(item)">
						<zeroLazyLoad
							:image="item.img" 
							imgMode="widthFix" 
							height="auto"
							border-radius="16"
						></zeroLazyLoad> 
					</view>
					
				</view>
			</view>
			 
		</view>
		
	</view> 
	<view class="u-p-t-20" v-if="zt && zt.length > 0"> 
		<u-scroll-list
			indicator 
			indicatorColor="#f3dedf" 
			:indicatorActiveColor="themeColor"
		>
			
			<view class="zt-item box-border u-p-l-20 u-p-r-20" v-for="(item, index) in zt" :key="index">
				<view class="bg-white u-p-10 u-p-l-20 u-p-r-20 u-radius-15 box-border zt-card" style="overflow: hidden;" :style="{
					backgroundImage: `url(${item.img})`,
					backgroundSize: '100% auto',
					backgroundRepeat: 'no-repeat',
				}"
				>
					<view class="card-header u-flex u-flex-between u-flex-items-center u-p-10">
						<view class="u-flex u-flex-items-baseline">
							<view class="text-bold u-font-36 u-flex u-flex-items-center">
								<view class="u-error">
									{{item.name}}
								</view>
								<!-- <view class="u-error">精选</view>
								<view class="text-black">卖场</view> -->
							</view>
							<!-- <view class="text-base text-thin u-font-26 u-m-l-10 u-line-1">每日推荐优质卖场</view> -->
						</view>
						<view class="">
							<view class="u-radius-15 u-border u-p-10 u-p-l-30 u-p-r-20 u-flex u-flex-items-baseline u-font-26" 
							style="border-color: #fff!important; background-color: rgba(255,255,255,.2);"
							@click="goto(item)" 
							>
								<view class="text-thin">更多</view>
								<u-icon name="arrow-right" size="12" color="#333"></u-icon>
							</view>
						</view>
					</view> 
					<view class="u-flex u-flex-between card-main">
						<view class="item u-p-10 item-left box-border">
							<zeroLazyLoad
								:image="item.list[0].pic.split('|')[0]" 
								imgMode="aspectFill" 
								height="100%"
								border-radius="16"
								></zeroLazyLoad>
						</view>
						<view class="item item-right u-flex-column u-flex-between u-flex-1">
							<view class="u-flex-1 box-border u-flex" >
								<view class="u-flex-1 u-p-10 box-border">
									<view style="width: 100%; height: 100%;" class="u-radius-8">
										<zeroLazyLoad
											:image="item.list[1].pic.split('|')[0]" 
											imgMode="scaleToFill" 
											height="100%"
											border-radius="16"
											></zeroLazyLoad>
									</view> 
								</view>
								<view class="u-flex-1 u-p-10 box-border">
									<view style="width: 100%; height: 100%;" class="u-radius-8">
										<zeroLazyLoad
											:image="item.list[2].pic.split('|')[0]" 
											imgMode="scaleToFill" 
											height="100%"
											border-radius="16"
											></zeroLazyLoad>
									</view> 
								</view>
								
							</view>
							<view class="u-flex-1 box-border u-flex" >
								<view class="u-flex-1 u-p-10 box-border">
									<view style="width: 100%; height: 100%;" class="u-radius-8">
										<zeroLazyLoad
											:image="item.list[3].pic.split('|')[0]" 
											imgMode="scaleToFill" 
											height="100%"
											border-radius="16"
											></zeroLazyLoad>
									</view> 
								</view>
								<view class="u-flex-1 u-p-10 box-border">
									<view style="width: 100%; height: 100%;" class="u-radius-8">
										<zeroLazyLoad
											:image="item.list[4].pic.split('|')[0]" 
											imgMode="scaleToFill" 
											height="100%"
											border-radius="16"
											></zeroLazyLoad>
									</view> 
								</view>
								
							</view>
						</view>
					</view> 
				</view>
			</view>
		</u-scroll-list>
	</view> 
	 
	<view class="list u-flex u-flex-wrap u-flex-items-start u-p-10" >
		 <view 
			class="list-item u-p-14" 
			v-for="item in tj" 
			:key="item.id"
			>
			<ProductColCard
				:origin="item"
			></ProductColCard>
				 
		 </view>	
		
				
	</view> 
	 
	
	<view class="u-p-b-50 u-p-t-50"></view>
	<u-safe-bottom></u-safe-bottom>
	<MenusBar ></MenusBar>
</template>

<script setup>
	// import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import zeroLazyLoad from '@/uni_modules/zero-lazy-load/components/zero-lazy-load/zero-lazy-load.vue'
	import { share } from '@/composition/share.js'
	import useDataList from '@/composition/useDataList.js'
	import {useCateStore, baseStore} from '@/stores/base.js' 
	const base = baseStore() 
	const {themeColor} = toRefs(base)
	const { setOnlineControl } = share()
	const $api = inject('$api')
	const keyword = ref('')
	const originData = ref({})
	const shopCurrent = ref(0)
	const swiperList = ref([])
	const shopTabs = ref([])
	// const catelist = computed(() => originData.value.catelist)
	const catelist1 = computed(() => originData.value.catelist || [])
	const catelist2 = computed(() => {
		let data = originData.value.catelist2 || [];
		let len = data.length
		if(len < 10) return [data] 
		let arr = [
			data.slice(0, Math.ceil(len/2)),
			data.slice(Math.ceil(len/2)),
		]
		console.log(arr)
		return arr
	})
	const swiperList1 = computed(() => originData.value.swiper || [])
	const swiperList2 = computed(() => originData.value.swiper1 || [])
	 
	const list = computed(() => originData.value.list || [])
	const list2 = computed(() => originData.value.list2 || [])
	const shopCurrentLogin = computed(() => {
		return shopTabs.value[shopCurrent.value]?.login || ''
	})
	
	const tj = computed(() => originData.value.tj || [])
	const zt = computed(() => originData.value.zt || [])
	const shopCurrentData = ref({})
	const pl_tabs = ref([
		{
			name: '精选推荐',
			value: '0',
			disabled: false
		},
		{
			name: '最新上架',
			value: '1',
			disabled: false
		},
	])
	const pl_current = ref(0)
	const pl_value = computed(() => pl_tabs.value[pl_current.value].value)
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
			},
			noReach: pl_value.value == '0'
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
		const res = await $api.web_home1();
		if(res.code == 1) {
			originData.value = res 
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
	function swiperclick1(e) {
		if(swiperList1.value[e].url) {
			uni.navigateTo({
				url: swiperList1.value[e].url
			})
		}
	}
	function swiperclick2(e) {
		if(swiperList2.value[e].url) {
			uni.navigateTo({
				url: swiperList2.value[e].url
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
	function tabsClick(data, index) {
		pl_current.value = index
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
.zt-item {
	width: 100vw;
	flex: 0 0 100vw;  
	.zt-card {
		// height: 300px;
	}
} 
.card-item {
	flex: 0 0 60%;
	// height: 100px;
	margin-right: 10px;
	&:last-child {
		margin-right: 0;
	}
}
.ad-w { 
	box-sizing: border-box;
	.item {
		// flex: 0 0 50%;
		// padding-top: 100%;
		position: relative;
		box-sizing: border-box;
		.img-w {
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}
}
.card-main {
	height: 200px;
	box-sizing: border-box;
	.item {
		height: 100%;
		flex: 0 0 50%;
		box-sizing: border-box; 
	}
	.item-left {
		flex: 0 0 40%;
	}
	.item-right {
		flex: 0 0 60%;
	}
}
.swiper-w, .card-w {
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
.w {
	box-sizing: border-box;
	// background: linear-gradient(to bottom, $u-error, $u-error, $page-bg2 350px);
	
}
.header {
	// background-color: #fff;
	// background-image: linear-gradient(to bottom, #EBEDFC , #f9f9f9 150px);
	// height: 100%;
	// min-height: 100vh;
	// padding-bottom: 60px;
}
.navbar-w {
	// position: absolute;
	// top: 0;
	// left: 0;
	width: 100%; 
	box-sizing: border-box; 
	overflow: hidden;
	// z-index: 20;
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

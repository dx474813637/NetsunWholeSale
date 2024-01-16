<template>
	<view class="w bg-white"> 
		
		<view class="header">
			<view class="home-bg" @click="previewImage(0, [homeInfo.bg || bg])">
				<image
					showLoading 
					:src="homeInfo.bg || bg" 
				></image>
			</view>
			<view class="navbar-w">
				<navBar
					bgColor="transparent" 
					title=""  
					activeColor="#fff"
				>
					<template #navLeft>
						<view class="u-flex u-flex-items-center left-w u-border u-radius-20 u-p-15 u-p-l-30 u-p-r-30" >
							<view class="btn u-m-r-30" @click="handleBack" v-if="backBtnShow">
								<i class="custom-icon custom-icon-back text-white" ></i>
							</view>  
							<view @click="base.handleGoto({url: '/pages/home/home', type: 'reLaunch'})" class="btn" > 
								<i class="custom-icon custom-icon-home text-white" ></i>
							</view>  
						</view>
					</template>
				</navBar>
			</view>
			
			<view class="home-info-w u-p-10 text-white">
				<view class="u-flex u-flex-items-center u-flex-between"> 
					<view class="item u-flex u-flex-items-center" style="position: relative;height: 70px;">
						<view class="avatar-w u-radius-8" v-if="homeInfo.img">
							<up-image
								:src="homeInfo.img"
								width="70px"
								height="70px"
								radius="8"
							></up-image> 
						</view>
						<view class="u-m-l-15">
							<view class="home-nick u-line-1 u-m-b-10" >
								<template v-if="homeInfo.name">
									{{homeInfo.name}}
								</template>
								<template v-else>
									暂无主页名称
								</template> 
							</view>
							<view class="home-nick u-line-2 u-font-28" style="color: #f8f8f8;">
								<template v-if="homeInfo.info">
									{{homeInfo.info}}
								</template>
								<template v-else>
									暂无主页简介
								</template>
							</view>
							
						</view>
					</view>
					<view class="item u-flex u-flex-items-center u-p-r-10 u-m-l-10">
						<u-button type="error" shape="circle" size="small" v-if="isMe" @click="showHomeInfo = true">编辑</u-button> 
						<u-button type="error" shape="circle" size="small" v-else @click="followEvent">关注</u-button> 
						<!-- <view class="share-btn u-m-r-20" > 
							<DingYue>
								<view class="u-flex-column u-flex-items-center text-black">
									<u-icon name="bell" color="#333" size="26"></u-icon>
									<text class="u-font-28 text-nowrap text-black text-thin">订阅</text>
								</view> 
							</DingYue> 
						</view> --> 
					</view> 
				</view> 
			</view>
			
		</view>  
	
		<view class="page-bg2 u-p-20" v-if="others && others.length > 0">
			<view class="bg-white u-radius-10" style="overflow: hidden;">
				<view v-if="notice && notice.length > 0">
					<u-notice-bar 
						direction="column" 
						:text="notice"
						bgColor="#ffe4e4"
						color="#f00"
						duration="3000"
					></u-notice-bar>
				</view>
				<view class="u-p-20 u-font-28">
					<view class="u-flex u-flex-items-center u-p-10 u-p-b-14 u-p-t-14"
						v-for="(item, index) in others"
						:key="index"
						@click="ohterClick(item)"
						>
						<view class="item text-base u-m-r-30">
							{{item.name}}
						</view>
						<u-line direction="col" length="15px"></u-line> 
						<view class="item u-p-l-30 u-flex-1 u-line-1 ">
							<text class="u-info">{{item.info}}</text>
							
						</view>
						<u-icon name="arrow-right" color="#ccc"></u-icon>  
					</view>  
				</view>
			</view>
		</view>
		
		<u-sticky bgColor="#fff">
			<view class="tabs-w bg-white">
				<u-tabs
					:list="tabs_list"  
					lineWidth="0"
					:current="tabs_current" 
					:activeStyle="{
						color: themeColor
					}"
					@change="handleTabsChange"
				></u-tabs>	
			</view> 
		</u-sticky>
		<view class="list u-flex u-flex-wrap u-flex-items-start u-p-10"> 
			 <view 
				class="list-item u-p-14" 
				v-for="item in dataList" 
				:key="item.id"
				>
			 	<ProductColCard
					:origin="item"
					:customStyle="{boxShadow: 'none!important', border: '1rpx solid #f9f9f9'}"
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
		<u-safe-bottom></u-safe-bottom>
	</view>
	
	<BaseInfoPopup
		:show="showBaseInfo" 
		:title="baseInfo.name1" 
		:info="baseInfo.info"
		:onUpdateShow="handleChangeShow3" 
	></BaseInfoPopup> 
	<HomeInfoPopup
		:show="showHomeInfo" 
		title="特卖店信息编辑"
		:homeInfo="homeInfo"
		:onUpdateShow="handleChangeShow2" 
		@submit="submit"
	></HomeInfoPopup>
	<sharePopup
		:show="showShare"
		bgColor="transparent"
		:origin="{haibao: haibao}"
		:onUpdateShow="handleChangeShow4" 
	></sharePopup>
	<ProductListPopup
		:show="showProductList" 
		title="商品列表"  
		:xuanList="dataList"
		:xuan="xuan"
		:onUpdateShow="handleChangeShow" 
		@xuanSuccess="xuanSuccess"
	></ProductListPopup>
	<TabBar :customStyle="customStyle" v-if="isMe">
		<view class="u-flex u-flex-between u-flex-items-center u-p-l-20 u-p-r-20 u-font-28 button-w" > 
			<u-button type="error" shape="circle" @click="showProductList = true">
				管理商品配置
				<template v-if="!xuan">
					- 未配置
				</template>
			</u-button>
		</view>
	</TabBar>   
	<view class="u-flex-column u-flex-items-center u-p-l-20 u-p-r-20 u-font-28 fixed-menus-w" > 
		<view class="u-m-b-30 share-btn btns-w u-radius-30 u-flex u-flex-center u-flex-items-center u-border" @click="showShare = true" style="background-color: #ffeeee;border-color: #ffc7c7;">
			<view class="u-flex-column u-flex-center u-flex-items-center text-black u-p-5"> 
				<u-icon name="share-square" color="#f00" size="24"></u-icon>
				<text class="u-font-26 text-nowrap text-error text-thin">分享</text>
			</view>
		</view>
		<view class="btns-w u-radius-30 u-flex u-flex-center u-flex-items-center" @click="base.handleGoto('/pages_user/cart/cart')" style="background-color: rgba(0,0,0,.9);">
			<view class="u-flex-column u-flex-center u-flex-items-center text-black u-p-5"> 
				<u-icon name="shopping-cart" color="#fff" size="36"></u-icon> 
			</view>
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view> 
</template>

<script setup>
	// import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import { share } from '@/composition/share.js'
	const { setOnlineControl, customShareParams } = share()
	const $api = inject('$api')
	
	useNormal()
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore()
	const { themeColor } = toRefs(base)
	const cate = useCateStore()
	const { cate_list, cate_loading } = toRefs(cate)
	import {
		userStore 
	} from '@/stores/user';
	const user = userStore()
	const {user_info, balance} = toRefs(user) 
	const userid = ref('') 
	const curP = ref(1) 
	const dataList = ref([]) 
	const loadstatus = ref('loadmore')
	const showProductList = ref(false)
	const homeInfo = ref({})
	const customStyle = ref({
		// paddingBottom: '50px',
		// background: 'transparent' 
	})  
	const customStyle2 = ref({
		paddingBottom: '80px',
		background: 'transparent' 
	})  
	const tabs_current = ref(0)
	const tabs_list = ref([
		{
			name: '全部',
			value: '',
			disabled: false
		}
	])  
	const showBaseInfo = ref(false)
	const showHomeInfo = ref(false)
	const showShare = ref(false)
	const baseInfo = ref({})
	const xuan = ref(0)  
	const bg = ref('')
	const haibao = ref('') 
	const others = ref([])
	const notice = ref([])
	const func = computed(() => {
		return terms.value ? 'web_search' : 'web_product'
	})
	const isMe = computed(() => {
		return userid.value == user_info.value.id
	})
	const list = ref([])
	const loading = ref(false)
	onLoad(async (options) => {  
		if(options.hasOwnProperty('userid')) {
			userid.value = options.userid
		}
		else {
			userid.value = user_info.value.id
		}
		await initData()  
	})
	
	const backBtnShow = computed(() => {
		return getCurrentPages().length > 1
	})
	onReachBottom( () => { 
		if(xuan.value != 1) return
		getMoreData()
	})   
	async function getMoreData() {
		if(loadstatus.value != 'loadmore') return
		curP.value ++
		await getData()
	}
	async function getData() {
		if(loadstatus.value == 'loading') return
		loadstatus.value = 'loading'
		const res = await $api.shop_product_list({params: {
			login: userid.value,
			cate: tabs_list.value[tabs_current.value].value
		}})
		if (res.code == 1) { 
			dataList.value = res.list.sort((a,b) => b.sid - a.sid )
			homeInfo.value = res.shop || {}
			xuan.value = res.xuan
			bg.value = res.bj
			haibao.value = res.haibao
			others.value = res.other || []
			notice.value = res.notice || []
			setOnlineControl(res)
			tabs_list.value = [
				{
					name: '全部',
					value: '',
					disabled: false
				}, 
				...res.catelist.map(ele => {
					return {
						...ele,
						disabled: false,
						value: ele.id,
						name: ele.name
					}
				})
			]
			if(dataList.value.length >= +res.total || res.xuan == 1) {
				loadstatus.value = 'nomore'
			}
			else {
				loadstatus.value = 'loadmore'
			}
		}
	}
	function initDataParams() {
		curP.value = 1;
		dataList.value = []
	}
	async function initData() {
		uni.showLoading()
		initDataParams();
		await getData()
	} 
	 
	 function handleChangeShow(data) {
	 	showProductList.value = data
	 }
	function handleChangeShow4(data) {
		showShare.value = data
	}
	function handleChangeShow3(data) {
		showBaseInfo.value = data
	}
	function handleChangeShow2(data) {
		showHomeInfo.value = data
	}
	function previewImage(index, imgs) {
   		uni.previewImage({
   			urls: imgs,
   			current: index, 
   			loop: true
   		})
   	}
	function xuanSuccess(data) {
		// console.log(data, data.checked)
		if(!xuan.value) {
			initDataParams(); 
			xuan.value = 1
			loadstatus.value = 'nomore'
			// initDataParams();
			getData()
		}
		else if(data.checked) {
			dataList.value.unshift(data)
			// dataList.value = dataList.value.sort((a,b) => b.id - a.id )
		}
		else {
			let i = dataList.value.findIndex(ele => ele.id == data.id)
			if(i == -1) return;
			dataList.value.splice(i, 1)
			if(dataList.value.length == 0) {
				initDataParams();
				getData()
			}
		}
	}
	async function submit(data) {
		uni.showLoading()
		const res = await $api.save_shop({...data})
		if(res.code == 1) {
			uni.showToast({
				title: res.msg
			})
			showHomeInfo.value = false
		}
		getData()
	}
	function handleBack() {
		// $emits('backEvent')
		uni.navigateBack()
	}
	async function followEvent() { 
		const res = await $api.follow({params: {follow: userid.value}})
		if(res.code == 1) {
			uni.showToast({
				title: res.msg
			}) 
		} 
	}
	function ohterClick(data) {
		baseInfo.value = {...data}
		showBaseInfo.value = true
	}
	function handleTabsChange(data) {
		tabs_current.value = +data.index
		initData() 
	}  
</script>

<style > 
</style>
<style lang="scss" scoped> 
	.share-btn {
		background-color: transparent;
		color: #000;
		line-height: 20px;
		&:after {
			border: 0;
		}
	}
	.header {
		position: relative;
	}
	.home-bg {
		position: relative;
		width: 100vw;
		height: 240px;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			position: absolute; 
			filter: blur(2px);
			transform: scale(1.05);
		}
		&:before {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 5;
			background-color: rgba(0,0,0,.2);
		}
		&:after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			z-index: 8;
			height: 10%;
			background-image: linear-gradient(to top, #fff, transparent); 
		}
	}
	.navbar-w {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%; 
		box-sizing: border-box; 
		z-index: 20;
	}
	.home-info-w {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 95%;
		// height: 50%;
		box-sizing: border-box;
		transform: translateX(-50%);
		border-radius: 10px ;
		background-color: #555;
		z-index: 10;
		.avatar-w {
			// position: absolute;
			// left: 0;
			// bottom: -15px;
			
		}
	}
	.fixed-menus-w {
		position: fixed;
		right: 0;
		bottom: 100px;
		.btns-w {
			width: 50px;
			height: 50px;
		}
	}
	.button-w {
		height: 100%; 
		background-color: #fff;
	}
	.w {
		height: 100%;
		padding-bottom: 110px;
		box-sizing: border-box;
		// background: linear-gradient(to bottom, #fff, $page-bg2 300px);
		.list {
			box-sizing: border-box;
			>.list-item {
				flex: 0 0 50%;
				box-sizing: border-box;
			}
		}
	}
	.left-w {
		background-color: rgba(0,0,0,.5);
		
	}
</style>

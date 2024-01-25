<template>
	<view 
		class="wrapper u-font-28 bg-white"
		style="padding-top: 44px;"
		ref="page" 
	>
		<!-- <u-status-bar></u-status-bar> -->
		<navBar
			:bgColor="themeColor" 
			:title="title"   
			fixed
			activeColor="#fff"
			titleStyle="color: #fff"
		>
			<template #navLeft>
				<view class="u-flex u-flex-items-center left-w u-border u-radius-20 u-p-l-15 u-p-r-15" style="background-color: rgba(0,0,0,.5);">
					<view class="btn u-p-15" @click="handleBack" v-if="backBtnShow">
						<i class="custom-icon custom-icon-back text-white" ></i>
					</view>  
					<view @click="base.handleGoto({url: '/pages/home/home', type: 'reLaunch'})" class="btn u-p-15" > 
						<i class="custom-icon custom-icon-home text-white" ></i>
					</view>  
				</view>
			</template>
		</navBar> 
		<u-sticky customNavHeight="44" v-if="catelist.length > 0">
			<view class="box-border tabs-w" :style="{
				background: themeColor
			}">  
				<u-status-bar></u-status-bar>
				<view class="u-p-10 box-border">
					<u-tabs
						:list="catelist"  
						lineWidth="0"  
						:current="current"
						@click="handleTabsClick"
						:itemStyle="{height: '35px', color: '#fff' }"
						:activeStyle="{ color: '#fff', fontWeight: 'bold' }"
						:inactiveStyle="{ color: '#ffe5e6' }"
					></u-tabs> 
				</view>
				<view class="bg-white" style="border-radius: 20px 20px 0 0; height: 15px;"></view>
			</view> 
		</u-sticky>
		<!-- <view class="img-w">
			<up-image
				width="100vw"
				mode="widthFix"
				height="auto"
				:src="info.pic"
			></up-image>
			<view class="title">
				{{info.name}}
			</view>
		</view> -->
		
		<!-- <view class="top-box" :style="{
			'height': '400rpx',
			'border-radius': `0 0 43% 43%`,
			'background': `url('http://market.netsun.testwebsite.cn/Public/Upload/diy/61e6b37d4c6d5.png')`,
			'background': `${themeColor}`,
			'background': `linear-gradient( 0deg, ${themeColor}, ${themeColor})`, 
		}"></view> -->
		  
		<view class="list u-flex u-flex-wrap u-flex-items-start u-p-10 bg-white"> 
			 <view 
				class="list-item box-border u-p-20  bg-white u-radius-10 " 
				style="flex: 0 0 100%"
				v-for="item in dataList" 
				:key="item.id"
				> 
				<ProductRowCard
					:origin="item"
					mode="normal"
					:customStyle="{
						'box-shadow': 'none!important'
					}"
				>
					<template #content>
						<view class="content-w u-p-5 u-p-l-20 u-font-32 u-flex-1 u-flex-column u-flex-between u-flex-items-start" style="width: 100%;" @click.stop="base.handleGoto({
								url: '/pages/product/productDetail',
								params: {
									id: item.id, 
								}
							})">
							<view class="u-line-2 u-m-b-10 " style="width: 100%;">
								{{item.name}}
							</view>
							<view class="u-radius-30 u-flex " style="background-color: #EA5743; height: 38px; width: 100%;">
								<view class="item u-flex-1 u-p-t-5 box-border u-p-l-20 u-radius-20 u-flex u-flex-items-start" style="background-color: #FDF3F1; position: relative; left: -2px;">
									<view class="">
										<view class="text-error u-font-20 u-m-l-10">批发价：</view>
										<view v-if="item.wholesale">
											<up-text 
												type="error" 
												mode="price" 
												:text="item.wholesale.price" 
												size="16"
												iconStyle="12" 
											></up-text>
										</view>
									</view>
									<view class=" u-m-l-30" style="opacity: .6;">
										<view class="text-error u-font-20 u-m-l-10">吊牌价：</view>
										<view class="text-error" style="text-decoration: line-through; ">
											<up-text 
												type="error" 
												mode="price" 
												:text="item.price" 
												size="12"
												iconStyle="12" 
											></up-text>
										</view>
									</view>
									
								</view>
								<view class="item text-white u-flex u-flex-items-center u-p-l-10 u-p-r-10 qiang-btn u-radius-20" style="height: 100%;background-color: #EA5743;">
									<text class="u-m-r-5 text-bold">抢</text>
									<u-icon name="arrow-right" color="#fff" size="10"></u-icon>
								</view>
							</view>
						</view>
					</template>
				</ProductRowCard> 
			 </view>	 
		</view> 
		
		<u-safe-bottom></u-safe-bottom>
		<MenusBar ></MenusBar>
	</view>
</template>

<script setup>
	import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	import { share } from '@/composition/share.js'
	import useDataList from '@/composition/useDataList.js'
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore() 
	const {themeColor} = toRefs(base)
	const { setOnlineControl } = share()
	const $api = inject('$api')
	
	const homelist = ref({})
	const current = ref(0)
	const kw = ref('')
	const title = ref('')
	const dataList = ref([])  
	const rank = ref('')
	const info = ref({})
	const catelist = ref([])
	onReady(() => {
		uni.setNavigationBarColor({
			backgroundColor: themeColor.value,
			frontColor: '#ffffff'
		})
	})
	watch(
		() => catelist.value,
		(n) => {
			current.value = catelist.value.findIndex(ele => ele.id == rank.value)
		}
	)
	onLoad(async (options) => { 
		if(options.hasOwnProperty('id')) {
			rank.value = options.id
		}
		else {
			uni.reLaunch({
				url: '/pages/home/home'
			})
			return
		}
		await getData()
	}) 
	const backBtnShow = computed(() => {
		return getCurrentPages().length > 1
	})
	function handleBack() {
		// $emits('backEvent')
		uni.navigateBack()
	}
	async function getData() {
		const res = await $api.web_product_top({
			params: {id: rank.value}
		})
		if(res.code == 1) {
			info.value = res.info
			dataList.value = res.list
			title.value = res.title
			catelist.value = res.catelist
			setOnlineControl(res)
		}
	}
	 
	function handleTabsClick(e) {  
		base.handleGoto({
			url: '/pages/rank/rank',
			type: 'redirectTo',
			params: {
				id: e.id
			}
		})
	}
</script>

<style lang="scss"> 
</style>
<style lang="scss" scoped>
	.tabs-w {
		
	}
	.qiang-btn {
		position: relative; 
	}
	.img-w {
		width: 100%;
		position: relative;
		.title {
			position: absolute; 
			top: 30px;
			font-size: 24px;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;
			white-space: nowrap;
			font-weight: bold;
		}
	}
	.list {
		box-sizing: border-box;
		>.list-item { 
		}
	}
	// .wrapper {
	// 	/deep/ .u-mode-center-box {
	// 		background-color: transparent;
	// 	}
	// }
	
	.wrapper {
		position: relative; 
		background-color: #f8f8f8;
		padding-bottom: 100px;
		.top-box {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 1;
			transform: scaleX(1.5);
			background-size: 100% 100%!important;
			background-position: center!important;
			background-repeat: no-repeat!important;
		}
	}
	.isFullScreen {
		.ww { 
		}
		.tabbar {
			padding-bottom: 20px;
		}
		
	}
	.is-ios {
		.tabbar {
			min-height: 65px;
		}
	} 
	.tabbar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		border-top: 1rpx solid #e7e7e7;
		z-index: 200;
		min-height: 60px;
		.item {
			flex-direction: column;
			flex: 1;
			color: #000;
			height: 100%;
			padding-top: 8px;
			
			span {
				line-height: 25px;
				font-size: 14px;
			}
		}
	}
</style>

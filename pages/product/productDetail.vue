<template>
	<view class="w">
		<template v-if="product_list.pic">
			<view class="swiper-w">
				<view class="swiper-box" >
					<view class="swiper-bg" :style="{
						backgroundImage: `url(${swiperlist[swiper_index]})`
					}"></view>
					<u-swiper
						:list="swiperlist" 
						:current="swiper_index"
						indicator
						indicatorMode="dot"
						indicatorInactiveColor="#f8f8f8"
						indicatorActiveColor="#007aff"
						height="100%"
						imgMode="aspectFit"
						interval="4000"
						duration="600"
						@change="swiperChange"
						@click="swiperClick"
						circular
						bgColor="rgba(0,0,0,.2)"
					></u-swiper>
				</view>
				
			</view>
			
		</template>
		<view class="u-p-10 u-p-t-30 u-p-b-30 bg-white u-m-b-20">  
			<view class="u-flex u-flex-between u-flex-items-center u-p-10">
				<view class="item u-flex u-flex-items-center" style="color: #F12E24;">
					<view>
						<text class="u-font-28">到手价</text>
						<text class="u-font-28 text-bold u-m-l-10">￥</text>
						<text class="text-bold" style="font-family: cursive; font-size: 24px;">{{product_list.price1}}</text>
						<text class="u-font-28 u-p-l-10">起</text>
					</view>
					<view 
						class="u-font-28 u-p-l-10 u-p-r-10 u-m-l-20" 
						style="background-color: #f9dada; text-decoration: line-through;"
						v-if="product_list.price"
					> 
						<text>￥</text>
						<text style="font-family: cursive;">{{product_list.price}}</text>
					</view>
				</view>
				<view class="item u-font-28 u-info">已售{{product_list.sales_volume}}件</view>
			</view>
			<view class="bg-white u-radius-8 u-p-10">
				<view class="u-flex u-flex-between u-flex-items-start u-p-t-10 u-p-b-10 u-m-b-20">
					<view class="item u-font-36">
						{{product_list.name}}
					</view> 
					<view class="item u-p-l-20">
						<!-- <button type="primary"  openType="share"  class="share-btn">
							<view class="u-flex-column u-flex-items-center text-black"> 
								<u-icon name="share-square" color="#333" size="26"></u-icon>
								<text class="u-font-28 text-nowrap text-black text-thin">分享</text>
							</view>
						</button> -->
						<view class="share-btn" @click="showProductShare = true">
							<view class="u-flex-column u-flex-items-center text-black"> 
								<u-icon name="share-square" color="#333" size="26"></u-icon>
								<text class="u-font-28 text-nowrap text-black text-thin">分享</text>
							</view>
						</view>
					</view>
				</view>
				<view class="u-flex u-flex-between u-flex-items-start u-font-28">
					<view class="item u-info-dark">
						{{product_list.recommend_remark}}
					</view>
					<view class="item u-info u-p-l-30" style="white-space: nowrap;">
						<!-- {{$u.timeFrom(new Date(product_list.ctime).getTime(), false)}} -->
					</view>
				</view>
			</view> 
		</view> 
		<view class="u-p-10 bg-white u-m-b-20">  
			<view class="u-radius-8 bg-white u-m-b-20 u-p-20 u-font-30">   
				<view class="u-flex u-flex-items-center u-p-10 u-p-b-14 u-p-t-14">
					<view class="item text-base u-m-r-20">
						发货
					</view> 
					<view class="item u-p-l-40">
						预计 {{product_list.delivery_delay_day}} 天内发货
					</view>
				</view> 
				<view class="u-flex u-flex-items-center u-p-10 u-p-b-14 u-p-t-14">
					<view class="item text-base u-m-r-20">
						分类
					</view>  
					<view class="item u-p-l-40">
						{{cate_active_name}}
					</view>
				</view>  
				<u-line length="100%" margin="10px 0"></u-line>
				<view class="u-flex u-flex-items-center u-p-10 u-p-b-14 u-p-t-14" @click="addCartBtn">
					<view class="item text-base u-m-r-30">
						选择
					</view>
					<u-line direction="col" length="15px"></u-line> 
					<view class="item u-p-l-30 u-flex-1 u-line-1 ">
						<text class="u-m-r-25" v-for="(item, index) in sku_arr" :key="index">
							<text class="u-info">{{item.children.length}}种</text>
							<text class="u-info"> · </text>
							<text>{{item.label}}</text>
						</text>
					</view>
					<u-icon name="arrow-right" color="#ccc"></u-icon>
				</view>  
				<view class="u-flex u-flex-items-center u-p-10 u-p-b-14 u-p-t-14" @click="showProductAttr = true">
					<view class="item text-base u-m-r-30">
						参数
					</view>
					<u-line direction="col" length="15px"></u-line>
					<template v-if="product_attr.length == 0">
						<view class="item u-p-l-30 u-flex-1  u-p-r-10 u-info">暂无参数</view>
					</template>
					<template v-else>
						<view class="item u-p-l-30 u-flex-1 u-line-1 ">
							<text class="u-m-r-12"
								v-for="(item, index) in product_attr"
								:key="index"
								>
								<text class="u-info">{{item.name}}：</text>
								<text>{{item.value}}</text>
								<text class="u-info">；</text>
							</text> 
							
						</view>
						<u-icon name="arrow-right" color="#ccc"></u-icon>
					</template>
					
				</view>  
				<view class="u-flex u-flex-items-center u-p-10 u-p-b-14 u-p-t-14" @click="showExpressPrice= true">
					<view class="item text-base u-m-r-30">
						运费
					</view>
					<u-line direction="col" length="15px"></u-line> 
					<view class="item u-p-l-30 u-flex-1 u-line-1 ">
						<text class="u-info">查看详情</text>
						
					</view>
					<u-icon name="arrow-right" color="#ccc"></u-icon> 
					
				</view>  
				<view class="u-flex u-flex-items-center u-p-10 u-p-b-14 u-p-t-14" v-if="company_list.service">  
					<view class="item u-flex-1">
						{{company_list.service}}
					</view>
				</view> 
				<u-line length="100%" margin="10px 0"></u-line>
				<view class="u-flex u-flex-between u-flex-items-center u-p-10 u-p-b-14 u-p-t-14">
					<view class="item text-bold">发现笔记</view>
					<view class="item u-flex u-flex-items-baseline" @click="base.handleGoto({url: 'pages_note/note/noteList', params: {id: product_id}})">
						<view class="u-info u-m-r-5 u-font-28">全部({{product_longs.total}})</view>
						<u-icon name="arrow-right" color="#ccc" size="14"></u-icon>
					</view>
				</view>
				<view class="biji-list u-flex" v-if="product_longs.total > 0">
					<view class="item u-p-10 box-border" v-for="item in product_longs.list" :key="item.id"> 
						<noteCard
							:origin="item"
							imgHeight="120px"
						></noteCard>  
					</view>
				</view>
			</view> 
		</view>
		<view class="pro-desc">
			<view class="item">
				<zeroLazyLoad  
					class="lazy-img" 
					v-for="(item, index) in product_desc_arr" 
					:key="index"
					:image="item" 
					imgMode="widthFix"
					></zeroLazyLoad>
			</view> 
			
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view>
	<view class="fixed-menus bg-white uni-shadow-base">
		<view class="item-mine u-flex-column u-flex-center u-flex-items-center" @click="base.handleGoto( kefu, 'serviceChat')">
			<u-icon name="server-man" color="#f00" size="25"></u-icon>
			<view class="text-error u-font-24 text-bold">客服</view>
		</view>
	</view>
	<TabBar :customStyle="{boxShadow: 'none', border: '1rpx solid #eee' }">
		<view class="u-flex u-flex-between u-flex-items-center u-p-l-20 u-p-r-20 u-font-28" style="height: 100%;">
			<view class="u-flex u-flex-items-center" style="height: 100%;"> 
				<view class="item u-flex-column u-flex-items-center u-p-l-10 u-p-r-10" @click="base.handleGoto({type: 'reLaunch', url: '/pages_user/index/index'})">
					<u-icon name="account" color="#000" size="28"></u-icon>
					<view class="u-info">我的</view>
				</view>
				<view class="item u-flex-column u-flex-items-center u-p-l-10 u-p-r-10" v-if="!hideHomeBtn" @click="base.handleGoto({type: 'reLaunch', url: '/pages/home/home'})">
					<u-icon name="home" color="#000" size="28"></u-icon>
					<view class="u-info">首页</view>
				</view>
				<!-- <view class="item u-flex-column u-flex-items-center" @click="base.handleGoto({type: 'reLaunch', url: '/pages_user/reservation_list/reservation_list'})">
					<u-icon name="list-dot" :color="#000" size="28"></u-icon>
					<view class="u-info">店铺</view>
				</view> -->
				<view class="item u-flex-column u-flex-items-center u-p-l-10 u-p-r-10" @click="base.handleGoto({type: 'reLaunch', url: '/pages_user/cart/cart'})" style="position: relative;">
					<u-icon name="shopping-cart" color="#000" size="28"></u-icon>
					<view class="u-info">购物车</view>
					<up-badge :offset="[-5,2]" numberType="overflow"  max="99" :value="cart_list_abled_num" absolute></up-badge>
				</view> 
			</view>
			<view class="item u-flex u-flex-items-center" >
				<u-button type="warning" @click="addCartBtn" :customStyle="{borderRadius: '20px 0 0 20px', padding: '0 18px'}" >
					<view class="u-flex"> 
						<text class="u-m-l-8 u-p-b-5   text-nowrap">加入购物车</text>
					</view>
				</u-button>
				<u-button type="error" @click="addCartBtn(true)" :customStyle="{borderRadius: '0 20px 20px 0', padding: '0 18px'}"  >
					<view class="u-flex"> 
						<text class="u-m-l-8 u-p-b-5  ">立即购买</text>
					</view>
				</u-button>
			</view> 
		</view>
	</TabBar> 
	<ProductAttrPopup
		:show="showProductAttr" 
		title="商品属性" 
		:list="product_attr"
		:onUpdateShow="handleChangeShow" 
	></ProductAttrPopup>
	<ProductSkuPopup
		:show="showProductSku" 
		title="商品规格" 
		:product_base_data="product_list"
		:product_shop_data="company_list"
		:sku="product_sku"
		:spec_prices="spec_prices"
		:onUpdateShow="handleChangeShow2" 
		:isOrder="isOrder"
		@onConfirm="sku2Cart"
	></ProductSkuPopup>
	<ProductExpressPopup
		:show="showExpressPrice" 
		title="运费说明" 
		:list="express_info"
		:onUpdateShow="handleChangeShow3" 
	></ProductExpressPopup>
	<sharePopup
		:show="showProductShare"
		bgColor="transparent"
		:origin="origin"
		:onUpdateShow="handleChangeShow4" 
	></sharePopup>
</template>

<script setup>
	// import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import zeroLazyLoad from '@/uni_modules/zero-lazy-load/components/zero-lazy-load/zero-lazy-load.vue'
	import { share } from '@/composition/share.js'
	import useProductSku from '@/composition/useProductSku';
	// import useNormal from '@/composition/useNormal';
	const {
	    sku2treeData
	} = useProductSku() 
	useNormal()
	const { setOnlineControl } = share()
	const $api = inject('$api')
	
	import {useCartStore} from '@/stores/cart.js'
	const cart = useCartStore()
	const { cart_list_num, cart_list_abled_num } = toRefs(cart)
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore() 
	const { home, roomList, themeColor } = toRefs(base)
	const cate = useCateStore()
	const { cate_list, cate_loading } = toRefs(cate)
	const product_id = ref('')
	const origin = ref({})
	const product_list = ref({})
	const express_info = ref({})
	const company_list = ref({})
	const spec_prices = ref([])
	const swiper_index = ref(0)
	const showProductAttr = ref(false)
	const showExpressPrice = ref(false)
	const showProductSku = ref(false)
	const showProductShare = ref(false)
	const isOrder = ref(false)
	const kefu = ref({})
	const product_longs = ref({})
	const $http = inject('$http')
	
	const cate_active_name = computed(() => {
		if(!product_list.value.id || cate_list.value.length == 0) return '' 
		return cate_list.value.map(ele => ele.children).flat().filter(ele => ele.id == product_list.value.cate)[0]?.name
	})
	
	const swiperlist = computed(() => { 
		return product_list.value.pic.split('|')
	}) 
	const product_desc_arr = computed(() => {
		if(!product_list.value.description  ) return [] 
		return product_list.value.description.split('|')
	})
	const product_attr = computed(() => {
		if(!product_list.value.attribute  ) return [] 
		return product_list.value.attribute
	})
	const product_sku = computed(() => {
		if(!product_list.value.sku  ) return '' 
		return product_list.value.sku
	})
	const sku_arr = computed(() => {
		if(!product_sku.value  ) return [] 
		return sku2treeData(product_sku.value)
	})
	onShow(() => {
		
	})
	onLoad(async (options) => {
		console.log(options, 2)
		if(options.hasOwnProperty('id')) {
			product_id.value = options.id
		}
		if (options.hasOwnProperty('tid')) {
			$http.setToken({
				tid2: options.tid
			}) 
			uni.setStorageSync('tid2', options.tid)
		} 
		if (options.hasOwnProperty('poster')) {
			$http.setToken({
				poster2: options.poster
			}) 
			uni.setStorageSync('poster2', options.poster)
		} 
		if(cate_list.value.length == 0) {
			cate.getCateData()
		}
		uni.showLoading()
		await getData()
		console.log(cart_list_num.value)
	}) 
	
	function handleChangeShow(data) {
		showProductAttr.value = data
	}
	function handleChangeShow2(data) {
		showProductSku.value = data
	}
	function handleChangeShow3(data) {
		showExpressPrice.value = data
	}
	function handleChangeShow4(data) {
		showProductShare.value = data
	}
	function sku2Cart(data) {
		console.log(data)
		handleChangeShow2(false)
		base.handleGoto({
			url: '/pages_user/order/orderCreate',
			type: 'reLaunch'
		})
	}
	async function getData() {
		const res = await $api.web_product_detail({params: {id: product_id.value}})
		if(res.code == 1) {
			origin.value = res
			product_list.value = res.list
			express_info.value = res.info
			company_list.value = res.company
			spec_prices.value = res.spec_prices
			kefu.value = res.kefu
			product_longs.value = res.product_longs
			setOnlineControl(res)
		}
	}
	function swiperChange({current, currentItemId, source}) { 
		swiper_index.value = current
	}
	// function findIndexby () {
	// 	return spec_prices_data.value.map(ele => ele.specs).findIndex(ele => isObjectEqual(ele, product_sku.form) );
	// }
	function addCartBtn(type = false) {
		isOrder.value = type
		showProductSku.value = true
	}
	
	function swiperClick(index) { 
		uni.previewImage({
			urls: swiperlist.value,
			current: index,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
				success: function(data) {
					console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				},
				fail: function(err) {
					console.log(err.errMsg);
				}
			}
		});
	}
	
	
</script>

<style lang="scss" scoped>
	.fixed-menus {
		position: fixed;
		left: 0;
		bottom: 110px;
		padding: 5px;
		border-radius: 0 30px 30px 0;
		// padding-left: 10px;
		.item-mine {
			width: 45px;
			height: 45px;
			border-radius: 30px;
			border: 2px solid $u-error;
			background-color: $u-error-light;
		}
	}
	.share-btn {
		background-color: transparent;
		color: #000;
		line-height: 20px;
		&:after {
			border: 0;
		}
	}
	.w {
		padding-bottom: 60px;
	}
	.swiper-w {
		position: relative;
		width: 100%;
		padding-top: 100%;
		overflow: hidden;
		.swiper-box {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 10;
			.swiper-bg {
				background-size: 100% 100%;
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%; 
				filter: blur(5px);
				transform: scale(1.05);
			}
		}
	}
	.shop-card {
		background: linear-gradient(to bottom, #e7e9ff, #f3f9ff);
	}
	.biji-list {
		.item {
			flex: 0 0 50%
		}
	}
</style>

<template>
	<u-sticky v-if="cart_list.length > 0">
		<view class="u-flex u-flex-between u-flex-items-center u-p-r-30" :class="{
			'bg-white': editSticky
		}" style="background: #f8f8f8">
			<view class="item"></view>
			<view class="item u-flex u-flex-items-center">
				<view class="u-font-36" @click="manageMode = !manageMode">
					<view class="text-primary u-p-10" v-if="!manageMode">管理</view>
					<view class="text-primary u-p-10" v-else>退出管理</view> 
				</view>
			</view>
		</view>
	</u-sticky>
	
	<view class="cart-w u-m-t-20 u-radius-20">
		<template v-if="cart_list.length == 0">
			<view class="u-flex u-flex-center u-p-40">
				<u-empty mode="data" :icon="base.empty" text="购物车为空" />
			</view>
		</template>
		
		<u-checkbox-group v-model="cart_checked" @change="checkboxChange">
			<view 
				class="items u-p-l-20 u-p-r-20 u-m-b-20 "
				v-for="(item, index) in cart_list"
				:key="item.shop.id"
				style="width: 100%;"
				>
				
				<view class="shop-card u-radius-16 bg-white u-p-b-50">
					<view class="shop-card-header u-flex u-flex-items-center u-p-15">
						<view class="u-p-10"> 
							<!-- <u-checkbox-group :value="item.shop.checked? [item.shop.id] : ['']" @change="shopchange" :name="item.shop.id">
								<u-checkbox shape="circle" :name="`shop_${item.shop.id}`"></u-checkbox> 
							</u-checkbox-group> -->
							
						</view>
						<view class="u-m-r-10">
							<u-icon name="home" color="#999" size="20"></u-icon>
						</view>
						<view>{{ item.shop.company }}</view>
					</view>
					<view class="shop-card-main">
						<view 
							class="product-item u-flex u-flex-items-start u-p-15 u-p-t-30 u-p-b-30 "
							:class="{
								'u-border-top': product_i != 0
							}"
							v-for="(product, product_i) in item.products"
							:key="product.base.id" 
							>
							<view class="disabled-bg" :class="{
								disabled: product.disabled && !manageMode
							}"></view>
									<!-- :disabled="(product.disabled && !manageMode) || (product.num < product.znum) " -->
							<view class="item checkbox u-flex u-flex-items-start u-flex-center u-p-10"> 
								<u-checkbox 
									shape="circle" 
									:activeColor="themeColor"
									:disabled="(product.disabled || product.num < product.znum) && !manageMode "
									:name="product.base.id"
									size="22"
								></u-checkbox>  
							</view> 
							<view class="item u-flex-column u-flex-between u-flex-1 info" >
								<view class="title u-line-2 u-m-b-14 u-font-30" 
								@click="base.handleGoto({url: '/pages/product/productDetail', params: {id: product.base.id}})" 
								>
									{{product.base.name}}
								</view>
								<view class="u-error-light-bg u-error u-p-10 u-radius-4 u-flex u-flex-items-center u-font-14 u-flex-between u-m-b-18" 
									v-if="product.num < product.znum"
									>
									<view class="item">注意该商品起批数量</view>
									<view class="item">（{{product.num}}/{{product.znum}}）</view>
								</view>
								<view class="u-m-b-20 u-flex u-flex-items-center " v-for="(sku, sku_i) in product.list" :key="sku.id">
									<up-image
										show-loading
										:src="sku.img" 
										width="50px" 
										height="50px" 
										radius="8"
									></up-image>
									<view class="u-m-l-20 u-flex-1 u-flex-column u-flex-between" style="height: 50px">
										<view class="sku u-line-2 u-info u-font-24 u-flex-1 u-m-b-10" @click="base.handleGoto({url: '/pages/product/productDetail', params: {id: product.base.id}})">
											<text class="u-m-r-15" v-for="(specs, index) in sku.specs_arr" :key="index">
												<text>{{specs.label}}：{{specs.value}}；</text>
											</text>
										</view>
										<view class="info u-flex u-flex-between u-flex-items-center">
											<view class="item">
												<view class="u-flex u-flex-items-end" style="color: #f00;">
													<text class="u-font-24">￥</text>
													<text class="u-font-32">{{sku.price}}</text> 
												</view>
											</view>
											<view class="item u-m-r-15">
												<u-number-box
													:ref="(el) => setRef(el, sku.id)" 
													:name="sku.id"
													v-model="sku.num"  
													:max="+sku.stock"
													:disabled="sku.disabled"
													:min="0" 
													asyncChange
													:buttonSize="25"
													@blur="(e) => {inputBlur(e, product.base.id)}"
													@change="(e) => {numChange(e, product.base.id)}" 
												></u-number-box>
											</view>
										</view>
									</view>
									
								</view>
								
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</u-checkbox-group> 
		<view class="u-p-30 u-flex u-flex-items-center u-flex-center" v-if="cart_list.length > 0">
			<u-loadmore status="nomore" />
		</view>
		
		
	</view>
	<u-safe-bottom></u-safe-bottom>
	<TabBar :customStyle="customStyle">
		<view class="u-flex u-flex-between u-flex-items-center u-p-l-20 u-p-r-20 u-font-28 cart-bar-w" > 
			<view class="item u-m-l-20">
				<u-checkbox-group v-model="allCheck" size="22" :labelSize="18" :activeColor="themeColor">
					<u-checkbox  
						shape="circle" 
						label="全选"
						name="all"
						></u-checkbox>
				</u-checkbox-group>
				
			</view> 
			<view class="item u-flex u-flex-items-center" >
				<template v-if="!manageMode">
					<view class="u-flex-column u-flex-items-end u-font-28 u-p-r-14">
						<view class="u-flex u-flex-items-center">
							<view class="u-p-t-4">总计：</view>
							<view class="u-flex u-flex-items-center">
								<text class="u-p-t-8 u-error-dark">￥</text>
								<u-count-to 
									:startVal="startVal"
									:endVal="cart_list_checked_price" 
									separator=","
									:duration="400"  
									:decimals="2"
									fontSize="18"
									color="#f00"
									bold
									@end="handleEnd"
								></u-count-to>
							</view>
						</view>
						<view class="u-info">
							已选 {{cart_list_checked_num}} 件选品
						</view>
					</view>
					<view style="width: 100px">
						<u-button type="error" shape="circle" @click="gotoOrderBtn" :disabled="cart_list_checked_num == 0"  >
							<text class="u-font-32">结算</text> 
						</u-button>
					</view>
				</template>
				<template v-else> 
					<view style="width: 100px">
						<u-button type="warning" shape="circle" @click="removeProductBtn"  >
							<text class="u-font-32">移除</text> 
						</u-button>
					</view>
				</template>
				
				
			</view>
		</view>
	</TabBar> 
	<MenusBar></MenusBar>
</template>

<script setup>
	import { onLoad, onPageScroll } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted, nextTick } from 'vue'
	// import { share } from '@/composition/share.js'
	import useProductSku from '@/composition/useProductSku'
	const {
	    sku2treeData,
		sku_ids
	} = useProductSku()
	// const { setOnlineControl } = share()
	const $api = inject('$api')
	
	import {useCartStore} from '@/stores/cart.js'
	const cart = useCartStore()
	const { cart_list, cart_list_num, cart_list_checked_num, cart_list_checked_price } = toRefs(cart)
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore() 
	const { home, roomList, themeColor } = toRefs(base)
	const cate = useCateStore()
	const { cate_list, cate_loading } = toRefs(cate)
	
	const manageMode = ref(false)
	const editSticky = ref(false)
	const sum = ref(1220)
	const numBoxRefs = reactive({});
	const setRef = (el, id) => { 
		if (el) {
			numBoxRefs[id] = el;
		}
	};
	const cart_checked = computed({
		get() {
			let arr = [];
			cart_list.value.forEach(ele => {
				ele.products.forEach(item => {
					if(item.checked) arr.push(item.base.id)
				})
			}) 
			return arr
		},
		set(n) { 
			let cart = uni.$u.deepClone(cart_list.value)
			cart.forEach(ele => { 
				ele.products.forEach(item => {
					item.checked = n.includes(item.base.id) ? true : false
				})
			})
			cart_list.value = cart
		}
	})
	const allCheck = computed({
		get() {
			if(cart_list.value.length == 0) return []
			let flag = true 
			flag = cart_list.value.some(ele => {
				return ele.products.filter(item => (!item.disabled || manageMode.value)).some(item => !item.checked)
			})  
			return flag? [] : ['all']
		},
		set(n) {   
			let cart = uni.$u.deepClone(cart_list.value)
			cart.forEach(ele => { 
				ele.products.forEach(item => { 
					if((item.disabled == true || item.num < item.znum) && !manageMode.value) { 
						item.checked = false
					}else {
						item.checked = n[0] == 'all' ? true : false 
					} 
				})
			})
			cart_list.value = cart  
		}
	})
	const shop_checked = computed({
		get() {
			let arr = [];
			cart_list.value.forEach(ele => {
				let flag = ele.products.every(item => item.checked);
				arr.push(flag? ele.shop.id : '')
			})
			console.log(arr)
			return arr
		},
		set(n) {
			console.log(n, shop_checked.value)
			// cart_list.value.forEach(ele => {
			// 	ele.products.forEach(item => {
			// 		item.checked = n.includes(item.id) ? true : false
			// 	})
			// })
		}
	})
	const customStyle = ref({
		paddingBottom: '50px',
		background: 'transparent' 
	}) 
	const startVal = ref(0)
	// const sku_ids = computed(() => cart_list.value.map(ele => {
	// 	return ele.products.filter(item => !item.disabled)
	// 						.map(item => item.id)
	// 						.join(',')
	// }).filter(ele => ele).join(','))
	watch(
		() => cart_list.value,
		(val) => {
			console.log('save all')
			cart.saveCartData2LocalStorage()
		},
		{deep: true}
	) 
	watch(
		() => manageMode.value,
		(n) => {
			if(!n) {
				let cart = uni.$u.deepClone(cart_list.value)
				cart.forEach(ele => { 
					ele.products.forEach(item => { 
						if(item.disabled || item.num < item.znum) { 
							item.checked = false
						}
					})
				})
				cart_list.value = cart  
			}
		}
	)
	onLoad(async () => {
		console.log(sku_ids.value)
		if(sku_ids.value) {
			checkPidSku()
		}
	})
	onPageScroll((e) => {
		if(e.scrollTop > 30) {
			editSticky.value = true
			uni.setNavigationBarColor({
				backgroundColor: '#ffffff',
				frontColor: '#000000',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		}
		else {
			editSticky.value = false
			uni.setNavigationBarColor({
				backgroundColor: '#f8f8f8',
				frontColor: '#000000',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		}
	})
	async function checkPidSku() {
		await cart.getPidSku(sku_ids.value)
	}
	function gotoOrderBtn() { 
		if(cart_list_checked_num.value == 0) return
		base.handleGoto({
			url: '/pages_user/order/orderCreate'
		})
	}
	
	function removeProductBtn() {
		uni.showModal({
			title: '提示',
			content: '是否移除',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					let idsArr = cart_list.value.map(ele => ele.products.filter(item => item.checked).map(item => item.list.map(s => s.id)).reduce((a, b) => a.concat(b))).reduce((a, b) => a.concat(b))
					console.log(idsArr)
					cart.removeProductsById(idsArr) 
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	
	function checkboxChange(e) {
		console.log(e, cart_list.value)
	}
	function inputBlur(e, product_id) {
		console.log('inputBlur', e)
	}
	function numChange(e, product_id) { 
		// console.log(e, numBoxRefs[e.name])
		// product_num.value = e.value
		let arr = []
		cart_list.value.some((ele, ele_i) => ele.products.some((item, item_i) => {
			item.list.some((sku, sku_i) => {
				if(sku.id == e.name) { 
					sku.num = e.value 
					arr = [ele_i, item_i, sku_i]
					return true
				}
				return false
			})
			item.num = item.list.reduce((prev, sku) => prev + sku.num, 0)  // 商品总数量 
			if(item.num < item.znum) item.checked = false // 判断是否小于商品起批数
			return false
		}))
		if(e.value == 0) {
			cart_list.value[arr[0]].products[arr[1]].list.splice(arr[2], 1)
			if(cart_list.value[arr[0]].products[arr[1]].list.length == 0) {
				cart_list.value[arr[0]].products.splice(arr[1], 1)
			}
			if(cart_list.value[arr[0]].products.length == 0) {
				cart_list.value.splice(arr[0], 1)
			}
		} 
		nextTick(() => {
			numBoxRefs[e.name].init()
		})
		
		// console.log(product_num.value)
	}
	function handleEnd () {
		startVal.value = cart_list_checked_price.value
	}
	function shopchange (e) {
		console.log(e)
	}
</script>
<style lang="scss">
	.cart-w {
		::v-deep {
			.u-number-box__plus,
			.u-number-box__minus {
				width: 25px!important;
				.u-icon__icon {
					font-size: 12px!important;
				}
			}
		} 
	}
	
</style>
<style lang="scss" scoped>
	.cart-w { 
		padding-bottom: 110px;
		box-sizing: border-box;
		// background: linear-gradient(to bottom, #fff, 150px, transparent);
	}
	.cart-bar-w {
		height: 100%; 
		background-color: #fff;
	}
	.shop-card-main {
		.product-item {
			position: relative;
			z-index: 10;
			.disabled-bg { 
				position: absolute;
				z-index: 20;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(255,255,255,.5);
				display: none;
				&.disabled {
					display: block;
				}
			}
			.item {
				&.checkbox {
					height: 80px;
				}
				&.info {
					min-height: 80px;
				}
			}
		}
	}
</style>

<template>
	<view>
		<PopupNormal v-bind="$attrs" @open="open"> 
			<view class="list-w bg-white">   
				<view class="u-flex u-flex-items-start u-p-20">
					<view class="item">
						<u--image
							showLoading
							width="60px"
							height="60px"
							radius="8px"
							:customStyle="{
								border: '1px solid #f8f8f8'
							}"
							:src="product_img_preview"
							@click="onImgClick"
						></u--image>
					</view>
					<view class="u-m-l-20">
						<view class="text-bold u-line-1 u-m-b-20">{{product_base_data.name}}</view>
						<view class="text-error">
							<text class="u-font-28 text-bold">￥</text>
							<text class=" text-bold u-font-38" style="font-family: cursive; ">{{product_wholesale.price}}</text> 
						</view>
					</view>
					
				</view>
				<scroll-view class="main-list" scroll-y >
					<view class="u-p-30">
						<view class="item u-m-b-40" v-for="(item, i) in spec_prices_arr" :key="item.id">
							<view class="u-m-b-10">
								<text 
									class="u-font-26 u-p-8 u-p-l-12 u-p-r-12 u-radius-5 u-info-light-bg u-m-r-14" 
									v-for="(specs, index) in item.specs_arr" 
									:key="index"
								>{{specs.label}}：{{specs.value}}</text>
							</view>
							<view class="u-flex u-flex-items-center u-flex-between u-font-26 text-base">
								<view class="u-flex u-flex-items-center">
									<view class="u-m-r-20">价格：<text class="u-error">{{item.price}}元</text></view>
									<view>库存：{{item.stock}}</view>
								</view>
								<view> 
									<u-number-box  
										:ref="el => setRef(el, i)"
										v-model="item.num"  
										:max="item.stock"
										:min="0"
										asyncChange
										inputWidth="60" 
										@change="(e) => {numChange(e, item.id, i)}"
										@blur="inputBlur"
										@overlimit="numOverlimit"
									></u-number-box>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="u-p-30" >
						<view class="item u-m-b-20"
							v-for="(item) in sku_arr"
							:key="item.label"
						>
							<view class="label u-m-b-30 ">
								{{item.label}} ({{item.children.length}})
							</view>
							<view class="sku-items u-flex u-flex-wrap u-flex-items-start">
								<view class="sku-items-tag u-font-28"
									:class="{
										active: sku_form[item.label] == ele.label,
										disabled: ele.disabled,
									}"
									v-for="ele in item.children"
									:key="ele.label"
									@click="onSelectSku(item.label, ele.label)"
								>
									{{ele.label}}
								</view>
							</view>
						</view>
						<view class="item u-m-b-20 u-flex u-flex-items-center u-flex-between u-p-t-30" >
							<view class="label ">
								<text>数量</text>
								<text 
									class="u-font-28 u-error-dark u-m-l-20" 
									v-if="product_num_disabled"
									style="font-weight: normal;"
								>请选择规格</text>
								<text 
									class="u-font-28 u-error-dark u-m-l-20" 
									v-if="product_num_max == 0"
									style="font-weight: normal;"
								>库存缺货</text>
							</view>
							<view class=" ">
								<u-number-box 
									ref="countRef" 
									v-model="product_num" 
									:disabled="product_num_disabled"
									:max="product_num_max"
									:min="min"
									asyncChange
									inputWidth="80" 
									@change="numChange"
									@blur="inputBlur"
									@overlimit="numOverlimit"
									></u-number-box>
							</view>
						</view>
					</view>
					 -->
				</scroll-view> 
			</view>  
			<template #footer>
				<view class="u-p-20">
					<u-button  
					shape="circle" 
					@click="addCartBtn" 
					:disabled="add_cart_disabled"
					type="error"
					> 
						{{confirmBtnText}}
					</u-button>
				</view>
			</template>
		</PopupNormal>
	</view>
</template>

<script setup>
	import {
		ref,
		toRefs,
		inject,
		computed,
		onMounted,
		reactive, 
		watch,
		useAttrs,
		nextTick
	} from 'vue' 
	import useProductSku from '@/composition/useProductSku'
	const {
	    sku2treeData
	} = useProductSku()
	import {isObjectEqual} from '@/utils/base.js'
	const attrs = useAttrs()
	const $api = inject('$api')
	import { baseStore } from '@/stores/base'
	const base = baseStore();
	const { themeColor } = toRefs(base)
	import { userStore } from '@/stores/user'
	const user = userStore();
	const { user_info } = toRefs(user)
	import { useCartStore } from '@/stores/cart'
	const cart = useCartStore();
	const { cart_list } = toRefs(cart)
	 
	const props = defineProps({  
		product_base_data: {
			type: Object,
			default: () => {
				return {}
			},
		},
		product_shop_data: {
			type: Object,
			default: () => {
				return {}
			},
		},
		sku: {
			type: String,
			default: '',
		},
		spec_prices: {
			type: Array,
			default: () => {
				return []
			},
		},
		isOrder: {
			type: Boolean,
			default: false
		}
	})   
	const emits = defineEmits(['onConfirm'])
	const countRefs = ref([])
	const sku_form = ref({})
	const sku_arr = ref([]) 
	const spec_prices_arr = ref([]) 
	
	const product_num_max = ref(Number.MAX_SAFE_INTEGER)
	const product_num = ref(1)
	const min = computed(() => {  
		return product_wholesale.value?.num || 0
	})
	const active_sku_preview_img = ref('')
	const product_num_disabled = computed(() => {
		return Object.values(sku_form.value).some(ele => !ele) 
	})
	const checked_product_num = computed(() => {
		return spec_prices_arr.value.reduce((prev, items) => prev + items.num, 0)
	})
	const product_wholesale = computed(() => { 
		return props.product_base_data?.wholesale || {}
	})
	const add_cart_disabled = computed(() => {
		// return product_num_disabled.value || product_num.value == 0
		if(props.isOrder) {
			return checked_product_num.value < product_wholesale.value.num
		}
		return checked_product_num.value == 0
	})
	const product_img_preview = computed(() => {
		let img = '';
		if(props.product_base_data.id) {
			img = props.product_base_data.pic.split('|')[0]
		}
		if(active_sku_preview_img.value){
			img = active_sku_preview_img.value;
		}
		return img 
	})
	const active_sku_price = computed(() => {
		let price = '';
		let i = findIndexby()
		if(i == -1) {
			price = props.product_base_data.price
		}
		else {
			price = props.spec_prices[i].price
		} 
		return price 
	})
	const confirmBtnText = computed(() => {
		let text = ''
		if(props.isOrder) {
			if(product_wholesale.value.num > checked_product_num.value) text = `注意商品起批数量(${checked_product_num.value}/${product_wholesale.value.num})` 
			else text = '立即购买'
		} else {
			if(checked_product_num.value == 0) text = '请选择数量'
			else text = '加入购物车'
		}
		return text 
	})
	watch(
		() => props.spec_prices,
		(n) => {
			let arr = uni.$u.deepClone(n)
			spec_prices_arr.value = arr.map(ele => {
				ele.label = Object.keys(ele.specs)
				ele.values = Object.values(ele.specs)
				ele.num = 0
				ele.specs_arr = cart.specs2Obj(ele.specs)
				ele.stock = +ele.stock
				return {...ele}
			}).filter(item => item.stock != 0)
			console.log(spec_prices_arr.value)
		} 
	)
	watch(
		() => props.sku,
		(n) => {
			sku_arr.value = sku2treeData(n)  
			console.log(sku_arr.value)
			sku_arr.value.forEach(ele => {
				sku_form.value[ele.label] = ''
			})
			console.log(sku_form.value)
		}
	)
	watch(
		() => product_num_max.value,
		(val, old) => {
			console.log(val);
			if(val <= product_num.value) {
				product_num.value = product_num_max.value 
			} else product_num.value = min.value
			nextTick(() => {
				// countRef.value.init()
			})
		} 
	)
	watch(
		() => product_num.value,
		(val, old) => {
			// console.log(val); 
			if(val > product_num_max.value) {
				product_num.value = product_num_max.value
				nextTick(() => {
					// countRef.value.init()
				})
			}
		} 
	)
	onMounted(async () => {  
	})  
	function setRef(el, i) { 
		if(el) {
			countRefs.value[i] = el
		}
	}
	function onSelectSku(key, value) { 
		if(sku_form.value[key] == value) {
			value = ''
			active_sku_preview_img.value = ''
		}  
		sku_form.value[key] = value 
		// checkSkuDisabled()
		if(Object.values(sku_form.value).filter(ele => !ele).length == 0) {
			setMaxCount()
		} 
	}
	function setMaxCount() {
		// console.log(product_sku.form)
		let i = props.spec_prices.map(ele => ele.specs).findIndex(ele => {
			// console.log(ele, product_sku.form)
			return isObjectEqual(ele, sku_form.value)
		})
		// console.log(i)
		if(i != -1) {
			let count = props.spec_prices[i].stock;
			if(count == 0) {
				product_num.value = 0
			}
			product_num_max.value = +count
			active_sku_preview_img.value = props.spec_prices[i].img
		}
	} 
	
	function numChange(e, id, index) {  
		let i = spec_prices_arr.value.findIndex(ele => ele.id == id) 
		if(i == -1) return;
		spec_prices_arr.value[i].num = e.value 
		nextTick(() => {
			countRefs.value[index].init()
		})
		 
	}
	
	function numOverlimit(e) {
		console.log(e)
	}
	
	function inputBlur(e) {
		console.log(e) 
		// let num = e.value ? +e.value : 0
		// if(num != product_num.value) {
		// 	if(num < +min.value) {
		// 		num = +min.value
		// 	}
		// 	product_num.value = num
		// 	nextTick(() => {
		// 		// countRef.value.init()
		// 	})
		// }
		
	}
	function onImgClick() {
		uni.previewImage({
			urls: [product_img_preview.value],
			current: 0,
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
	function findIndexby () {
		return props.spec_prices.map(ele => ele.specs).findIndex(ele => isObjectEqual(ele, sku_form.value) );
	}
	function addCartBtn() {
		let skuItem 
		let shop = props.product_shop_data || {}
		// let i = findIndexby()  
		// if(i == -1) return
		// let img = props.spec_prices[i].img ? props.spec_prices[i].img : props.product_base_data.pic?.split('|')[0]
		// skuItem = {
		// 	...props.spec_prices[i],s
		// 	img, 
		// 	num: +product_num.value,
		// 	
		// 	price: props.product_base_data.wholesale.price,
		// 	checked: props.isOrder? true :false,
		// }  
		skuItem = spec_prices_arr.value.filter(ele => ele.num > 0).map(ele => {
			return {
				...ele, 
				name: props.product_base_data.name,
				freight_id: props.product_base_data.freight_id,
				checked: props.isOrder? true :false,
				znum: +props.product_base_data.wholesale.num, 
			}
		}) 
		let product = {
			base: props.product_base_data,
			checked: props.isOrder? true :false,
			znum: +props.product_base_data.wholesale.num, 
			list: spec_prices_arr.value.filter(ele => ele.num > 0) 
		}
		if(props.isOrder) {
			let flag = cart.addOrderProduct( skuItem, shop, product )
			if(flag) {
				emits('onConfirm')
			}
		}
		else {
			let flag = cart.addProduct2Cart( skuItem, shop, product )
			if(flag) {
				uni.showToast({
					title: '成功加入购物车！',
					icon: 'success'
				})
				attrs.onUpdateShow(false)
			}
		}
		
	}
	 
</script>

<style lang="scss" scoped>
	.list-w { 
		// background-color: #f2f2f2;
		position: relative;
		.load-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 20;
			background-color: rgba(255,255,255,.6);
		}
		.list-item {
			position: relative;
			z-index: 10;
			height: 100%;
			&.item-left {
				flex: 0 0 35%;
				background-color: #f8f8f8;
			}
		}
	} 
	.main-list {
		height: 55vh;
		box-sizing: border-box;
		.item {
			.label {
				font-weight: bold;
				color: #000;
			}
			.sku-items {
				.sku-items-tag {
					height: 34px;
					line-height: 34px;
					padding: 0 15px;
					margin-bottom: 10px;
					margin-right: 10px;
					border-radius: 6px;
					background-color: #f2f2f2; 
					color: #333; 
					box-sizing: border-box;
					border: 1rpx solid #f2f2f2;
					&.active {
						background-color: $u-error-light;
						color: $u-error; 
						border-color: $u-error; 
					}
					&.disabled {
						background-color: #f8f8f8;
						color: #aaa; 
						border-color: #f8f8f8;
					}
				}
			}
		}
	} 
</style>
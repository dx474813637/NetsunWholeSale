<template>
	<view class="shop-card u-radius-16 bg-white u-p-b-50 u-p-10" @click="gotoDetail">
		<view class="shop-card-header u-flex u-flex-items-center u-flex-between u-p-15">
			<view class="u-flex u-flex-items-center"> 
				<view class="u-m-r-10">
					<u-icon name="home" color="#999" size="20"></u-icon> 
				</view>
				<view class="u-font-30 u-line-1">网盛特卖<!-- {{ dataList.id }} --></view>
				<!-- <view class="u-m-l-20">
					<u-icon name="arrow-right" color="#999" size="14"></u-icon>
				</view> -->
			</view>
			<view class="u-m-l-20 u-error text-nowrap u-font-30">
				{{ order_zt2str }}
			</view>
		</view>
		<view class="shop-card-main"> 
			<view class="item" v-for="item in dataList.pid" :key="item.id">
				<OrderProductRowCard
					:product="item"
				></OrderProductRowCard>
			</view>
			<!-- <view 
				class="product-item u-flex u-flex-items-start u-p-15"
				v-for="product in dataList.pid"
				:key="product.id"
				> 
				<view class="item" >
					<up-image 
					show-loading
					:src="product.img" 
					width="70px" 
					height="70px" 
					radius="8"
					:customStyle="{border: '1rpx solid #f8f8f8'}"
					></up-image>
				</view>
				<view class="item u-flex-1 u-m-l-15 info u-font-28" >
					<view class="title u-line-1 u-m-b-10" >
						{{product.name}}
					</view>
					<view class="sku u-line-2 u-info u-font-28 " >
						<text class="u-m-r-15" v-for="(specs, index) in product.specs_arr" :key="index">
							<text>{{specs.label}}：{{specs.value}}；</text>
						</text>
					</view> 
				</view>
				<view class="item u-m-l-30 info u-font-28 u-text-right" >
					<view class="u-flex u-flex-items-center" >
						<text class="u-font-24">￥</text>
						<u-count-to
						:autoplay="false" 
						:startVal="product.price" 
						separator="," 
						:decimals="2"
						fontSize="14" 
						color="#000"
						></u-count-to>
					</view>
					
					<view class="u-info">x {{product.num}}</view> 
				</view>
			</view> -->
			
			<view class="u-flex u-flex-between u-flex-items-center u-p-10">
				<view class="item u-info u-font-26 u-flex u-flex-items-center">
					<u-icon name="calendar-fill" size="18" color="#999"></u-icon>
					<view class="u-m-l-10">{{dataList.ctime}}</view>
				</view>
				<view class="item u-flex u-flex-items-center u-font-28">
					<view class="u-m-r-10">合计</view>
					<view class="u-flex u-flex-items-center">
						<view style="color: #fd2e2e;">￥</view>
						<u-count-to  
						:endVal="dataList.total_fee" 
						separator="," 
						:decimals="2"
						fontSize="16"
						bold
						duration="100"
						color="#fd2e2e"
						></u-count-to>
					</view>
				</view>
			</view>
			 
		</view>
	</view>

</template>

<script setup>
	import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch } from 'vue'
	// import { share } from '@/composition/share.js'
	import { baseStore } from '@/stores/base'
	import {userStore} from '@/stores/user'
	import useFilter from '@/composition/useFilter.js'
	const user = userStore()
	const { tmp_id_list } = toRefs(user)
	const base = baseStore();
	const { home, roomList, themeColor } = toRefs(base)
	const props = defineProps({
		origin: {
			type: Object,
			default: () => {
				return {}
			}
		},
		gotoDetail: {
			type: Boolean,
			default: true
		}
	})
	const zt = computed(() => {
		return {
			order_zt: props.origin.status
		}
	})
	const { 
		order_zt2str
	} = useFilter(zt)
	
	const emits = defineEmits(['cardClick'])
	const dataList = computed(() => {
		return {
			...props.origin,
			pid: props.origin.pid.map(ele => { 
				let specs = JSON.parse(ele.specs)
				ele.specs_arr = Object.keys(specs).map(ele => {
					return {
						label: ele,
						value: specs[ele]
					}
				}) 
				return {
					...ele
				}
			})
		}
	})
	
	function gotoDetail() {
		if(props.gotoDetail) {
			base.handleGoto({
				url: '/pages_user/order/orderDetail',
				params: {
					id: props.origin.id
				}
			})
			return
		}
		emits('cardClick', {data: props.origin})
	}
	
	
</script>

<style lang="scss" scoped>
	.shop-card-header {
		border-bottom: 1rpx solid #f8f8f8;
	}
	.shop-card-main {
		.product-item {
			.item {
				&.checkbox {
					height: 70px;
				}
				&.info {
					min-height: 70px;
				}
			}
		}
	}
</style>
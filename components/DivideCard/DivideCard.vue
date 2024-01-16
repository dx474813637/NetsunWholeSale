<template>
	<view class="card-header bg-white u-radius-8 uni-shadow-base u-p-30"> 
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.id">
			<view class="item u-info">订单ID</view>
			<view class="item">
				<text class="text-primary u-p-r-20" @click="emits('orderProductsBtn', props.origin.pid)">查看订单商品</text>
				<text>{{props.origin.order_id}}</text>
			</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.tuan_id">
			<view class="item u-info">团ID</view>
			<view class="item">{{props.origin.tuan_id}}</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.fx_login">
			<view class="item u-info">分销账号</view>
			<view class="item">{{props.origin.fx_login}}</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.order_total_fee">
			<view class="item u-info">订单总价（元）</view> 
			<view class="item"> 
				<up-text mode="price" :text="props.origin.order_total_fee"></up-text>
			</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.refund_fee">
			<view class="item u-info">退款（元）</view> 
			<view class="item">
				<up-text mode="price" :text="props.origin.refund_fee"></up-text> 
			</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.divide_total_fee">
			<view class="item u-info">总分成（元）</view> 
			<view class="item">
				<up-text mode="price" :text="props.origin.divide_total_fee"></up-text> 
			</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.tuan_total_fee">
			<view class="item u-info">团长分成（元）</view> 
			<view class="item">
				<up-text mode="price" :text="props.origin.tuan_total_fee"></up-text> 
			</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.daren_total_fee">
			<view class="item u-info">达人分成（元）</view> 
			<view class="item">
				<up-text mode="price" :text="props.origin.daren_total_fee"></up-text> 
			</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" >
			<view class="item u-info">分成状态</view>
			<view class="item text-primary">{{divide_rz_status}}</view>
		</view> 
		<view class="u-flex u-flex-between u-flex-items-center u-p-5 u-m-b-10" v-if="props.origin.ctime">
			<view class="item u-info">时间</view>
			<view class="item u-info">{{props.origin.ctime}}</view>
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
	})
	const zt = computed(() => {
		return {
			divide_rz_status: props.origin.zt
		}
	})
	const { 
		divide_rz_status
	} = useFilter(zt)
	
	const emits = defineEmits(['cardClick', 'orderProductsBtn']) 
	
	function gotoDetail() {
		// if(props.gotoDetail) {
		// 	base.handleGoto({
		// 		url: '/pages_user/order/orderDetail',
		// 		params: {
		// 			id: props.origin.id
		// 		}
		// 	})
		// 	return
		// }
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
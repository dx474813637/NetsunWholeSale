<template>
	<view class="card-header bg-white u-radius-12 uni-shadow-base u-p-30" @click="analysisBtn"> 
		<view class=" u-flex u-flex-between u-flex-items-center">
			<up-image
				showLoading
				:src="props.origin.img"
				width="50px"
				height="50px"
				shape="circle" 
			></up-image>
			<view class="u-flex-1 u-p-l-20">
				<view class="u-m-b-10">{{props.origin.name}}</view>
				<view class="u-info u-font-28">{{props.origin.uptime}}</view>
			</view> 
		</view>
		
	</view>

</template>

<script setup>
	import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch } from 'vue' 
	const props = defineProps({
		origin: {
			type: Object,
			default: () => {
				return {}
			}
		}, 
		kg: {
			type: Number,
			default: 0
		}, 
	}) 
	
	const emits = defineEmits(['cardClick', 'analysis']) 
	
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
	function analysisBtn() {
		if(props.kg == 0) return
		emits('analysis', {data: props.origin})
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
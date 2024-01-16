<template>
	<view class="service-card u-border u-radius-10 " style="overflow: hidden;">
		<view class="u-flex u-flex-between u-flex-items-center u-p-20 u-border-bottom" style="background-color: #f8f8f8;">
			<view class="item  u-font-32">
				{{origin.cate}} - {{origin.zt_title}}
			</view>
			<view class="item text-base u-font-26">
				{{origin.uptime}}
			</view>
		</view>
		<view class="shop-card-main">
			<view class="item" v-for="item in origin.pid" :key="item.id">
				<OrderProductRowCard
					:product="item"
				></OrderProductRowCard>
			</view>
			
			 
			 
		</view>
		<view class="u-flex u-flex-between u-flex-items-center u-p-20"> 
			<view class="item text-base ">
				具体原因：{{origin.info}}
			</view>
		</view>
		<view class="u-flex u-flex-items-start u-flex-wrap u-p-20" v-if="origin.img">
			<view class="item u-m-10"
				v-for="(img, index) in origin.img.split('|')"
				:key="index"
				@click="previewImage(index, origin.img.split('|'))"
			>
				<up-image
					width="60px"
					height="60px"
					radius="5px"
					:src="img"
					:customStyle="{border: '1px solid #eee'}"
				></up-image>
			</view>
			
		</view>
	</view> 
</template>

<script setup>
	// import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch } from 'vue'
	// import { share } from '@/composition/share.js'
	import { baseStore } from '@/stores/base'
	import {userStore} from '@/stores/user'
	// import useFilter from '@/composition/useFilter.js'
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
	function previewImage(index, imgs) {
   		uni.previewImage({
   			urls: imgs,
   			current: index, 
   			loop: true
   		})
   	}
	// const zt = computed(() => {
	// 	return {
	// 		order_zt: props.origin.status
	// 	}
	// })
	// const { 
	// 	order_zt2str
	// } = useFilter(zt)
	
	// const emits = defineEmits(['cardClick'])
	// const dataList = computed(() => {
	// 	return {
	// 		...props.origin,
	// 		pid: props.origin.pid.map(ele => { 
	// 			let specs = JSON.parse(ele.specs)
	// 			ele.specs_arr = Object.keys(specs).map(ele => {
	// 				return {
	// 					label: ele,
	// 					value: specs[ele]
	// 				}
	// 			}) 
	// 			return {
	// 				...ele
	// 			}
	// 		})
	// 	}
	// })
	
	// function gotoDetail() {
	// 	if(props.gotoDetail) {
	// 		base.handleGoto({
	// 			url: '/pages_user/order/orderDetail',
	// 			params: {
	// 				id: props.origin.id
	// 			}
	// 		})
	// 		return
	// 	}
	// 	emits('cardClick', {data: props.origin})
	// }
	
	
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
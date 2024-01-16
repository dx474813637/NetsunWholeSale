<template>
	<view class="card u-radius-8 uni-shadow-base bg-white" :style="customStyle" @click.stop="gotoDetail">
		<view class="img-w">
			<!-- <view class="img">
				<up-image
					showLoading 
					width="100%" 
					mode="widthFix"
					:src="previewImg"
				 />
			</view> -->
			<view class="img"> 
				<zeroLazyLoad   
					:image="previewImg" 
					imgMode="scaleToFill"
					height="100%"
					></zeroLazyLoad>
			</view>
			<!-- <image 
				class="img" 
				mode="aspectFill"
				:src="previewImg"
			 /> -->
		</view>
		<slot name="content">
			<view class="content-w u-p-20 u-font-32">
				<view class="u-line-1 u-m-b-10">
					{{origin.name}}
				</view>
				<view class="u-flex u-flex-between u-flex-items-center u-m-b-10"> 
					<view class="u-font-32" style=" color: #fa3534;">
						<text class="u-font-28">￥</text>
						<text class="text-bold u-font-38" style="font-family: cursive;">{{origin.price1}}</text> 
					</view>
					<!-- <view class="u-info u-font-26">已售{{origin.sales_volume}}件</view> -->
				</view>
				<view class="u-flex u-flex-items-center u-flex-between  u-m-b-10"  
					v-if="origin.price"
				>  
					<view class="item u-font-28 u-info " style=" text-decoration: line-through;">
						<text>￥</text>
						<text>{{origin.price}}</text>
					</view>
					<view class="item " >
						<view class="u-info u-font-26">已售{{origin.sales_volume}}件</view>
						<!-- <view class="u-info u-font-26">{{$u.timeFrom(new Date(origin.uptime).getTime(), false)}}</view> -->
					</view>
				</view>
			</view>
		</slot>
		
		
	</view>
</template>

<script setup> 
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'  
	import {useCateStore, baseStore} from '@/stores/base.js'
	import zeroLazyLoad from '@/uni_modules/zero-lazy-load/components/zero-lazy-load/zero-lazy-load.vue'
	const base = baseStore()
	const props = defineProps({
		origin: {
			type: Object,
			default: () => ({})
		},
		customStyle: {
			type: Object,
			default: () => ({})
		},
	})
	
	const previewImg = ref('');
	watch(
		() => props.origin,
		(n) => {
			previewImg.value = n.pic.split('|')[0]
		},
		{
			immediate: true,
			deep: true
		}
	)
	function gotoDetail() {
		base.handleGoto({
			url: '/pages/product/productDetail',
			params: {
				id: props.origin.id, 
			}
		})
	}
</script>

<style lang="scss" scoped>
	.card {
		overflow: hidden;
	}
	.img-w {
		width: 100%;
		padding-top: 100%;
		position: relative;
		overflow: hidden;
		.img {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
<template>
	<view class="card u-radius-8 uni-shadow-base bg-white u-flex" :style="customStyle">
		<view class="img-w" @click.stop="gotoDetail"> 
			<!-- <image 
				class="img" 
				mode="aspectFill"
				:src="previewImg"
			 /> -->
			<view class="img">
				<zeroLazyLoad
					:image="previewImg" 
					imgMode="scaleToFill"
					height="100%"
					:border-radius="16"
					></zeroLazyLoad>
			</view> 
			
		</view>
		<slot name="content">
			<view class="content-w u-p-10 u-p-l-20 u-p-r-20 u-p-b-10 u-font-32 u-flex-1 u-flex-column u-flex-between u-flex-items-start">
				<view class="u-line-2 u-m-b-10" style="width: 100%;" @click.stop="gotoDetail">
					{{origin.name}}
				</view>
				<view class="u-flex u-flex-between " style="width: 100%;"
					:class="{
						'u-flex-items-center': mode == 'switch',
						'u-flex-items-end': mode == 'normal',
					}"
				>
					<view class="item">
						<view class="item u-font-28 u-info" style=" text-decoration: line-through;">
							<text>￥</text>
							<text>{{origin.price}}</text>
						</view>
						<view class="u-flex u-flex-items-center">
							<view class="u-font-32" style=" color: #fa3534;">
								<text class="u-font-28">￥</text>
								<text class="text-bold u-font-38" style="font-family: cursive;">{{origin.price1}}</text> 
							</view>
							<!-- <view class="u-info u-font-26 u-m-l-20">{{$u.timeFrom(new Date(origin.uptime).getTime(), false)}}</view> -->
						</view>
					</view>
					<view class="item " v-if="mode == 'switch'">
						<u-switch 
							v-model="origin.checked" 
							asyncChange 
							@change="swicthClick" 
							:loading="origin.loading"
							activeColor="#f00"
						></u-switch>
					</view>
					<view class="item " v-if="mode == 'normal'">
						<view class="u-info u-font-26">已售{{origin.sales_volume}}件</view>
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
		mode: {
			type: String,
			default: 'switch'
		}
	})
	
	const emits = defineEmits(['checkedClick'])
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
	function swicthClick(e) { 
		
		emits('checkedClick', {check: e, origin: props.origin})
	}
</script>

<style lang="scss" scoped>
	.card {
		overflow: hidden;
	}
	.img-w { 
		flex: 0 0 100px;
		.img { 
			width: 100px;
			height: 100px;
			display: block;
		}
	}
	.content-w {
		flex: 0 0 calc(100% - 100px); 
		box-sizing: border-box;
	}
</style>
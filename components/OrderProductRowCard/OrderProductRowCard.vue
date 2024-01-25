<template>
	<view class="product-item u-flex u-flex-items-start u-p-15" > 
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
				<!-- <text class="u-font-24">￥</text> -->
				<!-- <u-count-to
				:autoplay="false" 
				:startVal="product.pprice" 
				separator="," 
				:decimals="2"
				fontSize="14" 
				color="#000"
				></u-count-to> -->
				<up-text mode="price" :text="product.pprice" size="14"></up-text>
			</view>
			
			<view class="u-info">x {{product.num}}</view> 
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		product: {
			type: Object,
			default: () => {
				return {}
			}
		}
	})
</script>

<style lang="scss" scoped>
 
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
</style> 
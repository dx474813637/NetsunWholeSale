<template>
	<view class="card-bg u-radius-12 u-p-40 text-white" :style="{
		backgroundColor: origin.bgColor
	}">
		<view class="u-flex u-flex-between u-flex-items-start u-m-b-20">
			<view class="item">
				<view class="u-font-40 text-bold u-m-b-10">{{origin.title}}</view>
				<!-- <view class="u-font-28 text-thin u-m-b-10">食品饮料有限公司</view>
				<view class="u-font-28 text-thin u-m-b-10">销售经理</view> -->
			</view>
			<view class="item u-p-10">
				<u-icon name="arrow-right-double" color="#fff" size="20"></u-icon>
				<!-- <up-image
					width="60"
					height="60"
					src="https://wx3.y.netsun.com//Public/upload/wx/2023/06/648bf770de621.jpg"
					shape="circle"
				></up-image> -->
			</view>
		</view> 
		<view class="u-font-26 u-m-b-6" v-if="origin.sub">
			<u-parse :content="origin.sub"></u-parse>
		</view>
		<!-- <view class="u-font-26 u-m-b-6">19925844654</view>
		<view class="u-font-26 u-m-b-6">400-8848-001</view>
		<view class="u-font-26 u-m-b-6 u-line-2">北京市朝阳区望京SOHO塔1C座2705</view> -->
	</view>
</template>

<script setup> 
	const props = defineProps({
		origin: {
			type: String,
			default: () => {
				return {}
			}
		}
	})
</script>

<style lang="scss" scoped>
	.card-bg {
		// background-image: url('https://wx.rawmex.cn/Public/share/ditu.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-color: #007aff;
	}
</style>
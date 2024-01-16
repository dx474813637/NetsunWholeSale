<template>
	<view class="tabbar" :style="[customStyle]">
		<view class="c-w" :style="[mainStyle]">
			<slot></slot>
		</view>
		
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script setup>
	import { onLoad, onReady } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
		
	const props = defineProps({
		customStyle: {
			type: Object,
			defualt: () => {
				return {}
			}
		},
		mainStyle: {
			type: Object,
			defualt: () => {
				return {}
			}
		}
	})
</script> 

<style scoped lang="scss">
	.tabbar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		z-index: 49;
		// border-top: 1rpx solid #eee;
	}
	.c-w {
		height: 60px;
		transition: all .3s;
	}
</style>

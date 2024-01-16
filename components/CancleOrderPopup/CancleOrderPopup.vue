<template>
	<view>
		<u-popup 
			:bgColor="bgColor" 
			:show="show2" 
			mode="center"
			@close="close" 
			@open="open"
			round="8"
			:safeAreaInsetBottom="false"
		>
			<view class="wrapper">
				<view class="wrapper-header  u-p-20 "> 
					<slot name="header">
						<view class="u-flex u-flex-center u-flex-items-center text-base"> 
							提示
						</view>
					</slot> 
				</view>
				<view class="wrapper-main" :style="{backgroundColor: bgColor}">
					<view class="list-w bg-white u-p-20">
						<view class="main-list  u-p-50 u-flex u-flex-center u-flex-items-center" > 
							是否取消订单
						</view>  
					</view>  
				</view>
				<view class="wrapper-footer u-flex u-flex-items-center u-flex-between text-base">
					<slot name="footer">
						<view class="item u-flex-1 u-p-20 u-flex u-flex-center" @click="close" >
							取消
						</view>
						<u-line direction="col" length="20px"></u-line>
						<view class="item u-flex-1 u-p-20 u-flex u-flex-center" @click="confirmBtn">
							确认
						</view>
					</slot>
					
				</view>
			</view>
		</u-popup> 
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
		useAttrs
	} from 'vue' 
	const attrs = useAttrs()
	const $api = inject('$api')
	import { baseStore } from '@/stores/base'
	const base = baseStore();
	const { themeColor } = toRefs(base)
	import { userStore } from '@/stores/user'
	const user = userStore();
	const { user_info } = toRefs(user)
	 
	const props = defineProps({  
		list: {
			type: Array,
			default: () => {
				return []
			},
		},
		show: {
			type: Boolean,
			default: false
		},
		bgColor: {
			type: String,
			default: ''
		}
	})   
	const show2 = ref(false)
	watch(
		() => props.show,
		(n) => { 
			show2.value = n
		}
	)
	const score = ref(0)
	const emits = defineEmits(['submitEvent', 'closeEvent'])
	onMounted(async () => { 
		
	})  
	function onChange () {
		
	}
	function close() { 
		emits('closeEvent')
	}
	async function confirmBtn () { 
		emits('submitEvent')
	} 
</script>

<style lang="scss" scoped>
	.wrapper {
		width: 60vw;
	}
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
	.nav-item {
		color: #666; 
		&.active-nav {
			background-color: #f2f2f2;
			color: $u-primary; 
		}
	}
	.main-list {
		height: 100%;
		box-sizing: border-box;
	}
	.item-card { 
		background-color: #e8e8e8;
		box-sizing: border-box;  
		margin-bottom: 10px; 
		padding: 10px;
		color: #666;
		border-radius: 5px;
		border: 1rpx solid #e8e8e8;
		&.active {
			background-color: $u-primary-light;
			color: $u-primary;
			border-color: $u-primary;
		}
	}
</style>
<template>
	<view>
		<PopupNormal v-bind="$attrs" > 
			<view class="list-w bg-white">   
				<scroll-view class="main-list  u-p-30" scroll-y >
					<view class="u-m-b-20" v-if="list.express">
						<view class="service-card u-border u-radius-10 " style="overflow: hidden;">
							<view class=" u-p-20">
								<view class="item text-bold u-font-32 u-m-b-10" @click="copy(list.express.express)">
									<text>单号：{{list.express.express}}</text>
									<text class="text-thin u-m-l-10">[复制]</text> 
								</view>
								<view class="item text-base u-font-28">
									同步时间：{{list.express.uptime}}
								</view>
							</view> 
						</view> 
					</view> 
					<view class="service-card u-border u-radius-10 " style="overflow: hidden;">
						<view class="u-flex u-flex-between u-flex-items-center u-p-20 u-border-bottom" style="background-color: #f8f8f8;">
							<view class="item text-bold u-font-32">
								物流详情
							</view> 
						</view> 
						<view class="u-flex u-flex-items-start u-flex-wrap u-p-20" v-if="express_list && express_list.length > 0">
							<u-steps current="0" direction="column"  activeColor="#f00" inactiveColor="#eee">
								<u-steps-item 
									v-for="(item, index) in express_list"
									:key="item.id"  
									:title="item.desc"
								>
									<template #icon>
										<view class="slot-icon u-flex u-flex-items-center u-flex-center" :class="{active: index == 0}" >
											<u-icon :name="index == 0 ? item.activeIcon :item.inactiveIcon " color="#fff"></u-icon> 
										</view>
									</template>
									
									<template #desc>
										<view class="express-card u-font-28" >
											<text>
												{{item.title}}
											</text>
										</view>
									</template>
								</u-steps-item>
							</u-steps>
							
						</view>
					</view>  
				</scroll-view> 
			</view>  
		</PopupNormal>
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
			type: Object,
			default: () => {
				return {}
			},
		}
	})   
	const express_list = computed(() => props.list.express_list)
	onMounted(async () => { 
	})  
	
	function copy(data) {
		uni.setClipboardData({
			data,
			success() {
				uni.showToast({
					title: '复制单号成功'
				})
			}
		})
	}
</script>
<style lang="scss">
	page {
		::v-deep {
			.u-steps-item__content {
				flex: 0 0 300px!important;
			}
		}
	}
</style>
<style lang="scss" scoped>
	.list-w {
		height: 80vh;
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
	.service-card {
		box-sizing: border-box;
		width: 100%;
	}
	.slot-icon {
		width: 23px;
		height: 23px;
		background-color: #b6b7b9;
		border-radius: 100px;  
		flex: 0 0 23px;
		&.active {
			background-color: $u-error;
			
		}
	}
	.express-card {
		word-break: break-all;
		width: 300px;
		flex: 1;
	}
</style>
<template>
	<view class="w">
		<view class="bg" >
			<image :src="list.top" mode="widthFix" ></image>
		</view>
		<view class="main">
			<view class="u-radius-8 u-p-12 bg-white u-m-b-30">
				<view class="u-flex u-flex-items-center u-flex-between u-p-12">
					<!-- <view class="item u-font-34 text-nowrap u-m-r-10">{{list.title1}}</view> -->
					<view class="item u-flex u-flex-items-center">
						<u-icon name="volume" color="#aaa" size="14"></u-icon>
						<view class="u-m-l-20 u-font-24 text-base u-line-1 text-thin" >{{list.notice}}</view>
					</view>
				</view>
				<view class="banner-w u-flex" v-if="list.banner"> 
					<view class="item u-flex-1">
						<view class="u-p-6">
							<image @click="base.handleGoto(list.banner[0].url)" :src="list.banner[0].img" mode="widthFix" ></image>
						</view>
						<view class="u-p-6" >
							<image @click="base.handleGoto(list.banner[1].url)" :src="list.banner[1].img" mode="widthFix" ></image>
						</view>
					</view>
				</view>
			</view>
			<view class="u-radius-8 u-p-12 bg-white u-m-b-30">
				<view class="tabs-w u-flex u-radius-8" style="background-color: #f8f9fb;">
					<view class="item u-flex u-flex-items-center u-flex-center u-p-t-20 u-p-b-20"
						style="flex: 0 0 33%"
						v-for="item in list.column"
						:key="item.name"
						@click="base.handleGoto(item.url)"
						>
						<up-image :src="item.img" width="20px" height="20px" ></up-image>
						<view class="u-m-l-10 u-font-28">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			<view class="u-radius-8 u-p-12 bg-white u-m-b-30">
				<view class="u-flex u-flex-items-center u-flex-between u-p-12">
					<view class="item u-font-34 text-nowrap u-m-r-10">{{list.title}}</view>
					
				</view>
				<view class="banner-w u-flex u-m-b-12" >
					<view class="item u-flex-1">
						<view class="u-p-6">
							<image :src="list.title_img" mode="widthFix" ></image>
						</view> 
					</view>  
				</view>
			</view>
			<view class="u-flex u-flex-center text-base u-font-28 u-p-40" v-if="list.contact">
				<view @click="base.handleGoto(list.contact.url)">
					<up-text type="info" :text="list.contact.name" decoration="underline"></up-text>
				</view>
			</view>
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view>
	<MenusBar mode="2"></MenusBar>
</template>

<script setup>
	import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import { share } from '@/composition/share.js' 
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore()
	const { setOnlineControl } = share()
	const $api = inject('$api')
	
	const list = ref({})
	
	
	onLoad(async () => {
		await getHome()
	})
	
	async function getHome() {
		const res=  await $api.home2();
		if(res.code == 1) {
			list.value = res.list
			setOnlineControl(res)
		}
	}
	
</script>

<style lang="scss" scoped>
	.w {
		position: relative;
		padding: 15px;
		padding-top: 90px;
		padding-bottom: 60px;
		.bg {
			position: absolute;
			z-index: 10;
			left: 0;
			top: 0;
			width: 100vw;
			image {
				width: 100%;
			}
		}
		.main {
			position: relative;
			z-index: 15;
			.banner-w {
				.item { 
					image {
						width: 100%;
						display: block;
					}
				}
			}
			.tabs-w {
				.item {
					position: relative;
					&::after {
						content: '';
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						background-color: #999;
						height: 20px;
						width: 1px;
					} 
					&:last-child {
						&::after {
							display: none;
						}
					}
				}
			}
		}
	}

</style>

<template>
	<view class="w">
		<view class="bg" >
			<image :src="list.top" mode="widthFix" ></image>
		</view>
		<view class="main">
			<view class="u-radius-8 u-p-12 bg-white u-m-b-30">
				<view class="u-flex u-flex-items-center u-flex-between u-p-12">
					<view class="item u-font-34 text-nowrap u-m-r-10 u-p-l-24 u-p-r-24 u-radius-15 text-white u-p-b-4" style="background-color: #e87d49; ">{{list.title1}}</view>
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
					</view>
					<view class="item u-flex-1">
						<view class="u-p-6">
							<image @click="base.handleGoto(list.banner[1].url)" :src="list.banner[1].img" mode="widthFix" ></image>
						</view>
						<view class="u-p-6" >
							<image @click="base.handleGoto(list.banner[2].url)" :src="list.banner[2].img" mode="widthFix" ></image>
						</view>
					</view>
				</view>
			</view>
			
			<view class="banner-w u-radius-8 u-p-6 bg-white u-m-b-30" v-if="list.ad">
				<view class="u-flex u-flex-items-start u-flex-wrap u-flex-items-center ">
					<view class="item u-p-6" v-for="(item, index) in list.ad" :key="index" style="flex: 0 0 50%; box-sizing: border-box;">
						<image style="width: 100%;" @click="base.handleGoto(item.url)" :src="item.img" mode="widthFix" ></image>
					</view> 
				</view>
			</view>
			
			<view class="u-radius-8 u-p-12 bg-white u-m-b-30">
				<view class="u-flex u-flex-items-center u-flex-between u-p-12">
					<view class="item u-font-34 text-nowrap u-m-r-10 u-p-l-24 u-p-r-24 u-radius-15 text-white u-p-b-4" style="background-color: #e87d49; ">{{list.title2}}</view>
					
				</view>
				<view class="banner-w u-flex u-m-b-12" v-if="list.room">
					<view class="item u-flex-1">
						<view class="u-p-6">
							<image @click="base.handleGoto(list.room[0].url)" :src="list.room[0].img" mode="widthFix" ></image>
						</view> 
					</view> 
					<view class="item u-flex-1">
						<view class="u-p-6">
							<image @click="base.handleGoto(list.room[1].url)" :src="list.room[1].img" mode="widthFix" ></image>
						</view> 
					</view> 
					<view class="item u-flex-1">
						<view class="u-p-6">
							<image @click="base.handleGoto(list.room[2].url)" :src="list.room[2].img" mode="widthFix" ></image>
						</view> 
					</view> 
				</view>
				<view class="tabs-w u-flex u-radius-8 " style="background-color: #f8f9fb;">
					<view class="item u-flex u-flex-items-center u-flex-center u-p-t-20 u-p-b-20"
						style="flex: 0 0 50%"
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
			
			<view class="bg-white u-radius-10 u-p-20 " v-if="list.title3">
				<view class="u-font-28 u-p-10">{{list.title3}}</view> 
				<view class="item page-bg2 u-radius-8 u-flex u-flex-items-center u-p-20" @click="dingyueShow = true">
					<view class="icon-w" v-if="!list.title3_img">
						<u-icon name="man-add" color="#fff"></u-icon>
					</view>
					<u--image 
						v-else
						:src="list.title3_img"
						width="30px"
						height="30px"
					></u--image>
					<view class="u-flex-1 u-m-l-20">
						<view class="u-font-30 u-m-b-10">{{list.title3_name}}</view>
						<view class="u-font-24 text-thin">{{list.title3_info}}</view>
					</view>
					<view>
						<u-button type="primary" plain size="small">{{list.title3_button}}</u-button>
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
	<wxDingyuePopup :show="dingyueShow" @dingyuebtn="dingyueBtn" @close="dingyueShow = false"></wxDingyuePopup> 
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
	
	const dingyueShow = ref(false)
	onLoad(async () => {
		await getHome()
	})
	
	async function getHome() {
		const res=  await $api.home1();
		if(res.code == 1) {
			list.value = res.list
			setOnlineControl(res)
		}
	}
	
	async function dingyueBtn() {
		uni.showLoading()
		const res = await $api.tmp_id_list();
		if(res.code == 1) { 
			subApi(res.list) 
		}
		dingyueShow.value = false
	}
	function subApi(list) {
		wx.requestSubscribeMessage({
			tmplIds: list,
			success: async (res)=>{
				if(res.KIRbQmobnZlPo5OTgaMq6kHRI_zhpwVphn0mY42NeW8 == 'reject') return
				uni.showLoading()
				const res2 = await $api.tmp_id_back({
					params: {
						str: JSON.stringify(res)
					}
				})
				if(res2.code == 1) {
					uni.showToast({
						title: res2.msg,
						icon: 'none'
					})
				}
			}
		})
	}
</script>

<style lang="scss" scoped>
	.w {
		position: relative;
		padding: 15px;
		padding-top: 140px;
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

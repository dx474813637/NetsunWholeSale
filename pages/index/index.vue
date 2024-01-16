<template>
	<view class="w">
		<view class="header-banner">
			<u--image 
				showLoading 
				:src="home.ad1" 
				width="100%" 
				height="auto" 
				mode="widthFix"
				@click="goto(home.ad1_url)"
				></u--image>
		</view>
		<view class="wrapper-main u-p-l-20 u-p-r-20">
			<view class="header-intro u-p-28 bg-white u-radius-8 u-m-b-20">
				<view class="u-flex u-flex-between u-flex-items-center u-m-b-20 ">
					<view class="item">
						<view class="intro-name ">
							{{home.name}}
						</view>
						<view class="intro-info u-font-24 u-flex u-m-t-20" v-if="home.info">
							<view class=" intro-info-item u-p-6 u-p-l-10 u-p-r-10">{{home.info}}</view> 
						</view>
					</view>
					<view class="item">
						<button class="zhuanfa-btn" openType="share">
							<view class="u-flex  u-flex-items-center">
								<view class="u-font-24 u-info" style="line-height: 1em;">转发分享</view>
								<u-icon name="share-square" color="#999" size="30"></u-icon>
							</view>
							
						</button>
						
					</view>
				</view>
				
				<view class="header-banner">
					<u--image 
						showLoading 
						:src="home.ad2" 
						width="100%" 
						height="auto" 
						mode="widthFix"
						@click="goto(home.ad2_url)"
						></u--image>
				</view>
				<view class="intro-address u-p-t-20 u-font-26 u-flex u-flex-between">
					<view class="intro-address-item u-line-2" >{{home.address}}</view> 
					<view class="intro-address-item">
						<u-icon name="phone" size="22" @click="handleMakePhone"></u-icon>
					</view> 
				</view>
			</view>
			<!-- <view class="header-tabs u-p-28 u-p-t-50 u-p-b-50 bg-white u-radius-8 u-flex u-flex-around u-flex-items-start u-m-b-20">
				<view 
					class="item-tabs u-flex-column u-flex-items-center"
					v-for="(item, index) in roomList"
					:key="index"
					@click="base.handleGoto({url: '/pages/reservation/reservation', params: {zb_index: index}})"
					>
						<u--image 
							showLoading
							:src="item.img"
							width="60px"
							height="60px"
							mode="scaleToFill"
							/>
						<view class="u-p-t-30 u-font-28">{{item.name}}</view>
					</view>
			</view> -->
			<view class="header-banner u-m-b-20" v-if="home.ad3">
				<u--image 
					showLoading 
					:src="home.ad3" 
					width="100%" 
					height="auto" 
					mode="widthFix"
					@click="goto(home.ad3_url)"
					></u--image>
			</view>
			<view class="header-banner u-m-b-20" v-if="home.ad4">
				<u--image 
					showLoading 
					:src="home.ad4" 
					width="100%" 
					height="auto" 
					mode="widthFix"
					@click="goto(home.ad4_url)"
					></u--image>
			</view>
			<view class="header-banner u-m-b-20" v-if="home.ad5">
				<u--image 
					showLoading 
					:src="home.ad5" 
					width="100%" 
					height="auto" 
					mode="widthFix"
					@click="goto(home.ad5_url)"
					></u--image>
			</view>
			<view class="header-banner u-m-b-20" v-if="home.ad7">
				<u--image 
					showLoading 
					:src="home.ad7" 
					width="100%" 
					height="auto" 
					mode="widthFix"
					@click="goto(home.ad7_url)"
					></u--image>
			</view>
		</view>
		<u-safe-bottom></u-safe-bottom>
		 
	</view>
	<TabBarYuyue 
		@onInfoShow="handleChangeShow3"
		@onSubmit="dingyueEvent"
	></TabBarYuyue>
	<MyInfoPopup
		:show="showMyInfoPopup"   
		title="我的信息编辑" 
		:onUpdateShow="handleChangeShow3"  
	></MyInfoPopup>	
</template>

<script setup>
	import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import { share } from '@/composition/share.js'
	const { setOnlineControl } = share()
	import {userStore} from '@/stores/user'
	const user = userStore()
	const { tmp_id_list } = toRefs(user)
	import {baseStore} from '@/stores/base'
	const base = baseStore()
	const {home, roomList, themeColor} = toRefs(base)
	const $api = inject('$api')
	const showMyInfoPopup = ref(false)
	onLoad(async () => {
		uni.showLoading()
		const res = await base.getRoomList()
		setOnlineControl(res)
	})
	function handleMakePhone() {
		if(!home.value.phone) return
		uni.makePhoneCall({
			phoneNumber: home.value.phone
		})
	}
	
	async function dingyueEvent() { 
		wx.requestSubscribeMessage({
			tmplIds: tmp_id_list.value,
			success: async (res)=>{ 
				if(res.tjSTqE0hZ0TxMCIerDlXLqhhHNxJ7MxMcB0741EtcFg == 'reject') {
					base.handleGoto({url: '/pages/reservation/reservation', params: {noDingyue: '1'}})
					return
				}
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
					base.handleGoto({url: '/pages/reservation/reservation', params: {noDingyue: '1'}})
				}
			},
			fail: (err) => {
				console.log(err)
			}
		}) 
		
	}
	function handleChangeShow3(data) {
		showMyInfoPopup.value = data
	}
	// function subApi(list) { 
	// 	uni.showModal({
	// 		title: '温馨提示',
	// 		content: '为更好的促进您与商家的交流，服务号需要在您预约时向您发送消息',
	// 		confirmText: "同意",
	// 		cancelText: "拒绝",
	// 		success: (r) => { 
	// 			if(r.confirm) {
	// 				wx.requestSubscribeMessage({
	// 					tmplIds: list,
	// 					success: async (res)=>{ 
	// 						if(res.tjSTqE0hZ0TxMCIerDlXLqhhHNxJ7MxMcB0741EtcFg == 'reject') {
	// 							base.handleGoto({url: '/pages/reservation/reservation', params: {noDingyue: '1'}})
	// 							return
	// 						}
	// 						uni.showLoading()
	// 						const res2 = await $api.tmp_id_back({
	// 							params: {
	// 								str: JSON.stringify(res)
	// 							}
	// 						})
	// 						if(res2.code == 1) {
	// 							uni.showToast({
	// 								title: res2.msg,
	// 								icon: 'none'
	// 							})
	// 							base.handleGoto({url: '/pages/reservation/reservation', params: {noDingyue: '1'}})
	// 						}
	// 					},
	// 					fail: (err) => {
	// 						console.log(err)
	// 					}
	// 				})
	// 			}
	// 			else if(r.cancel) {
	// 				base.handleGoto({url: '/pages/reservation/reservation', params: {noDingyue: '1'}})
	// 			}
				
	// 		} 
	// 	})
		
	// }
	function goto(url) {
		if(!url) return;
		uni.reLaunch({
			url
		})
	}
</script>

<style lang="scss" scoped> 
.w {
	padding-bottom: 60px;
}
.header-banner {
	min-height: 30px;
}
.wrapper-main {
	position: relative;
	top: -20px;
	.header-intro {
		.intro-name {
			font-weight: bold;
		}
		.intro-info {
			color: #000;
			.intro-info-item {
				font-weight: 300;
				background-color: $u-primary-light;
			}
			
		}
	}
}
.zhuanfa-btn {
	background-color: transparent;
	&:after {
		border: none;
	}
}
</style>

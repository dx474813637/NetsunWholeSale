<template>
	<TabBar :customStyle="{boxShadow: '0px -3px 10px rgba(0,0,0,0.1)' }">
		<view class="u-flex u-flex-between u-flex-items-center u-p-l-20 u-p-r-20 u-font-28" style="height: 100%;">
			<view class="item u-flex-1 u-m-r-20">
				<u-button type="primary" shape="circle" @click="submit"  >
					<view class="u-flex"> 
						<text class="u-m-l-8 u-p-b-5 u-font-32">{{submitBtnText}}</text>
					</view>
				</u-button>
			</view>
			<view class="item u-flex-column u-flex-items-center u-m-r-20" v-if="!hideHomeBtn" @click="base.handleGoto({type: 'reLaunch', url: '/pages/home/home2'})">
				<u-icon name="home" :color="themeColor" size="22"></u-icon>
				<view class="u-info">首页</view>
			</view>
			<view class="item u-flex-column u-flex-items-center u-m-r-20" @click="base.handleGoto({type: 'reLaunch', url: '/pages_user/reservation_list/reservation_list'})">
				<u-icon name="list-dot" :color="themeColor" size="22"></u-icon>
				<view class="u-info">我的预约</view>
			</view>
			<view class="item u-flex-column u-flex-items-center u-m-r-20" @click="base.handleGoto({type: 'reLaunch', url: '/pages/reservation_list/reservation_list'})">
				<u-icon name="list-dot" :color="themeColor" size="22"></u-icon>
				<view class="u-info">预约列表</view>
			</view>
			<view class="item u-flex-column u-flex-items-center" @click="showInfo" v-if="!hideMyInfo">
				<u-icon name="account" :color="themeColor" size="22"></u-icon>
				<view class="u-info">我的信息</view>
			</view>
			<!-- <view class="item u-flex u-flex-items-center u-m-r-20 u-p-20" @click="showMyInfoPopup = true">
				<u-icon name="plus"  size="14"></u-icon>
				<view class="u-info u-font-30 u-m-l-10">完善信息</view>
			</view> -->
		</view>
	</TabBar> 
</template>

<script setup>
	// import { onMo } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	
	import { baseStore } from '@/stores/base'
	import {userStore} from '@/stores/user'
	const props = defineProps({
		hideMyInfo: {
			type: Boolean,
			default: false
		},
		hideHomeBtn: {
			type: Boolean,
			default: false
		},
		submitBtnText: {
			type: String,
			default: '我要预约'
		},
	})
	const user = userStore()
	const { tmp_id_list } = toRefs(user)
	const base = baseStore();
	const { home, roomList, themeColor } = toRefs(base)
	const showMyInfoPopup = ref(false)
	
	const emits = defineEmits(['onInfoShow', 'onSubmit'])
	onMounted(async () => { 
		
		await user.sendDingyue()
		if(tmp_id_list.value.length == 0) {
			user.gettmp_id_list()
		}
		
	})
	function showInfo() {
		emits('onInfoShow', true)
	}
	function submit() {
		emits('onSubmit')
	}
</script>

<style lang="scss">

</style>
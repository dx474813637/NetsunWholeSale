<template>
	<view class="u-p-20 w">
		<!-- <view class="u-p-20 u-border-bottom u-m-b-30">
			<view class="title u-font-40 u-m-b-15">
				{{list.title}}
			</view>
			<view class="time u-font-28 u-info">
				{{list.dtime}}
			</view>
		</view> -->
		<view class="html u-p-10" v-if="list.intro">
			<u-parse :content="list.intro"></u-parse>
		</view>
	</view>
	<u-safe-bottom></u-safe-bottom>
	 
</template>

<script setup>
	// import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch } from 'vue'
	import {baseStore} from '@/stores/base.js'
	const base = baseStore()
	import { share } from '@/composition/share.js'
	const {
		setOnlineControl,
		onlineControl
	} = share()
	const $api = inject('$api') 
	const list = ref({}) 
	const id = ref('') 
	onLoad(async (options) => {
		if(options.hasOwnProperty('id')) {
			id.value = options.id
		}
		uni.showLoading()
		getData()
		// if(roomList.value.length == 0) { 
		// 	uni.showLoading()
		// 	await base.getRoomList()
		// } 
	})
	function goto() {
		uni.navigateTo({
			url: list.value.url
		})
	}

	async function getData() {
		const res = await $api.web_news_detail({params: {id: id.value}})
		if(res.code == 1) {
			list.value = res.list
			setOnlineControl(res)
		}
	}

</script>
<style>
	page{
		/* background-color: #fff; */
	}
</style>
<style lang="scss" scoped>
	.w {
		min-height: 100vh;
		padding-bottom: 60px;
	}
	.html {
		line-height: 25px;
		word-break: break-all;
	}
</style>

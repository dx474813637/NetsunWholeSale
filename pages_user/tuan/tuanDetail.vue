<template>
	<view class="u-p-20" > 
		<view class="bg-white u-radius-12 u-p-30 u-info-dark u-m-b-30"> 
			<view class="u-flex u-flex-items-start u-m-b-20 u-flex-between u-font-28">
				<view class="item text-nowrap u-p-r-20">团ID</view>
				<view class="item u-flex-1 u-text-right text-base">{{ list.id }}</view>
			</view>
			<view class="u-flex u-flex-items-start u-m-b-20 u-flex-between u-font-28">
				<view class="item text-nowrap u-p-r-20">团标题</view>
				<view class="item u-flex-1 u-text-right text-base">{{ list.title }}</view>
			</view>
			<view class="u-flex u-flex-items-start u-m-b-20 u-flex-between u-font-28">
				<view class="item text-nowrap u-p-r-20">团标题</view>
				<view class="item u-flex-1 u-text-right text-base">{{ list.info }}</view>
			</view>
			<view class="u-flex u-flex-items-start u-m-b-20 u-flex-between u-font-28">
				<view class="item text-nowrap u-p-r-20">状态</view>
				<view class="item u-flex-1 u-text-right text-base">{{ list.zt }}</view>
			</view>
			<view class="u-flex u-flex-items-start u-m-b-20 u-flex-between u-font-28">
				<view class="item text-nowrap u-p-r-20">分成</view>
				<view class="item u-flex-1 u-text-right text-base">{{ list.divide }}%</view>
			</view>
			 
			<view class="u-flex u-flex-items-start u-m-b-20 u-flex-between u-font-28">
				<view class="item text-nowrap u-p-r-20">创建时间</view>
				<view class="item u-flex-1 u-text-right text-base">{{ list.ctime }}</view>
			</view> 
		</view>
		
		
		<view class="bg-white u-radius-12 ">
			<view class="item u-p-20" >
				<up-button type="error" @click="delBtn">删除该团</up-button>
			</view> 
			
			
		</view>
		
		
	</view> 
</template>

<script setup>
	import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch } from 'vue'
	import useDataList from '@/composition/useDataList.js'
	// import { share } from '@/composition/share.js'
	import { baseStore } from '@/stores/base'
	import {userStore} from '@/stores/user'
	const user = userStore()
	const { tmp_id_list, user:u  } = toRefs(user)
	const base = baseStore();
	const { home, roomList, themeColor } = toRefs(base)
	import useFilter from '@/composition/useFilter.js'
	const zt = computed(() => { 
		return {
			order_zt: !list.value ? '' : list.value.status
		}
	})
	const $api = inject('$api')   
	const id = ref('')
	const list = ref({})
	const { 
		order_zt2str
	} = useFilter(zt) 
	onLoad(async (options) => { 
		if(options.hasOwnProperty('id')) { 
			id.value = options.id
			uni.showLoading()
			await getData()
		} 
	})
	
	async function getData() {
		const res = await $api.tuan_detail({
			params: {
				id: id.value
			}
		})
		if(res.code == 1 ) { 
			list.value = res.list
		}
	} 
	
	async function delBtn() {
		
			uni.showModal({
				title: '提示',
				content: '是否删除该团？',
				success: async function (res) {
					if (res.confirm) {
						const res = await $api.tuan_del({
							params: {
								id: id.value
							}
						})
						if(res.code == 1 ) { 
							uni.showToast({
								title: res.msg,
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 800)
						}
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		
	} 
	
</script>

<style lang="scss" scoped>
	.btns-w {
		.item { 
			box-sizing: border-box;
		}
	}

</style>

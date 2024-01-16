<template>
	<view class="w">
		<view class="list u-p-10">  
			<view class="list-item u-p-10" v-for="item in dataList" :key="item.id"> 
				<view class="u-p-30 item bg-white u-radius-8 card" @click="tuanClick(item)" :class="{
					active: curtid == item.id
				}">
					<view class="u-m-b-20 u-flex u-flex-between u-flex-items-center">
						<view class="u-flex-1 u-line-1">{{item.title}}</view>
						<view class="text-error text-nowrap">分成：{{item.divide}}%</view>
					</view>
					<view class="u-line-2 u-info u-m-b-20">{{item.info}}</view>
					<view class="u-info u-font-28">{{item.ctime}}</view>
				</view> 
				
			</view>
			<template v-if="dataList.length == 0">
				<u-empty mode="data" :icon="base.empty" />
			</template>
			<template v-else>
				<u-loadmore :status="loadstatus" />
			</template>  
				
				
			<u-safe-bottom></u-safe-bottom>
		</view>	 
	</view>
	<u-action-sheet 
		safeAreaInsetBottom 
		:actions="alist" 
		:title="atitle" 
		:show="ashow" 
		@select="aselectClick"
		@close="ashow = false"
		:closeOnClickOverlay="true"
		:closeOnClickAction="true" 
		cancelText="取消"
	></u-action-sheet>
	<MenusBar></MenusBar>
</template>

<script setup>
	import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch } from 'vue'
	import useDataList from '@/composition/useDataList.js'
	// import { share } from '@/composition/share.js'
	import { baseStore } from '@/stores/base'
	import {userStore} from '@/stores/user'
	const user = userStore()
	const { tmp_id_list } = toRefs(user)
	const base = baseStore();
	const { home, roomList, themeColor } = toRefs(base)
	// const {
	// 	setOnlineControl,
	// 	onlineControl
	// } = share()
	const $api = inject('$api')  
	const $http = inject('$http') 
	const options = computed(() => {
		return {
			params: {
				// role: role.value,
				// type: tabs_list.value[tabs_current.value].value
			},
			api: 'tuan',
			getDataCallBack: (res) => {
				if (res.code == 1) {
					dataList.value = [...dataList.value, ...res.list]
					role.value = res.role
					if(dataList.value.length >= res.total) {
						loadstatus.value = 'nomore'
					}
					else {
						loadstatus.value = 'loadmore'
					}
				}
			}
		}
	})
	const atitle = ref('操作选项')
	const alist = ref([
		{
			name:'切换至该团',
			subname:"",  
			disabled: false,
			tid: '',
			index: 1,
		}, 
		{
			name: '删除', 
			color:'#ff0000', 
			disabled: true,
			index: 2,
		}
	])
	const ashow = ref(false)
	const role = ref(0)
	const curTuan = ref({})
	const curtid = ref($http.config.header.tid)
	const { 
		dataList,
		curP,
		loadstatus,
		params,
		getDataList,
		initDataList, 
	} = useDataList(options)
	watch(
		() => role.value,
		(n) => {
			alist.value[1].disabled = n == 0? true : false
		}
	)
	onLoad(async (options) => {
		// if(options.hasOwnProperty('role')) {
		// 	role.value = options.role
		// } 
		initDataList() 
	}) 
	function tuanClick(data) {
		curTuan.value = data
		alist.value[0].subname = data.title 
		alist.value[0].tid = data.id 
		// alist.value[0].disabled = ($http.config.header.tid == data.login)? true :false 
		ashow.value = true
	} 
	function aselectClick(obj) {
		if(obj.index == 1) { 
			$http.setToken({
				tid: obj.tid
			}) 
			curtid.value = obj.tid
			uni.redirectTo({
				url: `/pages/product/productList?tid=${obj.tid}`
			})
		}
		if(obj.index == 2) {
			delEvent()
		}  
	}
	async function delEvent() {
		
			uni.showModal({
				title: '提示',
				content: '是否删除该团？',
				success: async function (res) {
					if (res.confirm) {
						const res = await $api.tuan_del({
							params: {
								id: curTuan.value.id
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

<style scoped lang="scss">
.w {
	min-height: 100vh;
	padding-bottom: 60px;
} 
.card {
	
} 
.card.active {
	background-color: #30a5ff!important;
	color: #fff!important;
	.text-error {
		color: #fff!important;
	}
	.u-info {
		color: #fff!important;
	}
}
</style>
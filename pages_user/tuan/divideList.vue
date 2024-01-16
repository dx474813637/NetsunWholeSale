<template>
	<view class="w">
		<u-sticky bgColor="#f8f8f8">
			<view class="tabs-w">
				<u-tabs
					:list="tabs_list"  
					lineWidth="0"
					:current="tabs_current" 
					:activeStyle="{
						color: themeColor
					}"
					@change="handleTabsChange"
				></u-tabs>	
			</view> 
		</u-sticky>
		
		
		
		<view class="list u-p-10">  
			<view class="list-item u-p-10" v-for="item in dataList" :key="item.id">
				<DivideCard
					:origin="item"
					@orderProductsBtn="orderProductsBtn"
				></DivideCard>
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
	<OrderProductPopup
		:show="showOrderProducts" 
		title="订单商品信息"
		:list="orderProducts"
		:onUpdateShow="handleChangeShow"  
	></OrderProductPopup>
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
	// const role = ref('1') 
	const tabs_current = ref(0)
	const tabs_list = ref([]) 
	const showOrderProducts = ref(false)
	const orderProducts = ref({})
	const options = computed(() => {
		return {
			params: {
				// role: role.value,
				type: tabs_list.value[tabs_current.value].value
			},
			api: 'divide'
		}
	})
	
	const { 
		dataList,
		curP,
		loadstatus,
		params,
		getDataList,
		initDataList, 
	} = useDataList(options)
	
	onLoad(async (options) => {
		// if(options.hasOwnProperty('role')) {
		// 	role.value = options.role
		// }
		
		await initDivideTabsData()
		if(options.hasOwnProperty('zt')) {
			tabs_current.value = +tabs_list.value.findIndex(ele => ele.value == options.zt) 
		}
		initDataList() 
	}) 
	function handleTabsChange(data) {
		tabs_current.value = +data.index
		initDataList()
	}  
	async function initDivideTabsData() {
		const res = await $api.divide_type()
		if(res.code == 1 ) { 
			tabs_list.value = res.list.map(ele => {
				return {
					...ele,
					disabled: false,
					value: ele.type,
					name: ele.name
				}
			})
		}
	}
	function orderProductsBtn(data) {
		console.log(data)
		orderProducts.value = {};
		orderProducts.value = data;
		showOrderProducts.value = true
	}
	function handleChangeShow(v) {
		showOrderProducts.value = v
	}
</script>

<style scoped lang="scss">
.w {
	min-height: 100vh;
	padding-bottom: 60px;
} 
.card {
	
}
</style>
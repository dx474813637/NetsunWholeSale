<template>
	<view class="w u-p-20">
		<!-- <u-sticky bgColor="#f8f8f8">
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
		</u-sticky> -->
		
		<view class="u-p-20" v-if="info">
			<u-parse :content="info"></u-parse>
		</view>
		
		<view class="list u-p-20 bg-white u-radius-10 ">  
			<view class="list-item u-p-20 u-flex u-flex-items-center u-flex-between u-info">
				<view class="item">订单ID</view> 
				<view class="item">可提现金额</view>
			</view>
			<view class="list-item u-p-20 u-flex u-flex-items-center u-flex-between text-black u-border-top" v-for="item in dataList" :key="item.id">
				<view class="item">{{item.order_id}}</view> 
				<view class="item"><up-text type="error" mode="price" :text="item.amount" size="18"></up-text></view>
			</view> 
				
			<u-safe-bottom></u-safe-bottom>
		</view>	 
	</view> 
	<MenusBar></MenusBar>
	<TabBar :customStyle="customStyle">
		<view class="u-flex u-flex-between u-flex-items-center u-p-l-20 u-p-r-20 u-font-28 cart-bar-w" > 
			<view class="item u-m-l-20"> 
				<view class="u-flex u-flex-items-center">
					<view class="u-p-t-4">可提现合计：</view>
					<view class="u-flex u-flex-items-center">
						<up-text type="error" mode="price" :text="sum" size="18"></up-text>
					</view>
				</view> 
			</view> 
			<view class="item u-flex u-flex-items-center" >  
				<view style="width: 100px">
					<u-button type="error" shape="circle" @click="txEvent" >
						<text class="u-font-32">申请提现</text> 
					</u-button>
				</view>  
			</view>
		</view>
	</TabBar> 
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
	const showOrderProducts = ref(false)
	const orderProducts = ref({})
	const info = ref('') 
	const dataList = ref([])
	const customStyle = ref({
		paddingBottom: '50px',
		background: 'transparent' 
	}) 
	const sum = computed(() => dataList.value.reduce((a,b) => a + b.amount, 0))
	onLoad(async (options) => {
		// if(options.hasOwnProperty('role')) {
		// 	role.value = options.role
		// }
		
		// await initDivideTabsData()
		// if(options.hasOwnProperty('zt')) {
		// 	tabs_current.value = +tabs_list.value.findIndex(ele => ele.value == options.zt) 
		// }
		uni.showLoading()
		await getData() 
	}) 
	// function handleTabsChange(data) {
	// 	tabs_current.value = +data.index
	// 	initDataList()
	// }  
	// async function initDivideTabsData() {
	// 	const res = await $api.divide_type()
	// 	if(res.code == 1 ) { 
	// 		tabs_list.value = res.list.map(ele => {
	// 			return {
	// 				...ele,
	// 				disabled: false,
	// 				value: ele.type,
	// 				name: ele.name
	// 			}
	// 		})
	// 	}
	// }
	async function getData() {
		const res = await $api.divide1();
		if(res.code == 1) {
			dataList.value = res.list
			info.value = res.info
		}
	}
	function txEvent(data) {
		uni.showModal({
			title: '提示',
			content: '是否提现',
			success: async function (res) {
				if (res.confirm) {
					const r = await $api.add_linghuo_transfer()
					if(r.code == 1) {  
						uni.showToast({
							title: r.msg,
							icon: 'none'
						}) 
						setTimeout(() => {
							getData()
						}, 800) 
					}
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	function handleChangeShow(v) {
		showOrderProducts.value = v
	}
</script>

<style scoped lang="scss">
	
	.cart-bar-w {
		height: 100%; 
		background-color: #fff;
	}
.w {
	min-height: 100vh;
	padding-bottom: 60px;
} 
.card {
	
}
</style>
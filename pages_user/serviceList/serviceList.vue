<template>
	<view class="w">
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
		
		
		
		<view class="list u-p-20">  
			<view class="list-item u-p-20 bg-white u-m-b-30 uni-shadow-base u-radius-8" v-for="item in dataList" :key="item.id">
				<view class="u-flex u-flex-items-center u-flex-between u-p-10 u-p-b-20">
					<view class="item u-info">售后ID：{{item.id}}</view>
					<view class="item">
						<up-text type="primary" size="18" @click="base.handleGoto({
							url: '/pages_user/order/orderDetail',
							params: {
								id: item.oid
							}
						})"
						text="查看订单"
						></up-text>
					</view>
				</view>
				<OrderServiceCard
					:origin="item"
				></OrderServiceCard>
				<view class="u-flex u-flex-between u-flex-items-center u-info u-font-28 u-p-10" v-if="item.express">
					<view class="item">
						买家快递单
					</view>
					<view class="item">
						{{item.express}}
					</view>
				</view>
				<view class="u-flex u-flex-between u-flex-items-center u-info u-font-28 u-p-10" v-if="item.express1">
					<view class="item">
						卖家快递单
					</view>
					<view class="item">
						{{item.express1}}
					</view>
				</view>
				<view class="u-flex u-flex-between u-flex-items-start u-info u-font-28 u-p-10" v-if="item.address">
					<view class="item text-nowrap u-m-r-20">
						退换货地址
					</view>
					<view class="item" @click="copy(item.address)">
						{{item.address}} <text class="text-error">[点击复制]</text>
					</view>
				</view>
				<view class="u-flex u-flex-between u-flex-items-center u-info u-font-28 u-p-10" >
					<view class="item">
						创建时间
					</view>
					<view class="item">
						{{item.ctime}}
					</view>
				</view>
				<!-- <view class="u-p-t-20 u-p-b-20" v-if="item.zt == '1'">
					<u-button type="error" shape="circle" @click="serviceCardClick(item)">提交快递单号</u-button>
				</view> -->
				<view class="u-p-t-20 u-p-b-20 u-flex u-flex-end" v-if="item.return_id"> 
					<sales-return :returnId="item.return_id">
					    <up-button shape="circle" type="error" slot="refund">立即退货</up-button>  
					    <up-button shape="circle" type="primary" plain slot="refund_detail">退货详情</up-button> 
					</sales-return> 
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
	<OrderServiceExpressPopup
		:show="orderServiceExpressPopupShow" 
		title="提交快递单"   
		:info="express_info"
		:onUpdateShow="handleChangeShow"  
		@submitExpress="submitExpress" 
	></OrderServiceExpressPopup>
	<MenusBar></MenusBar>
	
	<ExpressHelpPopup
		:show="showExpressMoney" 
		:title="button" 
		:info="button_info"
		:homeInfo="info"
		:onUpdateShow="handleChangeShow2" 
		@submit="submit"
	></ExpressHelpPopup> 
	<!-- <TabBar :customStyle="customStyle" v-if="button">
		<view class="u-flex u-flex-between u-flex-items-center u-p-l-20 u-p-r-20 u-font-28 bg-white u-border-top" style="height: 100%;">
			<u-button type="error" shape="circle" @click="showExpressMoney = true">{{button}}</u-button>
		</view>
	</TabBar> --> 
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
	const orderServiceExpressPopupShow = ref(false)
	const $api = inject('$api')   
	const role = ref('1') 
	const tabs_current = ref(0)
	const curTarData = ref({})
	const info = ref({})
	const button = ref('')
	const button_info = ref('')
	const express_info = ref('')
	const showExpressMoney = ref(false)
	const tabs_list = ref([
		{
			name: '全部',
			disabled: false,
			value: '0'
		},
		{
			name: '待付款',
			disabled: false,
			value: '1'
		},
		{
			name: '待收货',
			disabled: false,
			value: '2'
		},
		{
			name: '已完成',
			disabled: false,
			value: '3'
		}
	]) 
	
	const customStyle = ref({
		paddingBottom: '50px',
		background: 'transparent' 
	})  
	const options = computed(() => {
		return {
			params: {
				// role: role.value,
				// type: tabs_list.value[tabs_current.value].value
			},
			api: 'service_list',
			getDataCallBack: (res) => {
				if (res.code == 1) {
					dataList.value = [...dataList.value, ...res.list]
					info.value = res.info
					button.value = res.button
					button_info.value = res.button_info
					express_info.value = res.ainfo
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
		// await initOrderTabsData()
		// if(options.hasOwnProperty('zt')) {
		// 	tabs_current.value = +tabs_list.value.findIndex(ele => ele.value == options.zt) 
		// }
		initDataList() 
	}) 
	function handleTabsChange(data) {
		tabs_current.value = +data.index
		initDataList()
	} 
	 function handleChangeShow(data) {
	 	orderServiceExpressPopupShow.value = data
	 }
	async function initOrderTabsData() {
		const res = await $api.order_type()
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
	async function serviceCardClick(data) {
		curTarData.value = data;
		orderServiceExpressPopupShow.value = true
		
	} 
	function handleChangeShow2(data) {
		showExpressMoney.value = data
	}  
	async function submit(data) {
		uni.showLoading()
		const res = await $api.save_bg({params: {bg: data.name}})
		if(res.code == 1) {
			uni.showToast({
				title: res.msg
			})
			showExpressMoney.value = false
		} 
		initDataList()
	}
	function copy(addr) {
		uni.setClipboardData({
			data: addr,
			success: function () {
				uni.showToast({
					title: '复制成功'
				})
			}
		});
	}
	function submitExpress(data) {
		uni.showModal({
			title: '提示',
			content: '是否提交快递单号',
			success: async function (res) {
				if (res.confirm) {
					const r = await $api.change_service_status({
						params: {
							id: curTarData.value.id,
							...data.params,
						}
					})
					if(r.code == 1) {
						handleChangeShow(false)
						uni.showToast({
							title: r.msg,
							icon: 'none'
						}) 
						await initDataList()
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
	padding-bottom: 110px;
} 
.card {
	
}
</style>
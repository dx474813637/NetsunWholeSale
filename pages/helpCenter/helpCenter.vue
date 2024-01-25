<template>
	<view class="w  "> 
		<view class="navbar-w">
			<navBar
				bgColor="transparent" 
				title=""  
				activeColor="#fff"
			>
				<template #navLeft>
					<view class="u-flex u-flex-items-center left-w u-border u-radius-20 u-p-15 u-p-l-30 u-p-r-30" >
						<view class="btn u-m-r-30" @click="handleBack" v-if="backBtnShow">
							<i class="custom-icon custom-icon-back text-white" ></i>
						</view>  
						<view @click="base.handleGoto({url: '/pages/home/home', type: 'reLaunch'})" class="btn" > 
							<i class="custom-icon custom-icon-home text-white" ></i>
						</view>  
					</view>
				</template>
			</navBar>
		</view>
		<view class="menus-w u-m-20 u-p-30 bg-white u-radius-15">
			<u-scroll-list :indicator="menusList.length > 3">
				<view 
					class="menus-item u-flex-column u-flex-items-center u-p-10 text-base u-radius-12" 
					v-for="(item, index) in menusList" 
					:key="index"
					:class="{
						active: item.name == menusActive
					}"
					@click="changeActiveItem(item)"
				>
					<up-image 
						:src="item.img"
						width="45px"
						height="45px"
					></up-image>
					<view class="u-line-1 u-font-28 u-m-t-15">
						{{item.name}}
					</view>
				</view>
			</u-scroll-list>
		</view>
		<view class="main-list u-m-20 u-p-20 u-radius-15 bg-white">
			<view 
				class="main-list-item u-flex u-flex-items-start u-p-20" 
				v-for="(item, index) in dataList"
				:key="index"
				@click="base.handleGoto({
					url: '/pages/web_danye/web_danye_3',
					params: {
						id: item.id
					}
				})"
			>
				<text class="u-m-r-15 rank-icon text-bold text-nowrap u-font-28"
					:class="{
						rank1: index==0,
						rank2: index==1,
						rank3: index==2,
					}"
				>{{index+1}}</text>
				<text class="u-m-r-30 text-black u-line-2 u-flex-1">{{item.title}}</text>
				<view class="u-p-t-6">
					<u-icon name="arrow-right" color="#666"></u-icon>
				</view> 
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
	<TabBar >
		<view class="u-flex u-flex-between u-flex-items-center u-p-20 u-font-28 u-border-top" > 
			<!-- <u-button type="error" shape="circle" @click="showProductList = true">
				在线客服 
			</u-button> -->
			<button @click="base.handleGoto( kefu, 'serviceChat')" type="error" plain class="service-btn u-p-15" >
				<view class="u-flex u-flex-items-center service-btn-main u-flex-center">
					<view class="u-flex u-flex-items-center">
						<up-image 
							width="30px" 
							height="30px" 
							src="https://wstm.y.netsun.com/Public/tb/wd099.png"  
						></up-image>
						<text class="text-black u-line-1 u-m-l-30 u-font-32">在线客服( 9:00 至 20:00 )</text>
					</view> 
				</view>
			</button>
		</view>
	</TabBar>   
</template>

<script setup> 
	import { share } from '@/composition/share.js'
	const { setOnlineControl, customShareParams } = share()
	const $api = inject('$api')
	import useDataList from '@/composition/useDataList.js'
	
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore()
	const cate = useCateStore()
	const { cate_list, cate_loading } = toRefs(cate)
	import {
		userStore 
	} from '@/stores/user';
	const user = userStore()
	const {user_info, balance} = toRefs(user) 
	const backBtnShow = computed(() => {
		return getCurrentPages().length > 1
	})
	const kefu = ref({})
	const menusActive = ref('')
	const menusList = ref([])  
	function changeActiveItem(data) {
		menusActive.value = data.name
		initDataList() 
	} 
	
	const options = computed(() => {
		return {
			params: {
				cate: menusActive.value
				// role: role.value,
				// type: tabs_list.value[tabs_current.value].value
			},
			api: 'web_news',
			getDataCallBack: (res) => {
				if (res.code == 1) {
					dataList.value = [...dataList.value, ...res.list]
					menusList.value = res.cate
					kefu.value = res.kefu
					setOnlineControl(res)
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
		if(options.hasOwnProperty('menusActive')) {
			menusActive.value = options.menusActive
		}
		initDataList() 
	})
	function handleBack() {
		// $emits('backEvent')
		uni.navigateBack()
	}
	 
	
</script> 
<style lang="scss" scoped> 
	.menus-w {
		box-sizing: border-box;
	}
	.menus-item {
		width: 25%;
		flex: 0 0 25%;
		&.active {
			color: #000!important;
			background-color: #efeefa;
		}
	}
	.main-list {
		min-height: 50vh;
	}
	.navbar-w {
		// position: absolute;
		// top: 0;
		// left: 0;
		width: 100%; 
		box-sizing: border-box; 
		// z-index: 20;
	}
	.w {
		height: 100%;
		min-height: 100vh;
		padding-bottom: 60px;
		box-sizing: border-box;
		background: linear-gradient(to bottom, #B7C9F8, #DEDDFB, $page-bg2 400px);
		.list {
			box-sizing: border-box;
			>.list-item {
				flex: 0 0 50%;
				box-sizing: border-box;
			}
		}
	}
	.left-w {
		background-color: rgba(0,0,0,.5);
		
	}
	.service-btn {
		border: 0; 
		width: 100%;
		background-color: #efeefa;
		.service-btn-main {
			width: 100%;
			line-height: 20px;
		}
	}
	.rank-icon {
		width: 23px;
		height: 23px;
		line-height: 23px;
		border-radius: 20px;
		text-align: center; 
		background-color: #efeefa;
		color: #5c63c3;
		&.rank1 {
			background-color: #767ef8;
			color: #fff;
		}
		&.rank2 {
			background-color: #819df8;
			color: #fff;
		}
		&.rank3 {
			background-color: #9abbf8;
			color: #fff;
		}
	}
</style>

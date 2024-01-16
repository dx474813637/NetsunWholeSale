<template>
	<view class="w "> 
		<view class="shop-main bg-white u-p-30">
			<view class="shop-header u-flex u-m-b-20">
				<view class="item u-m-r-10" v-if="company.img">
					<up-avatar 
						:src="company.img"  
					></up-avatar> 
				</view>
				<view class="item u-flex-1">
					<view class="u-m-b-5 text-bold">{{company.company}}</view>
					<view class="u-font-24 text-thin">{{company.address}}</view>
				</view>
			</view> 
			<view class="shop-footer">
				<view class="u-p-20 u-info u-font-24 u-info-light-bg u-radius-8" >
					<view class="u-line-2">
						{{company.info}}
					</view> 
				</view>
			</view>
		</view>
		<view class="nav-w u-p-20 u-flex" v-if="!terms">
			<view class="item item-cate u-flex u-flex-items-center u-font-28" @click="showCateList = true">
				<view class="u-info">筛选类别：</view>
				<view class="u-primary u-p-r-10">{{cate_label}}</view>
				<u-icon name="arrow-down-fill" color="#ccc" size="12"></u-icon>
			</view> 
		</view> 
		<view class="list u-flex u-flex-wrap u-flex-items-start u-p-10"> 
			 <view 
				class="list-item u-p-14" 
				v-for="item in dataList" 
				:key="item.id"
				>
			 	<ProductColCard
					:origin="item"
				></ProductColCard>
			 		 
			 </view>	
			
			 		
		</view>
		<template v-if="dataList.length == 0">
			<view class="u-flex u-flex-center u-p-40">
				<u-empty mode="data" :icon="base.empty" />
			</view>
			
		</template>
		<template v-else>
			<u-loadmore :status="loadstatus" />
		</template>  
		<u-safe-bottom></u-safe-bottom>
	</view>
	
	<CateProductPopup
		:show="showCateList" 
		title="商品分类" 
		:onUpdateShow="handleChangeShow"
		@onConfirm="handleChangeCate"
	></CateProductPopup>
	<MenusBar></MenusBar>
</template>

<script setup>
	import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import { share } from '@/composition/share.js'
	const { setOnlineControl } = share()
	const $api = inject('$api')
	import useDataList from '@/composition/useDataList.js'
	
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore()
	const cate = useCateStore()
	const { cate_list, cate_loading } = toRefs(cate)
	const terms = ref('')
	const nav_index = ref(0)
	
	const showCateList = ref(false) 
	const login = ref('')
	const cateId = ref('')
	const cate_label = ref('全部')
	const company = ref({})
	const recommend = ref([])
	const options = computed(() => {
		return {
			params: {  
				login: login.value,
				cate: cateId.value
			},
			api: 'web_login_shop',
			getDataCallBack: (res) => {  
				if (res.code == 1) {
					setOnlineControl(res)
					company.value = res.company
					recommend.value = res.recommend
					dataList.value = [...dataList.value, ...res.list]
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
	const func = computed(() => {
		return terms.value ? 'web_search' : 'web_product'
	})
	onLoad(async (options) => {
		if(options.hasOwnProperty('login')) {
			login.value = options.login
		}
		if(options.hasOwnProperty('terms')) {
			terms.value = options.terms
		}
		if(cate_list.value.length == 0) {
			cate.getCateData()
		}
		await initDataList()
	})
	
	  
	
	async function handleSearch() {
		await initDataList()
	}
	function handleChangeShow(data) {
		showCateList.value = data
	}
	function handleChangeCate(obj) {
		cateId.value = obj.data.id 
		cate_label.value = obj.cate_label
		handleChangeShow(false)
		initDataList()
	}
	 
	
</script>

<style > 
</style>
<style lang="scss" scoped>
	.w {
		height: 100%;
		padding-bottom: 50px;
		.list {
			box-sizing: border-box;
			>.list-item {
				flex: 0 0 50%;
				box-sizing: border-box;
			}
		}
	}
</style>

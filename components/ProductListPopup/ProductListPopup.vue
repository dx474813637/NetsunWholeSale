<template>
	<view>
		<PopupNormal v-bind="$attrs" @open="open"> 
			<template #header>
				<view class="u-flex u-flex-between u-flex-items-center u-m-b-20 u-p-l-8 u-p-r-8">
					<view class="item u-primary" @click="refreshBtn">刷新</view>
					<view class="u-text-center">
						{{$attrs.title}}
					</view> 
					<view class="item u-info" @click="$attrs.onUpdateShow(false)">取消</view> 
				</view>
				<view class="u-flex ">
					<u-search
						placeholder="请输入商品关键词" 
						v-model="terms"
						bgColor="#f8f8f8" 
						:showAction="false"
						shape="square"
						@search="handleSearch"
						></u-search>
						<view class="u-m-l-20">
							<u-button 
								type="error"
								shape="circle"
								customStyle="height: 34px; border-radius: 6px"
								@click="handleSearch"
							>搜索</u-button>
						</view>
				</view>
			</template>
			<view class="list-w">   
				<view class="load-bg u-flex u-flex-items-center u-flex-center" v-if="listLoading">
					<u-loading-icon color="#f00"></u-loading-icon>
				</view>
				<scroll-view 
					class="main-list u-border-top u-border-bottom" 
					scroll-y 
					@scrolltolower="scrolltolower"
					refresherEnabled
					:refresherTriggered="listLoading"
					@refresherrefresh="refreshBtn"
					>
					<view class="list u-p-20"> 
						 <view 
							class="list-item u-m-b-10" 
							v-for="item in dataList" 
							:key="item.id"
							>
							<ProductRowCard
								:origin="item"
								:customStyle="{boxShadow: 'none!important' }"
								@checkedClick="checkedClick"
							></ProductRowCard>
								 
						 </view>	
						
								
					</view>
					<template v-if="dataList.length == 0">
						<view class="u-flex u-flex-center u-p-40">
							<u-empty mode="data" :icon="base.empty" />
						</view>
						
					</template>
					<template v-else>
						<view class="u-p-b-20">
							<u-loadmore :status="loadstatus" />
						</view> 
					</template>  
				</scroll-view> 
			</view>  
		</PopupNormal>
	</view>
</template>

<script setup> 
	const attrs = useAttrs()
	const $api = inject('$api')
	import { baseStore } from '@/stores/base'
	const base = baseStore();
	const { themeColor } = toRefs(base)
	import { userStore } from '@/stores/user'
	const user = userStore();
	const { user_info } = toRefs(user)
	const props = defineProps({
		xuan: {
			type: Number,
			default: 0
		},
		xuanList: {
			type: Array,
			default: () => {
				return []
			}
		}
	})
	const emits = defineEmits(['xuanSuccess'])
	const curP = ref(1)
	const originList = ref([])
	const dataList = ref([])
	const terms = ref('')
	const loadstatus = ref('loadmore')
	const listLoading = ref(false)
	const params = computed(() => {
		return {
			p: curP.value, 
			terms: terms.value
		}
	})
	const list = ref([])
	watch(
		() => props.xuanList,
		(n) => {
			// console.log(n)
			if(props.xuan == 1) {
				list.value = uni.$u.deepClone(n)
				initDataCheckState(originList.value, list.value)
			}
		},
		{
			deep: true, 
		}
	)
	watch(
		() => dataList.value,
		(n) => {
			// console.log(n)
		}
	)
	const func = computed(() => {
		return terms.value ? 'web_search' : 'web_product'
	})
	onMounted(async () => { 
		await initData() 
	})   
	function initDataCheckState(origin, xuan) { 
		let data = uni.$u.deepMerge(origin, dataList.value)
		let xuanKeys = xuan.map(ele => ele.id)
		dataList.value = data.map(ele => {
			let obj = {
				...ele, 
				checked: xuanKeys.includes(ele.id)? true: false
				// checked: true
			} 
			if(!obj.hasOwnProperty('loading')) {
				obj.loading = false
			}
			return obj
		})
	}
	async function scrolltolower() { 
		await getMoreData()
	}
	async function getMoreData() {
		if(loadstatus.value != 'loadmore') return
		curP.value ++
		await getData()
	}
	async function getData() {
		if(loadstatus.value == 'loading') return
		loadstatus.value = 'loading'
		const res = await $api[func.value]({params: params.value})
		if (res.code == 1) { 
			originList.value = [...originList.value, ...res.list] 
			initDataCheckState(originList.value, list.value)
			if(originList.value.length >= +res.total || terms.value) {
				loadstatus.value = 'nomore'
			}
			else {
				loadstatus.value = 'loadmore'
			}
		}
	}
	function initDataParams() {
		curP.value = 1;
		originList.value = []
		dataList.value = []
	}
	async function initData() {
		listLoading.value = true
		initDataParams();
		await getData()
		listLoading.value = false
	} 
	
	async function handleSearch() {
		await initData()
	}
	async function refreshBtn() {
		await initData()
	}
	async function checkedClick(data) { 
		let i = dataList.value.findIndex(ele => data.origin.id == ele.id) 
		console.log(i, data)
		if(i == -1 || dataList.value[i].loading) return
		let item = dataList.value[i]
		item.loading = true;
		const res = await updateShopProduct(item, data.check)
		item.loading = false;
		console.log(res)
		if(res) {
			item.checked = data.check
			emits('xuanSuccess', item)
		}
	}
	
	function updateShopProduct(product, check) {
		return new Promise(async (res, rej) => {
			const result = await $api.shop_product({
				params: {
					id: product.id,
					cate: check? 1: 2
				}
			})
			if(result.code == 1) {
				res(true)
			}
			rej(false)
		})
	}
</script>

<style lang="scss" scoped>
	.list-w {
		height: 60vh;
		background-color: #f8f8f8;
		position: relative;
		.load-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 20;
			background-color: rgba(255,255,255,.9);
		}
		// .list-item {
		// 	position: relative;
		// 	z-index: 10;
		// 	height: 100%;
		// 	&.item-left {
		// 		flex: 0 0 35%;
		// 		background-color: #f8f8f8;
		// 	}
		// }
	} 
	.main-list {
		height: 100%;
		box-sizing: border-box;
		position: relative;
		z-index: 19;
	}
	.list {
		box-sizing: border-box;
		>.list-item { 
			box-sizing: border-box;
		}
	}
	.item-card { 
		background-color: #e8e8e8;
		box-sizing: border-box;  
		margin-bottom: 10px; 
		padding: 10px;
		color: #666;
		border-radius: 5px;
		border: 1rpx solid #e8e8e8;
		&.active {
			background-color: $u-primary-light;
			color: $u-primary;
			border-color: $u-primary;
		}
	}
</style>
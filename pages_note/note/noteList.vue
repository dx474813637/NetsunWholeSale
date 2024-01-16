<template>
	<view class="w" > 
		<view class="list">
			<uv-waterfall ref="waterfall"
				v-model="dataList"
				:add-time="10"
				:left-gap="leftGap"
				:right-gap="rightGap"
				:column-gap="columnGap"
				@changeList="changeList">
				<!-- 第一列数据 -->
				<template v-slot:list1>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in list_col.list1"
							:key="item.id"
							class="waterfall-item">
							<noteCard
								:origin="item"
							></noteCard> 
						</view>
					</view>
				</template>
				<!-- 第二列数据 -->
				<template v-slot:list2>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in list_col.list2"
							:key="item.id"
							class="waterfall-item">
							<noteCard
								:origin="item"
							></noteCard> 
						</view>
					</view>
				</template>
			</uv-waterfall>
		</view>
		
		<template v-if="dataList.length == 0">
			<u-empty
				mode="data"
				:icon="empty"
			>
			</u-empty>
		</template>
		<template v-else>
			<u-loadmore
				:status="loadstatus"
			/>
		</template> 
	</view>
	<u-toast ref="uToast"></u-toast>
	<u-safe-bottom></u-safe-bottom>
	<TabBar :customStyle="customStyle" :mainStyle="{height: 'auto'}"  > 
		<view class="shop-card u-flex u-flex-items-center u-p-20 box-border" 
			@click.stop="base.handleGoto({url: '/pages/product/productDetail', params: {id: id}, type: 'reLaunch' })"
			v-if="id"
		>
			<view class="shop-img">
				<up-image
					width="80px"
					height="80px"
					radius="10"
					v-if="product.pic"
					:src="product.pic.split('|')[0]"
				></up-image>
			</view>
			<view class="shop-content u-flex-1 u-m-l-20 " style="height: 80px;">
				<view class="u-line-1 u-m-b-10" >
					{{product.name}}
				</view>
				<view class="u-line-1 u-m-b-10 u-flex u-flex-items-center" >
					<view class="u-flex-1 u-flex u-flex-items-center  u-error" >
						<text class="text-bold" style="font-family: cursive;">{{product.price1}}</text>
						<text class="u-font-28 u-p-l-10">起</text>
					</view>
				</view>
				<view class="u-flex u-flex-items-center u-flex-between"> 
					<view class="u-flex u-flex-items-center">
						<view  @click.stop="() => {}">
							<button openType="share"  class="share-btn u-p-10 u-font-24 u-flex u-flex-center u-flex-items-center">
								<!-- <view >分享</view> -->
								<u-icon name="share-square" size="22" color="#333"></u-icon>
							</button>
						</view>
						<view class="u-m-l-10 u-p-10" @click="base.handleGoto({url: '/pages/home/home' , type: 'reLaunch' })">
							<u-icon name="home" color="#333" size="22"></u-icon>
							<!-- <u-button type="warning" shape="circle" throttleTime="800" size="small"> 
								<view class="">首页</view>
							</u-button> -->
						</view>
					</view>
					<view class="u-flex u-flex-items-center">
						<view class="u-m-l-10" @click.stop="base.handleGoto({url: '/pages/product/productDetail', params: {id: id}, type: 'reLaunch' })" >
							<view class="u-flex u-flex-items-center">
								<u-icon name="heart" color="#ff4f0b" size="20"></u-icon>
								<view class="u-m-l-5 u-font-34 u-p-b-5" style="color: #ff4f0b;">想要</view>
							</view>
						</view>
						<view class="u-m-l-30" @click.stop="chooseBtn"  v-if="user_info.role != 0">
							<view class="u-flex u-flex-items-center">
								<u-icon name="plus-circle" color="#FF2442" size="20"></u-icon>
								<view class="u-m-l-5 u-font-34 u-p-b-5" style="color: #FF2442;">新笔记</view>
							</view>
							<!-- <u-button
								:customStyle="{background: '#FF2442'}" 
								shape="circle" 
								type="error"   
								size="small"
							>
								<view class="u-flex u-flex-items-baseline">
									<u-icon name="plus-circle" color="#fff" size="14"></u-icon>
									<view class="u-m-l-10">新笔记</view>
								</view>
							</u-button> -->
						</view>
					</view>
					
				</view>
			</view> 
		</view> 
	
		<view class="shop-card u-flex u-flex-items-center u-flex-between u-p-20 box-border" v-else>
			<view class="item">
				
			</view>
			<view class="u-flex u-flex-items-center">
				<view class="u-flex-1 u-flex u-flex-items-center  u-error" > 
					<text class="text-bold" style="font-family: cursive;">{{product.price1}}</text> 
				</view>
				<view  @click.stop="() => {}">
					<button openType="share"  class="share-btn u-font-28 u-flex u-flex-center u-flex-items-center " style="width: 80px; height: 40px; line-height: 40px; background-color: #FF2442;">
						<view >分享</view>
					</button>
				</view>
				<view class="u-m-l-10" style="width: 80px;" @click="base.handleGoto({url: '/pages/home/home' , type: 'reLaunch' })">
					<u-button type="warning" shape="circle" throttleTime="800" >
						<!-- <u-icon name="home" color="#fff"></u-icon> -->
						<view class="">首页</view>
					</u-button>
				</view> 
			</view>
		</view>
	</TabBar> 
	<!-- <MenusBar></MenusBar> -->
</template>

<script setup>
	import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import zeroLazyLoad from '@/uni_modules/zero-lazy-load/components/zero-lazy-load/zero-lazy-load.vue'
	// import { guid } from '@/uni_modules/uv-ui-tools/libs/function/index.js'
	import { share } from '@/composition/share.js'
	import useDataList from '@/composition/useDataList.js'
	import useUploadMedia from '@/composition/useUploadMedia.js'
	import {useCateStore, baseStore} from '@/stores/base.js' 
	const base = baseStore() 
	const {themeColor, empty} = toRefs(base)
	import {userStore} from '@/stores/user.js' 
	const user = userStore() 
	const { biji_files, biji_step, biji_info, biji_linshi, user_info } = toRefs(user)
	const { setOnlineControl } = share()
	const $api = inject('$api')
	const id = ref('') 
	const list_col = ref({
		list1: [],
		list2: [],
	}) 
	const leftGap = ref(8) 
	const rightGap = ref(8) 
	const columnGap = ref(8)
	const uToast = ref('') 
	const waterfall = ref('')
	const product = ref({})
	const upload_config = ref({}) 
	const options = computed(() => {
		return {
			params: {
				id: id.value, 
			},
			api: 'product_longs',
			getDataCallBack: (res) => {
				if (res.code == 1) {
					dataList.value = [...dataList.value, ...res.list] 
					product.value = res.product
					setOnlineControl(res) 
					if(res.hasOwnProperty('upload_config')) {
						upload_config.value = res.upload_config
					}
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
	const options2 = computed(() => {
		return {
			count: 9,
			mediaType: ['mix'],
			sourceType: ['album', 'camera'],
			maxDuration: 60, 
			...upload_config.value
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
	const { 
		files,
		getSignature,
		startUpload,
		chooseMedia
	} = useUploadMedia(options2)
	onLoad(async (options) => { 
		if (options.hasOwnProperty('id')) {
			id.value = options.id
		}    
		await initDataList() 
		uni.$on('list_refresh',async function() {
			await pageRefresh()
		})
	})
	onUnload(() => {
		uni.$off('list_refresh')
	})
	onPullDownRefresh(async () => {
		
		await pageRefresh()
		uni.stopPullDownRefresh()
	})
	async function pageRefresh() {
		uni.showLoading()
		waterfall.value.clear()
		list_col.value.list1 = []
		list_col.value.list2 = [] 
		await initDataList() 
	}
	function changeList(e){
		// console.log(e, 'change')
		list_col.value[e.name].push(e.value);
	}
	const customStyle = ref({
		// boxShadow: '0 -5px 5px rgba(0,0,0,.05)'
		// paddingBottom: '50px', 
		background: '#F2F2F2'
	}) 
	
	async function chooseBtn() { 
		biji_step.value = false
		biji_files.value = []
		const res = await chooseMedia()
		if(res) {
			base.handleGoto({
				url: '/pages_note/note/noteEdit',
				params: {
					id: id.value
				}
			})
		}
		
	}
	function showToast(params) {
		uToast.value.show({
			position: 'bottom',
			...params,
		})
	} 
</script>

<style lang="scss"> 
page {
	background-color: #F2F2F2;
}
</style>
<style lang="scss" scoped>
	.share-btn {
		background-color: transparent;
		color: #fff;
		height: 30px;
		line-height: 30px;
		border-radius: 20px;
		&:after {
			border: 0;
		}
	}
	$show-lines: 1;
	@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';
	.waterfall-item {
		overflow: hidden;
		margin-top: 10px;
		border-radius: 6px;
	}
	.waterfall-item__ft {
		padding: 20rpx;
		background: #fff;
		&__title {
			margin-bottom: 10rpx;
			line-height: 48rpx;
			font-weight: 700;
			.value {
				font-size: 32rpx;
				color: #303133;
			}
		}
		&__desc .value {
			font-size: 28rpx;
			color: #606266;
		}
		&__btn {
			padding: 10px 0;
		}
	}
	.w {
		min-height: 100vh;
		padding-top: 20px;
		padding-bottom: 100px;
		background-color: #fff;
		border-radius: 20px 20px 0 0;
		
	} 
</style>

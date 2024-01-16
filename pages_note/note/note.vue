<template>
	<view class="w">  
		<view class="swiper-w">
			<u-swiper
				v-if="swiperlist.length > 0"
				:list="swiperlist"
				height="100%"
				keyName="url"
				:current="swiperCurrent"
				:autoplay="false"
				imgMode="aspectFit"
				bgColor="#222"
				indicator
				:indicatorActiveColor="themeColor"
				indicatorMode="dot" 
				@change="swiperChange"
				radius="0"
			></u-swiper>
		</view>
		<view class="content-w u-p-30 box-border u-font-34" v-if="list.info">
			<u-parse 
				:content="list.info" 
				selectable
			></u-parse>
		</view>
	</view>
	<u-toast ref="uToast"></u-toast>
	<u-safe-bottom></u-safe-bottom>
	<TabBar :customStyle="customStyle" :mainStyle="{height: 'auto'}"> 
		<view class="shop-card u-flex u-flex-items-center u-p-20 box-border" @click.stop="goto(list.url)">
			
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
						<view class="u-m-l-10" @click.stop="goto(list.url)" >
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
	</TabBar> 
</template>

<script setup>
	import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	import zeroLazyLoad from '@/uni_modules/zero-lazy-load/components/zero-lazy-load/zero-lazy-load.vue'
	import { share } from '@/composition/share.js'
	// import useDataList from '@/composition/useDataList.js' 
	import useUploadMedia from '@/composition/useUploadMedia.js'
	import {useCateStore, baseStore} from '@/stores/base.js'  
	import {userStore} from '@/stores/user.js'  
	const user = userStore() 
	const { biji_files, biji_step, biji_info, biji_linshi, user_info } = toRefs(user)
	const base = baseStore() 
	const {themeColor, empty} = toRefs(base)
	const { setOnlineControl } = share()
	const $api = inject('$api')
	const $http = inject('$http') 
	const id = ref('') 
	const list = ref({})
	const swiperlist = ref([])
	const product = ref({})
	const swiperCurrent = ref(0)
	const upload_config = ref({}) 
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
		files,
		getSignature,
		startUpload,
		chooseMedia
	} = useUploadMedia(options2)
	onLoad(async (options) => { 
		if (options.hasOwnProperty('id')) {
			id.value = options.id
		}    
		uni.showLoading
		await getData()
	}) 
	const customStyle = ref({ 
		background: '#F2F2F2'
	}) 
	let regList = [
		{
			name: 'image',
			reg: /\.(png|jpg|gif|jpeg|webp|svg)$/i,
		},
		{
			name: 'video',
			reg: /\.(mp4|webm|ogg|flv|m3u8|avi|3gp|mov)$/i,
		},
	]
	watch(
		() => list.value.pic,
		(n) => {
			swiperlist.value = n.split('|').map(ele => {
				let type = regList.filter(item => item.reg.test(ele))[0]?.name || '' 
				return {
					url: ele,
					type
				}
			})
			console.log(swiperlist.value)
		}
	)
	async function getData() {
		const res = await $api.product_longs_detail({params: {id: id.value}})
		if(res.code == 1) {
			setOnlineControl(res)
			if(res.hasOwnProperty('upload_config')) {
				upload_config.value = res.upload_config
			} 
			list.value = res.list
			product.value = res.product
		}
	}
	
	function swiperChange(item) { 
		swiperCurrent.value = item.current
	}
	
	async function chooseBtn() { 
		biji_step.value = false
		biji_files.value = []
		const res = await chooseMedia()
		if(res) {
			base.handleGoto({
				url: '/pages_note/note/noteEdit',
				params: {
					id: list.value.pid
				}
			})
		}
		
	}
	function goto(url) {
		if(!url) return
		uni.reLaunch({
			url
		})
	}
</script>
<style lang="scss">
	page {
		background-color: #fff;
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
	.w {
		padding-bottom: 120px; 
	}
	.groupMsg {
		border-bottom: 20rpx solid #f5f5f5; 
		padding: 20px 10px;
	}
	.swiper-w {
		height: 70vh;
	}
	.content-w {
		color: #333;
		word-break: break-all;
		line-height: 28px;
	}
</style>

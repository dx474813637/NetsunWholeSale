<template>
	<view>
		<PopupNormal v-bind="$attrs" @open="open"> 
			<template #header>
				<view class="haibao-w u-flex u-flex-items-center u-flex-center">
					<view class=" " v-if="origin.haibao && ($attrs.show || isFirst)">
						<image
							:src="origin.haibao"
							class="haibao uni-shadow-base u-p-10 bg-white" 
							mode="heightFix" 
							show-menu-by-longpress
						></image>
					</view>
				</view>
			</template>
			<view class="list-w bg-white">   
				<scroll-view class="main-list" scroll-x >
					<view class="menus-w u-flex u-flex-items-center u-p-l-20 u-p-r-20">
						<view class="menus-item u-p-20 u-flex-column u-flex-center u-flex-items-center" 
							:class="{
								disabled: !origin.haibao
							}"
							@click="downloadBtn">
							<view class="icon-w u-flex u-flex-items-center u-flex-center">
								<u-icon name="download" size="30" color="#1F1F1F"></u-icon>
							</view>
							<view class="menu-title u-font-28 u-m-t-10">下载海报</view>
						</view>
						<view class="menus-item u-p-20 u-flex-column u-flex-center u-flex-items-center">
							<button type="primary"  openType="share"  class="share-btn u-p-0">
								<view class="icon-w icon-wx u-flex u-flex-items-center u-flex-center">
									<u-icon name="weixin-fill" size="30" color="#fff"></u-icon>
								</view>
								<view class="menu-title u-font-28 u-m-t-10">发送好友</view>
							</button>
						</view>
						<view class="menus-item u-p-20 u-flex-column u-flex-center u-flex-items-center" 
							:class="{
								disabled: !shortUrl
							}"
							@click="copyShortUrl">
							<view class="icon-w u-flex u-flex-items-center u-flex-center">
								<u-icon name="attach" size="30" color="#1F1F1F"></u-icon>
							</view>
							<view class="menu-title u-font-28 u-m-t-10">复制链接</view>
						</view>
						
					</view>
				</scroll-view> 
			</view>  
			<template #footer>
				<view class="u-p-20 bg-white" style="border-radius: 0 0 10px 10px;">
					<u-button  
						shape="circle" 
						@click="attrs.onUpdateShow(false)"  
						type="info"
					>取消</u-button>
				</view>
			</template>
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
		origin: {
			type: Object,
			default: () => {
				return {}
			},
		},
		url2Short: {
			type: String,
			default: '',
		},
	})   
	const isFirst = ref(false)
	const shortUrl = ref('')
	onMounted(async () => { 
	})  
	async function open() {
		isFirst.value = true
		let url = props.url2Short? props.url2Short: getCurrentPages()[getCurrentPages().length - 1].$page.fullPath
		console.log(url) 
		const res = await url2ShortEvent(url)
		shortUrl.value = res.list
	}
	async function url2ShortEvent(url) {
		return new Promise(async (resolve, rej) => {
			try{
				const res = await $api.get_url({
					params: {
						url
					}
				})
				if(res.code == 1) {
					resolve(res)
				}
			}catch(e){
				//TODO handle the exception
				rej(e)
			}
			
		})
		
	}
	function copyShortUrl() {
		if(!shortUrl.value) return
		uni.setClipboardData({
			data: shortUrl.value,
			success() {
				uni.showToast({
					title: '复制成功'
				})
				attrs.onUpdateShow(false)
			}
		})
	}
	function downloadBtn() {
		if(!props.origin.haibao) return
		uni.downloadFile({
			url: props.origin.haibao, //仅为示例，并非真实的资源
			success: (res) => { 
				uni.saveImageToPhotosAlbum({
					filePath: res.tempFilePath, //临时文件地址
					success(res) {
						uni.showToast({
							title: '下载成功'
						})
						attrs.onUpdateShow(false)
					},
					fail(err){
						console.log(err);
					}
				}) 
			}
		});
	}
</script> 
<style lang="scss" scoped>
	.share-btn {
		background-color: transparent;
		color: #000;
		line-height: 20px;
		&:after {
			border: 0;
		}
	}
	.haibao-w {
		height: 50vh;
	}
	.list-w {
		border-radius: 10px 10px 0 0;
		height: 15vh; 
		// background-color: #f2f2f2;
		position: relative; 
	} 
	.main-list {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		.menus-w {
			height: 100%;
			.menus-item  {
				height: 100%;
				width: 70px;
				flex: 0 0 70px;
				&.disabled {
					opacity: .6;
				}
				.icon-w {
					width: 50px;
					height: 50px;
					border-radius: 25px;
					background-color: #F3F3F3;
					&.icon-wx {
						background-color: #1EBA51;
					}
				}
			}
		}
	}
	.haibao {
		max-width: 80vw;
		height: 45vh;
		background-color: transparent;
		border-radius: 10px; 
	} 
</style>
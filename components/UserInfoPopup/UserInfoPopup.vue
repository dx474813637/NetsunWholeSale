<template>
	<view>
		<u-popup 
			:show="show" 
			mode="center" 
			@close="emits('onUpdateShow', false)" 
			round="10" 
			:safeAreaInsetBottom="false" 
			closeOnClickOverlay
		>
			<view class="u-p-20 wrap u-radius-8">
				<view class="main u-p-b-30">
					<view class="header text-white u-flex u-flex-center u-flex-items-center u-p-20 text-bold">
						{{user_info.title}}
					</view>
					<view class="avatar-w u-flex u-flex-center u-p-20 u-m-b-20" > 
						<button class="avatar-wrapper u-flex u-flex-center u-flex-items-center" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							<image class="avatar u-radius-4" :src="avatarUrl" v-if="avatarUrl"></image>
							<u-icon name="account-fill" size="32" color="#aaa" v-else></u-icon>
							<view class="cream-icon u-flex u-flex-items-center u-flex-center">
								<u-icon name="camera-fill" color="#fff"></u-icon>
							</view> 
						</button>
						
					</view>
					<view class="u-p-l-30 u-p-r-30">
						<view class="nick-w u-m-b-30 u-flex u-flex-items-center">
							<!-- <u-input 
								type="nick"
								v-model="nick" 
								:customStyle="{background: '#f8f8f8', padding: '10px'}" 
								placeholder="输入昵称"
								fontSize="14px" 
								border="none"
								clearable 
							>
								<template #prefix>
									<view class="u-font-28 text-base">
										昵称：
									</view>
								</template>
							</u-input> -->
							<view class="u-font-28 text-base">昵称：</view>
							<view class="uni-input-wrapper u-flex u-flex-items-center u-flex-1">
								<input 
									type="nickname" 
									class="weui-input u-font-28 u-flex-1" 
									:value="nick" 
									@input="clearInput" 
									@blur="changeValue"
									placeholder="请输入昵称"  
									:cursor-spacing="50"
								/>
								<!-- <input class="uni-input" placeholder="带清除按钮的输入框" :value="inputClearValue" @input="clearInput" /> -->
								<u-icon name="close-circle-fill" v-if="showClearIcon" @click="clearIcon" size="20" color="#aaa"></u-icon>
								<!-- <text class="uni-icon" v-if="showClearIcon" @click="clearIcon">&#xe434;</text> -->
							</view>
							
						</view>
						<view class="tishi-w u-m-b-40 u-info u-font-26 u-flex u-flex-items-center">
							<!-- <view class="item u-radius-4 u-flex u-flex-items-center u-flex-center" style="width: 35px; height: 35px;background-color: #D6EAFE;">
								<u-icon name="info-circle-fill" color="#4f9ef3" size="24"></u-icon>
							</view> -->
							<view class="item u-flex-1">
								{{user_info.info}}
							</view> 
						</view>
						<u-button type="error" @click="submit" >立 即 保 存</u-button>
					</view>
					
				</view>
				<!-- <view class="img-w">
					<u--image
						showLoading
						:src="`https://wx3.y.netsun.com/Public/2023xuanpinhui/a08.png?time=${new Date().getTime()})`"
						width="80vw"
						height="auto"
						mode="widthFix"
					></u--image>
				</view> -->
				
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		toRefs,
		inject,
		computed,
		onMounted,
		reactive, 
		watch,
		useAttrs
	} from 'vue' 
	const attrs = useAttrs()
	const $api = inject('$api')
	import { baseStore } from '@/stores/base'
	const base = baseStore(); 
	const { configBaseURL, configHeader, themeColor } = toRefs(base)
	import { userStore } from '@/stores/user'
	const user = userStore();
	const { user_info } = toRefs(user)
	 
	const props = defineProps({  
		show: {
			type: Boolean,
			default: false,
		}
	}) 
	const avatarUrl = ref('')
	const nick = ref('')
	const showClearIcon = ref(false)
	watch(
		() => user_info.value,
		(n) => {
			avatarUrl.value = n.img;
			nick.value = n.name;
		},
		{
			deep: true
		}
	)
	const emits = defineEmits(['onUpdateShow'])
	onMounted(async () => { 
	})  
	
	async function onChooseAvatar(e) {
		console.log(e)
		const { avatarUrl: avatarUrl2 } = e.detail 
		uni.showLoading()
		const result = await base.uploadFilePromise(avatarUrl2)
		uni.hideLoading()
		avatarUrl.value = result.list[0]
	}
	// function uploadFilePromise(url) {
	// 	return new Promise((resolve, reject) => {
	// 		uni.uploadFile({
	// 			url: `${configBaseURL.value}upimg`, 
	// 			filePath: url,
	// 			name: 'file',
	// 			header: {
	// 				...configHeader.value,
	// 				'content-type': 'multipart/form-data',
	// 				userid: uni.getStorageSync('userid'),
	// 			},
	// 			success: (res) => {
	// 				console.log(res)
	// 				uni.hideLoading()
	// 				resolve(JSON.parse(res.data))
					
	// 			},
	// 			fail(error) { 
	// 				console.log(error)
	// 				uni.hideLoading()
	// 				reject(error)
	// 			}
	// 		});
	// 	})
	// }
	async function submit() {
		uni.showLoading({
			title: '保存中'
		})
		const res = await $api.save_info({
			params: {
				name: nick.value,
				img: avatarUrl.value
			}
		})
		if(res.code == 1) {
			emits('onUpdateShow', false)
			uni.showLoading({
				title: '获取最新信息'
			})
			await user.refreshUserData()
			// uni.showToast()
		}
	} 
	function clearInput (event) {
		nick.value = event.detail.value;
		if (event.detail.value.length > 0) {
			showClearIcon.value = true;
		} else {
			showClearIcon.value = false;
		}
	} 
	function clearIcon () {
		nick.value = '';
		showClearIcon.value = false;
	}
	function changeValue(event) {
		nick.value = event.detail.value; 
		// nick.value = filterWeChatNicknameEmoji(event.detail.value); 
	}
	function filterWeChatNicknameEmoji(text) {
	  // 定义正则表达式匹配微信昵称表情
	  const emojiRegex = /u4e88-u9fa5 a-zA-Z8-97+$/g;
	  
	  // 使用正则表达式替换为空字符串
	  const filteredText = text.replace(emojiRegex, '');
	  
	  return filteredText;
	}
</script>

<style lang="scss" scoped>
	.wrap {
		position: relative;
		overflow: hidden;
		width: 80vw;
		&::after {
			position: absolute;
			content: '';
			left: 50%;
			transform: translateX(-50%) scaleX(1.3);
			top: 0;
			width: 100%;
			height: 100px;
			border-radius: 0 0 100% 100%;
			background-color: #fb5349;
		}
		.main {
			position: relative;
			z-index: 10;
		} 
		.avatar-wrapper {
			position: relative;
			width: 80px;
			height: 80px;
			border: 2px solid #fff;
			outline: none;
			padding: 0;
			overflow: unset;
			.avatar { 
				width: 100%;
				height: 100%;
			}
			.cream-icon {
				position: absolute;
				right: -5px;
				bottom: -5px;
				width: 20px;
				height: 20px;
				border-radius: 20px;
				background-color: #FA392D; 
			}
		}
		
	}
	.nick-w {
		background-color: #f2f2f2;
		border-radius: 4px;
		padding: 10px;
	}
</style>
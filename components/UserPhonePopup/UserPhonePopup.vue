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
			<view class="u-p-30 wrap u-radius-8">
				<view class="main"> 
					<view class="" v-if="user_info.info1">
						<u-parse :content="user_info.info1"></u-parse>
					</view>
					<view class="u-p-t-30">
						<u-button type="error"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" >授 权 手 机</u-button>
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
	const emits = defineEmits(['onUpdateShow', 'getPhone'])
	onMounted(async () => { 
	})  
	 
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
	 async function getPhoneNumber(e) {
		console.log(e)
		const res = await sendPhone({...e.detail})
		
		if(res) {
			setTimeout(() => {
				emits('getPhone')
			}, 500)
			
		}
		// uni.login({
		// 	success: async (res) =>{
		// 		const r = await $api.phone_only({...e.detail, code: res.code})
		// 		if(r.code == 1) {
		// 			uni.showToast({
		// 				title: r.msg
		// 			})
		// 			emits('getPhone')
		// 		}
		// 	},
		// 	fail: err => {
		// 		// md5flag = true
		// 		// rejected(err)
		// 	}
		// });
		// const code = await user.get_xcx_code()
		
	}
	async function sendPhone(data) {
		return new Promise(async (resolve, rej) => {
			const res = await $api.phone_only1({...data})
			if(res.code == 1) {
				uni.showToast({
					title: res.msg
				})
				resolve(true)
			}
			rej(false)
		})
		
	}
</script>

<style lang="scss" scoped>
	.wrap {
		position: relative;
		overflow: hidden;
		width: 60vw;
		// &::after {
		// 	position: absolute;
		// 	content: '';
		// 	left: 50%;
		// 	transform: translateX(-50%) scaleX(1.3);
		// 	top: 0;
		// 	width: 100%;
		// 	height: 100px;
		// 	border-radius: 0 0 100% 100%;
		// 	background-color: #fb5349;
		// }
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
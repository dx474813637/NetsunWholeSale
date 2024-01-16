<template>
	<view class="w">
		<u-navbar
			ref="navbar"
			:fixed="fixed"
			:bgColor="bgColor || base.themeColor" 
		>
			<template #left>
				<slot name="navLeft">
					<view class="u-flex u-flex-items-center" :style="{color: activeColor || base.themeColor}">
						<view class="btn u-m-r-20" @click="handleBack" v-if="backBtn">
							<i class="custom-icon custom-icon-back" :style="{color: activeColor || base.themeColor}"  ></i>
						</view> 
						<view @click="base.handleGoto({url: '/pages/home/home', type: 'reLaunch'})" class="btn u-m-l-20" v-if="!hideHome"> 
							<i class="custom-icon custom-icon-zhuye2" :style="{color: activeColor || base.themeColor}"  ></i>
						</view> 
						<!-- <view @click="loginBtn" class="btn u-m-l-20 u-primary" v-if="u.login == '0' || !u.login" > 
							登录
						</view>  
						<view @click="logoutBtn" class="btn u-m-l-20 u-error-dark" v-else> 
							登出
						</view>  -->
					</view>
				</slot>
				
				
			</template>
			<template #center>
				<slot>
					<text class="u-line-1" :style="[titleStyle]" v-if="title">
						{{title}}
					</text>
				</slot>
			</template>
		</u-navbar> 
	</view>
</template>

<script setup> 
	import {
		ref,
		reactive,
		computed,
		onMounted,
		watch,
		toRefs
	} from 'vue'  
	import { 
		onReady
	} from "@dcloudio/uni-app"; 
	import {
		baseStore,
		menusStore
	} from '@/stores/base'; 
	import {
		userStore
	} from '@/stores/user';
	
	const user = userStore() 
	const {user: u} = toRefs(user)
	const base = baseStore()
	const props = defineProps({ 
		fixed: {
		  type: Boolean,
		  default: false
		},
		backBtn: {
			type: Boolean,
			default: false
		},
		hideHome: {
			type: Boolean,
			default: true
		},
		titleStyle: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		bgColor: {
			type: String,
			default: '',
		},
		activeColor: {
			type: String,
			default: '',
		}
	})
	const sys = ref({})
	const msg = ref({})
	const show = ref(true) 
	onMounted(() => {
		sys.value = uni.getSystemInfoSync() 
		// msg.value = base.msg[0] || {}
		// console.log('onMounted', base.msg[0])
		  
	})  
	const emits = defineEmits([ 
		"backEvent",  
	]);
	function handleBack() {
		// $emits('backEvent')
		uni.navigateBack()
	}
	 
	 
	function logoutBtn() { 
		uni.showModal({
			title: '提示',
			content: '是否登出当前账号',
			success: function (res) {
				if (res.confirm) {
					user.logout() 
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	function loginBtn() {
		base.handleGoto({
			url: '/pages/login/login'
		})
	}
	
	defineExpose({
		sys
	})
	
	
	
	
	
</script>
<style >
	:deep(.w .u-fixed) {
		z-index: 11110!important;
	}
</style>
<style lang="scss" scoped>
	.dot-w {
		position: relative;
		.dot {
			position: absolute;
			right: 0px;
			bottom: 0px;
			border-radius: 20px;
			width: 6px;
			height: 6px;
			background-color: #1cfa2b;
		}
	}
	.online-icon-text {
		padding: 0 5px;
		border-radius: 25px;
	}
</style>

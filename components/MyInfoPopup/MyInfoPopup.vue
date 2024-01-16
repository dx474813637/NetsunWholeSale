<template>
	<view>
		<PopupNormal v-bind="$attrs" @open="open">
			<template #header>
				<view class="u-flex u-flex-between u-flex-items-center">
					<view class="item u-font-28 u-primary" @click="refresh">刷新</view>
					<view class="u-text-center">
						{{$attrs.title}}
					</view> 
					<view class="item u-font-28 u-info" @click="$attrs.onUpdateShow(false)">取消</view>
					
				</view>
			</template>
			<view class="list-w u-flex bg-white">  
				<view class="list-item item-right u-flex-1"> 
					<scroll-view class="main-list  u-p-30" scroll-y >
						<u--form
						 	labelPosition="left"
						 	:model="form" 
						 	ref="uForm"  
						 	labelWidth="80px"
						 	:labelStyle="{color: '#000'}"  
						 	:rules="rules"
						 	>
						 	<u-form-item
						 		label="姓名"
						 		prop="name"  
						 		borderBottom
						 		required 
						 		>
						 		<u--input
						 			v-model="form.name" 
						 			placeholder="输入姓名"  
						 			border="none"
						 			inputAlign="right"
						 		></u--input> 
						 	</u-form-item>
						 	<u-form-item
						 		label="手机"
						 		prop="phone"  
						 		borderBottom
						 		required 
						 		>
						 		<u--input
						 			v-model="form.phone" 
						 			placeholder="输入手机"  
						 			border="none"
						 			inputAlign="right"
						 		></u--input> 
						 	</u-form-item>
						 	<u-form-item
						 		label="直播号"
						 		prop="room_name"  
						 		borderBottom
						 		required 
						 		>
						 		<u--input
						 			v-model="form.room_name" 
									placeholder="直播平台 + 账号"  
						 			border="none"
						 			inputAlign="right"
						 		></u--input> 
						 	</u-form-item>
						</u--form>
					</scroll-view>
				</view>
			</view> 
			<template #footer>
				<view class="u-p-20">
					<u-button type="primary" shape="circle" @click="submit" throttleTime="1000">提交</u-button>
				</view>
			</template>
		</PopupNormal>
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
	const { themeColor } = toRefs(base)
	import { userStore } from '@/stores/user'
	const user = userStore();
	const { user_info } = toRefs(user)
	const form = reactive({
		name: '',
		phone: '',
		room_name: ''
	})
	const uForm = ref()
	const rules = {
		name: {
			type: 'string',
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},
		phone: {
			validator: (rule, value, callback) => { 
				return uni.$u.test.mobile(value);
			},
			message: '请填写正确的手机号码',
			trigger: ['blur', 'change']
		},
		room_name: {
			type: 'string',
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},
	}
	// const props = defineProps({  
	// 	userInfo: {
	// 		type: Object,
	// 		default: () => {
	// 			return {}
	// 		},
	// 	}
	// })  
	watch(
		() => user_info.value,
		(info) => {
			form.name = info.name
			form.phone = info.phone
			form.room_name = info.room_name
		},
		{
			deep: true,
			immediate: true
		}
	)
	onMounted(async () => { 
	})  
	async function submit() {
		uForm.value.validate().then(async res => {
			uni.showLoading()
			await submitApi() 
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('请检查表单')
		})
	}
	async function submitApi() {
		const res = await $api.save_info({
			params: {...form}
		})
		if(res.code == 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})  
			user.getUserInfo()
			attrs.onUpdateShow(false)
		}
	}
	async function refresh() {
		uni.showLoading()
		user.getUserInfo()
	}
</script>

<style lang="scss" scoped>
	.list-w {
		height: 40vh;
		// background-color: #f2f2f2;
		position: relative;
		.load-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 20;
			background-color: rgba(255,255,255,.6);
		}
		.list-item {
			position: relative;
			z-index: 10;
			height: 100%;
			&.item-left {
				flex: 0 0 35%;
				background-color: #f8f8f8;
			}
		}
	}
	.nav-item {
		color: #666; 
		&.active-nav {
			background-color: #f2f2f2;
			color: $u-primary; 
		}
	}
	.main-list {
		height: 100%;
		box-sizing: border-box;
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
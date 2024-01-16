<template>
	<view class="w">
		<!-- <view class="u-p-10">
			<view class="bg-white u-p-30 u-radius-8">
				<text class="u-info">您的当前身份为</text>
				<text class="u-m-l-10 text-bold">{{ role2Str }}</text> 
			</view>
		</view> -->
		<view class="" v-if="list.info">
			<view class="bg-white u-p-30 u-radius-8">
				<u-parse :content="list.info"></u-parse>
			</view>
		</view>
	</view>
	<UserPhonePopup
		:show="showUserPhone"
		@getPhone="getPhone"
		@onUpdateShow="handleChangeShow2" 
	></UserPhonePopup>
	<u-safe-bottom></u-safe-bottom>
	<TabBar :customStyle="{boxShadow: '0px -3px 10px rgba(0,0,0,0.1)' }">
		<view class="u-flex u-flex-between u-flex-items-center u-p-l-20 u-p-r-20 u-font-28" style="height: 100%;">
			<view class="item u-flex-1 ">
				<u-button type="error" shape="circle" @click="roleClick">{{tabs_list[0].cardData.title}}</u-button>
			</view>
			<!-- <view class="item u-flex-1" v-else>
				<u-button type="primary" shape="circle" openType="share"  >
					<view class="u-flex"> 
						<text class="u-m-l-8 u-p-b-5 u-font-32">分享邀请页面</text>
					</view>
				</u-button>
			</view> -->
		</view>

	</TabBar>
</template>

<script setup>
	import {
		onLoad,
		onShareAppMessage,
		onShareTimeline
	} from '@dcloudio/uni-app'
	// import { ref, reactive, computed, toRefs, inject, watch } from 'vue' 
	import { share } from '@/composition/share.js'
	import {
		baseStore
	} from '@/stores/base'
	import {
		userStore
	} from '@/stores/user'
	import useFilter from '@/composition/useFilter.js'
	const user = userStore()
	const {
		user_info
	} = toRefs(user)
	const base = baseStore();
	const {
		home,
		roomList,
		themeColor
	} = toRefs(base)
	const {
		setOnlineControl,
		onlineControl
	} = share()
	const $api = inject('$api')
	const tabs_list = ref([
		// {
		// 	name: '达人',
		// 	disabled: false,
		// 	value: '1',
		// 	cardData: {
		// 		bgColor: '#007aff',
		// 		title: '成为达人',
		// 		sub: '',
		// 	}

		// },
		{
			name: '团长',
			disabled: false,
			value: '2',
			cardData: {
				bgColor: '#e1093c',
				title: '成为团长',
				sub: '',
			}
		},
	])

	const role = computed(() => {
		return {
			role: user_info.value.role
		}
	})
	const id = ref('6')
	const list = ref({})
	const showUserPhone = ref(false)
	const {
		role2Str
	} = useFilter(role)
	const tabs_list_filter = computed(() => {
		return tabs_list.value.filter(ele => +ele.value > +user_info.value.role)
	})

	onLoad(async (options) => {
		if (options.hasOwnProperty('id')) {
			id.value = options.id
		}
		uni.showLoading()
		await getData()
	})

	async function getData() {
		const res = await $api.web_danye({
			params: {
				id: id.value
			}
		})
		if (res.code == 1) {
			list.value = res.list
			tabs_list.value[0].cardData.title = res.button.name
			tabs_list.value[0].cardData.sub = res.button.info
			// tabs_list.value[1].cardData.title = res.button[1].name
			// tabs_list.value[1].cardData.sub = res.button[1].info
			setOnlineControl(res)
		}
	}
	async function getPhone(data) {
		uni.showLoading()
		await user.refreshUserData()
		showUserPhone.value = false  
		// uni.showLoading()
		// await changeRole()
	}
	function handleChangeShow2(v) {
		showUserPhone.value = v
	}
	async function roleClick() {
		let data = tabs_list.value[0] 
		uni.showModal({
			title: '提示',
			content: `${data.cardData.title}`,
			success: async function(res) {
				if (res.confirm) {
					if(!user_info.value.phonenumber) {
						showUserPhone.value = true  
						return
					}
					uni.showLoading()
					await changeRole(data)
					
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});

	}  
	async function changeRole(data) {
		const res = await $api.change_role({
			params: {
				role: data.value
			}
		})
		if (res.code == 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			}) 
			setTimeout(() => {
				// user.refreshUserData()
				base.handleGoto({
					type: 'reLaunch',
					url: '/pages_user/index/index'
				})
			}, 500)
		}
	}
</script>

<style scoped lang="scss">
	.w {
		min-height: 100vh;
		padding-bottom: 60px;
		box-sizing: border-box;
	}

	.card {
		position: relative;
		z-index: 20;

		&.disabled::after {
			display: block;
		}

		&::after {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(243, 243, 243, 0.5);
			display: none;
			z-index: 20;
		}
	}
</style>
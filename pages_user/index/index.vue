<template>
	<view class="wrapper ">
		<navBar bgColor="#fff" title="个人中心" ></navBar>
		<!-- <u-status-bar></u-status-bar> -->
		<!-- <u-notify ref="notify"></u-notify> -->
		<view class="bg-white u-m-b-25 u-p-b-20">
			<view class="step3 user  u-p-l-30 u-p-r-30 u-p-b-20 u-p-t-50 bg-white">
				<view class="u-flex u-flex-items-start">
					<view class="u-flex u-flex-items-start u-flex-1" @click="showUserInfo = true">
						<template v-if="user_info.img">
							<view class="u-m-r-20">
								<up-image 
									show-loading
									:src="user_info.img" 
									width="50px" 
									height="50px"  
									shape="circle"
									></up-image>
							</view>
						</template>
						<template v-else>
							<view class="user-img u-flex u-flex-items-center u-flex-center" >
								<i class="custom-icon-myfill custom-icon"></i>
							</view>
						</template>
							 
						<view class="user-info u-flex-1" > 
							<view class="item u-flex u-flex-items-center u-m-b-6"> 
								<view class="u-m-r-14 text-nowrap" v-if="user_info.role_name">
									<u-tag :text="user_info.role_name" size="mini" type="error" borderColor="transparent"></u-tag>
								</view> 
								<view class="name u-line-1 u-font-38 step7">{{user_info.name || '暂无昵称'}}</view> 
							</view>
							<view class="item" >
								<view class="sub2 u-font-28 step9 text-light u-flex u-flex-items-center">
									<text >点击编辑信息</text> 
									<i class="custom-icon-edit custom-icon u-font-28 text-light u-m-l-10"></i>
								</view>
							</view> 
							
						</view> 
					</view> 
					<DingYue></DingYue>
				</view>
				
			</view>
			<view class="u-p-15 u-p-l-20 u-p-r-20 u-flex u-flex-between u-flex-items-center bg-white u-font-26" v-if="balance">
				<view class="num-label item u-p-r-15" >
					<view class="bg u-flex u-flex-items-center u-flex-between u-p-20 u-radius-5">
						<view class="u-flex u-flex-items-center">
							<view class="u-m-r-10 u-info">可提现</view>
							<u-count-to 
								:endVal="balance.extract"
								decimals="2"
								separator=","
								duration="500"
								fontSize="15"
								bold
								color="#000"
							></u-count-to>
						</view>
						<view>
							<u-icon name="arrow-right" color="#ccc" size="14"></u-icon>
						</view>
					</view>
				</view>
				<view class="num-label item u-p-l-15" >
					<view class="bg u-flex u-flex-items-center u-flex-between u-p-20 u-radius-5">
						<view class="u-flex u-flex-items-center">
							<view class="u-m-r-10 u-info">可分账</view>
							<u-count-to 
								:endVal="balance.divide"
								decimals="2"
								separator=","
								duration="500"
								fontSize="15"
								bold
								color="#000"
							></u-count-to>
						</view>
						<view>
							<u-icon name="arrow-right" color="#ccc" size="14"></u-icon>
						</view>
					</view>
				</view>
			</view> 
			<view class="u-p-15 u-p-l-20 u-p-r-20 u-flex u-flex-between u-flex-items-center bg-white u-font-26 " v-if="menus_ad.img">
				<image 
					@click="handleMenusClick({url: menus_ad.url, type: 3})"
					style="width: 100%;"
					class="u-radius-5"
					:src="menus_ad.img" 
					mode="widthFix"
				></image>
			</view>
		</view>
		<view class="u-p-20">
		 	<!-- 我的菜单列表 远程控制 -->
		 	<template v-if="menus_wd && menus_wd.length > 0">
		 		<view class="user-item-box u-p-t-30 u-p-b-20 bg-white u-m-b-26 u-radius-20" v-for="(ele, i) in menus_wd" :key="i">
		 			<view class="box-header u-flex u-flex-between u-p-b-20 u-p-l-30 u-p-r-30">
		 				<view class=" u-flex u-flex-items-end u-flex-items-center">
		 					<view class="u-font-34 u-flex u-flex-items-center">
		 						<image v-if="ele.icon" class="u-m-r-5" style="width: 15px;height:15px;" :src="ele.icon" mode=""></image>
		 						<text>{{ele.name}}</text>
		 					</view>
		 					<view class="text-light u-font-26 u-p-l-10" v-if="ele.title">{{ele.title}}</view>
		 				</view>
		 				<view class=" u-flex u-flex-items-center u-flex-items-center" v-if="ele.right_icon && ele.right_url">
		 					<image style="width: 20px;height:20px;" :src="ele.right_icon" mode="" @click="base.handleGoto(ele.right_url)"></image>
		 				</view>
		 			</view>
		 			<view class="box-row other-menus u-flex u-flex-wrap u-flex-items-center u-p-b-20 ">
		 				<view 
		 					class="item u-text-center u-m-t-15" 
		 					v-for="(item, index) in ele.list" 
		 					:key="index"
		 					@click="handleMenusClick(item)"
		 					>
		 					<image class="icon-img u-m-b-10" :src="item.icon" mode=""></image>
		 					<text class="u-font-28 u-p-b-10 u-line-1 text-black">{{item.name}}</text>
		 				</view>
		 			</view>
		 		</view>
		 	</template>
		 	
		 	<!-- 其他公告列表 远程控制 -->
		 	<template v-if="menus_wd1 && menus_wd1.length > 0">
		 		<view class="user-item-box u-p-t-30 u-p-b-20 bg-white u-m-b-26 u-radius-20" >
		 			<view class="box-header u-flex u-flex-between u-p-b-20 u-p-l-30 u-p-r-30">
		 				<view class=" u-flex u-flex-items-end u-flex-items-center">
		 					<view class="u-font-34 u-flex u-flex-items-center">
		 						<!-- <image v-if="ele.icon" class="u-m-r-5" style="width: 15px;height:15px;" :src="ele.icon" mode=""></image> -->
		 						<text>我的服务</text>
		 					</view>
		 					<!-- <view class="text-light u-font-26 u-p-l-10" v-if="ele.title">{{ele.title}}</view> -->
		 				</view>
		 				<!-- <view class=" u-flex u-flex-items-center u-flex-items-center" v-if="ele.right_icon && ele.right_url">
		 					<image style="width: 20px;height:20px;" :src="ele.right_icon" mode="" @click="base.handleGoto(ele.right_url)"></image>
		 				</view> -->
		 			</view>
		 			<view class="box-row other-menus2 u-flex u-flex-wrap u-flex-items-center u-p-b-20 ">
		 				<view 
		 					class="item u-text-center u-m-t-15 u-p-b-10" 
		 					v-for="(item, index) in menus_wd1" 
		 					:key="index"
		 					@click="handleMenusClick(item)"
		 					>
		 					<image class="icon-img u-m-b-10" :src="item.icon" mode=""></image>
		 					<text class="u-font-28  u-line-1 text-base">{{item.name}}</text>
		 				</view>
		 			</view>
		 		</view>
		 	</template>
		</view>
		
		<!-- <template v-if="menus_wd1 && menus_wd1.length > 0">
			<view class="u-p-t-30 u-p-15 bg-white u-m-b-26 rows-menus">
				<view class="item u-text-center u-p-20 u-p-t-30 u-p-b-30 u-flex u-flex-items-center u-flex-between" 
					v-for="(item, index) in menus_wd1" :key="index"
					@click="menusClick2(item)"
					>
					<view class="u-flex u-flex-items-center">
						<image class="icon-img" :src="item.icon" mode=""></image>
						<text class="text-black u-line-1 u-m-l-30">{{item.name}}</text>
					</view>
					<view class="">
						<u-icon name="arrow-right" color="#ccc"></u-icon>
					</view>
				</view> 
			</view>
		</template>  -->
		<u-safe-bottom></u-safe-bottom>
		<MenusBar mode='2'></MenusBar>
	</view>
	<UserInfoPopup
		:show="showUserInfo"
		@onUpdateShow="handleChangeShow" 
	></UserInfoPopup>
	<UserPhonePopup
		:show="showUserPhone"
		@getPhone="getPhone"
		@onUpdateShow="handleChangeShow2" 
	></UserPhonePopup>
</template>


<script setup>
	// import {
	// 	onLoad,
	// 	onShow, 
	// 	onReachBottom,
	// } from "@dcloudio/uni-app";
	// import {
	// 	ref,
	// 	reactive,
	// 	computed,
	// 	toRefs,
	// 	watch,
	// 	inject,
	// 	onMounted
	// } from 'vue'  
	// import menusBar from '@/components/menusBar/menusBa	r.vue'
	import {
		baseStore,
		menusStore
	} from '@/stores/base';
	import {
		userStore 
	} from '@/stores/user';
	// import {baseNotify} from '@/composition/notify.js'
	// const notify = ref()
	// baseNotify(notify) 
	const base = baseStore()
	const menus = menusStore()
	const { menus_wd, menus_wd1, menus_ad } = toRefs(menus)
	const user = userStore()
	const {user_info, balance} = toRefs(user)
	const showUserInfo = ref(false)
	const showUserPhone = ref(false)
	const linkData = ref({}) 
	onLoad(async () => {
		// await user.getMallUserInfo()
		// await user.getCpyInfo() 
		await user.refreshUserData();
		if(user_info.value.gx === 0 || user_info.value.gx === '0') {
			showUserInfo.value = true
		}
		
	})   
	function menusClick2(item) {
		if(item.auth == 1) {
			showUserPhone.value = true
			linkData.value = item
		}
		else {
			handleMenusClick(item)
		}
		
	}
	function handleMenusClick(item) {
		console.log(item)
		if(!item.url) return
		if(item.type == 1 ){
			uni.reLaunch({
				url: item.url
			})
		}
		else if(item.type == 2 ){
			uni.redirectTo({
				url: item.url
			})
		}
		else if(item.type == 3 ){
			uni.navigateTo({
				url: item.url
			})
		}
		
		
	}
	function getPhone(data) {
		menus.getMenusData()
		showUserPhone.value = false
		handleMenusClick(linkData.value)
		linkData.value = {}
	}
	function handleChangeShow(v) {
		showUserInfo.value = v
	}
	function handleChangeShow2(v) {
		showUserPhone.value = v
	}
</script>

<style lang="scss">
	page {
		min-height: 100vh;
		background-color: $page-bg2;
	}
</style>
<style lang="scss" scoped>
	.num-label {
		flex: 0 0 50%;
		box-sizing: border-box;
		.bg {
			background-color: #f9f9f9;
		}
		
	}
	.box-row .custom-icon {
		color: #333;
	}
	.t-label {
		font-size: 22px!important;
	}
	.item-broker {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.icon-w {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		background-color: #e4eef9;
		.custom-icon {
			color: #0d266b;
		}
	}
	.other-menus {
		.item {
			flex: 0 0 20%; 
			.icon-img {
				width: 28px;
				height: 28px;
			}
		}
	}
	.other-menus2 {
		.item {
			flex: 0 0 25%; 
			.icon-img {
				width: 30px;
				height: 30px;
			}
		}
	}
	.rows-menus {
		.item {
			border-bottom: 1rpx solid #f8f8f8;
			.icon-img {
				width: 22px;
				height: 22px;
			}
		}
	}
	
	.wrapper {
		padding-bottom: 50px;
		// padding-top: 44px;
		min-height: 100vh;
		box-sizing: border-box;
		// background-image: linear-gradient(15deg, #f8f8f8 40%, #d6eafe 75%, #e4f5fe 95%);
	}
	.menus-name {
		color: #666;
	}
	.ts-bg {
		// background-image: linear-gradient(to bottom, #fef9f3, #fef7e3);
	}
	.user-item-box {
		// border-radius: 18rpx;
		// box-shadow: 0 5rpx 10rpx rgba(90,90,90,.1);
		.set-sub {
			background-color: #eaf7ff;
			height: 28px;
			border-radius: 6rpx;
			overflow: hidden;
			.sub-title {
				height: 100%;
				border-radius: 0 4rpx 4rpx 0;
			}
			.sub-main {
				height: 100%;
				color: #5a86eb;
			}
		}
		.set-main {
			.mm-img {
				width: 36px;
				height: 36px;
				display: block;
			}
		}
	}
	.user {
		.user-img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 10px;
			background-color: #00b8ff;
			.custom-icon {
				font-size: 22px;
				color: #fff;
			}
		}
		.user-info {
			.name {
				
			}
			.sub {
				background-color: #7da5e2;
				// background-image: linear-gradient(to right, #a1c3f7, #86b0f8);
				border-radius: 6rpx;
				white-space: nowrap;
			}
			.sub2 {
				
			}
		}
	}
	.user-data {
	}
	.service-btn {
		border: 0;
		padding: 0;
		width: 100%;
		.service-btn-main {
			width: 100%;
			line-height: 20px;
		}
	}
</style>

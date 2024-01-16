<template>
	<u-popup :show="show2" @close="show2 = false" mode="center" round="15" :safeAreaInsetBottom="false">
		<view class="wrapper">
			<view class="haibao-w u-flex u-flex-items-center u-flex-center"> 
				<image
					:src="`https://wstm.y.netsun.com/Public/dingyue.png?time=${new Date().getTime()}`"
					class="haibao uni-shadow-base u-p-10 bg-white" 
					mode="widthFix" 
				></image> 
			</view>
			<view class="u-p-20">
				<u-button type="primary" @click="openSetting">前往设置接收消息订阅</u-button>
			</view>
			
		</view>
	</u-popup>
</template>


<script setup> 
	import {
		baseStore,
		menusStore
	} from '@/stores/base';
	import {
		userStore 
	} from '@/stores/user';
	const base = baseStore()
	const menus = menusStore()
	const { menus_wd, menus_wd1, menus_ad } = toRefs(menus)
	const user = userStore()
	const {user_info, balance, tmp_id_list} = toRefs(user) 
	const $api = inject('$api') 
	const loading = ref(false)
	const show2 = ref(false)
	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		}
	})
	const emits = defineEmits('changeShow')
	watch(
		() => props.show,
		(n) => {
			show2.value = n
		}
	)
	
	function openSetting() {
		wx.openSetting({
		  success (res) {
		    console.log(res.authSetting)
		    // res.authSetting = {
		    //   "scope.userInfo": true,
		    //   "scope.userLocation": true
		    // }
		  }
		})
		// show.value = false
		emits('changeShow', false)
	}
</script>

<style lang="scss" scoped>
.btn {
	height: 30px;
	line-height: 30px;
	&:after {
		border: 0;
	}
}
.wrapper {
	// width: ;
}
.haibao {
	width: 60vw;
	background-color: transparent;
	border-radius: 10px; 
} 
</style>
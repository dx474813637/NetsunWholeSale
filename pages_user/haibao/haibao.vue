<template>
	<view class="u-content u-p-20">
		<u-parse :content="content"></u-parse>
	</view>
</template>

<script setup>
	import { onLoad, onReady,  onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	import { share } from '@/composition/share.js'
	const { setOnlineControl } = share()
	import {userStore} from '@/stores/user'
	const user = userStore()
	const { tmp_id_list } = toRefs(user)
	import {baseStore} from '@/stores/base'
	const base = baseStore()
	const {home, roomList, themeColor} = toRefs(base)
	const $api = inject('$api')
	
	const content = ref('')
	onLoad(() => {
		getData()
	})
	
	async function getData() {
		const res=  await $api.myEwm();
		if(res.code == 1) {
			content.value = res.list
			setOnlineControl(res)
		}
	}
</script>

<style lang="scss">

</style>

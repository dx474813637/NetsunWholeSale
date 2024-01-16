<template>
	<view>
		video
	</view>
</template>

<script setup>
	import zeroLazyLoad from '@/uni_modules/zero-lazy-load/components/zero-lazy-load/zero-lazy-load.vue'
	import { share } from '@/composition/share.js'
	import useDataList from '@/composition/useDataList.js'
	import {useCateStore, baseStore} from '@/stores/base.js'  
	const base = baseStore() 
	const {themeColor, empty} = toRefs(base)
	const { setOnlineControl } = share()
	const $api = inject('$api')
	const $http = inject('$http')
	const $VodUploader = inject('$VodUploader')
	
</script>

<style lang="scss">

</style>
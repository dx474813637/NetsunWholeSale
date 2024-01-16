<template>
	<view class="search-w u-flex u-flex-items-center">
		<u-search
			placeholder="请输入商品关键词" 
			v-model="keyword"
			bgColor="#fff" 
			:showAction="false" 
			@search="handleSearch"
			></u-search>
			<view class="u-m-l-20">
				<u-button 
					type="error"   
					color="#f03337"
					customStyle="height: 34px "
					shape="circle"
					@click="handleSearch"
				>搜索</u-button>
			</view>
	</view>
</template>

<script setup>
	// import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	// import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'
	// import { share } from '@/composition/share.js'
	import useDataList from '@/composition/useDataList.js'
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore()
	// const { setOnlineControl } = share()
	const $api = inject('$api')
	const keyword = ref('') 
	
	
	function handleSearch() {
		base.handleGoto({
			url: '/pages/product/productList',
			params: {
				terms: keyword.value
			}
		})
	}
</script>

<style lang="scss">

</style>
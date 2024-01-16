<template>
	<view class="w u-p-20" >
		<view class="status-w u-text-center u-p-t-20 u-p-b-40 u-font-40 text-bold text-white u-line-2" >
			{{ tuan.title }}
		</view> 
		<view class="u-m-b-20">
			<view class="tuan-card u-radius-8 bg-white u-p-30">
				<view class="card-row u-flex u-flex-items-center u-flex-between u-m-b-20"> 
					<view class="item u-flex-1 ">
						<view class="text-error u-m-b-20">
							{{title}}
						</view> 
						<view class="u-p-20 u-radius-6 u-info-light-bg text-base u-font-28">
							<u-parse :content="tuan.info"></u-parse> 
						</view> 
					</view> 
				</view> 
			</view> 
		</view>
		<view class="u-p-20  text-bold u-info u-font-28">
			达人列表
		</view>
		<view class="list">  
			<view class="list-item u-m-b-15" v-for="item in dataList" :key="item.id">
				<DarenCard
					:origin="item"
					:kg="kg"
					@analysis="analysisEvent"
				></DarenCard>
			</view>
			<template v-if="dataList.length == 0">
				<u-empty mode="data" :icon="base.empty" />
			</template>
			<template v-else>
				<u-loadmore :status="loadstatus" />
			</template>  
				
				
			<u-safe-bottom></u-safe-bottom>
		</view>	 
	</view>
	<DarenAnalysisPopup
		:show="showDarenAnalysis" 
		title="达人分析" 
		:list="daren_analysis"
		:onUpdateShow="handleChangeShow" 
	></DarenAnalysisPopup>
	<MenusBar></MenusBar>
</template>

<script setup>
	import { onLoad, onReady, onReachBottom, onUnload } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch } from 'vue'
	import useDataList from '@/composition/useDataList.js'
	// import { share } from '@/composition/share.js'
	import { baseStore } from '@/stores/base'
	import {userStore} from '@/stores/user'
	const user = userStore()
	const { tmp_id_list } = toRefs(user)
	const base = baseStore(); 
	// const {
	// 	setOnlineControl,
	// 	onlineControl
	// } = share()
	const $api = inject('$api')   
	const tuan = ref({})
	const kg = ref(0)
	const daren_analysis = ref([])
	const showDarenAnalysis = ref(false)
	const analysis_loading = ref(false)
	const options = computed(() => {
		return {
			params: {
				// role: role.value,
				// type: tabs_list.value[tabs_current.value].value
			},
			api: 'daren_list',
			getDataCallBack: (res) => {
				if (res.code == 1) {
					dataList.value = [...dataList.value, ...res.list]
					tuan.value = res.tuan
					kg.value = res.kg
					
					if(curP.value >= res.total) {
						loadstatus.value = 'nomore'
					}
					else {
						loadstatus.value = 'loadmore'
					}
				}
			}
		}
	})
	
	const { 
		dataList,
		curP,
		loadstatus,
		params,
		getDataList,
		initDataList, 
	} = useDataList(options)
	const role = ref('1')
	onLoad(async (options) => { 
		if(options?.role) {
			role.value = options.role
		}
		uni.$on('updateData', initDataList)
		initDataList() 
	})  
	onUnload(() => {
		uni.$off('updateData', initDataList)
	})
	const title = computed(() => `达人分成比例：${tuan.value.divide}%`)
	
	function cardClick() {
		if(role.value != '2') return
		base.handleGoto({
			url: '/pages_user/tuan/tuanAdd',
			params: {
				type: 'edit'
			}
		})
	}
	function handleChangeShow(data) {
		showDarenAnalysis.value = data
	}
	async function analysisEvent({data}) {
		if(analysis_loading.value) return
		daren_analysis.value = {}
		uni.showLoading();
		analysis_loading.value = true
		try{
			const res = await $api.divide_analysis({params: {id: data.did}})
			if(res.code == 1) {
				showDarenAnalysis.value = true
				daren_analysis.value = res.list
			}
		}catch(e){
			uni.hideLoading()
			//TODO handle the exception
		}
		analysis_loading.value = false
		
	}
	
</script>

<style scoped lang="scss">
.w {
	// min-height: 100vh;
	padding-bottom: 60px;
	background: linear-gradient(to bottom, #F12E24,  #F12E24 100px, #f8f8f8 180px);
} 
.card {
	
}
</style>
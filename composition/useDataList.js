import {
	defineComponent,
	ref,
	reactive,
	inject,
	computed
} from 'vue'
import {
	onLoad,
	onReachBottom
} from '@dcloudio/uni-app' 
export default function useDataList(data = { value: {params: {}, api: '', noReach: false} }) { 
	const $api = inject('$api')   
	const dataList = ref([])
	const curP = ref(1)
	const loadstatus = ref('loadmore')
	
	const params = computed(() => {
		return {
			p: curP.value,
			...data.value.params
		}
	}) 
	
	onReachBottom(() => {  
		// console.log(data.value.noReach)
		if(data.value.noReach) return
		getMoreDataList()
	}) 
	function initDataListParams() { 
		curP.value = 1;
		dataList.value = []
	}
	async function initDataList() {
		uni.showLoading()
		initDataListParams();
		await getDataList()
	} 
	async function getMoreDataList() {
		if(loadstatus.value != 'loadmore') return
		curP.value ++
		await getDataList()
	} 
	async function getDataList() { 
		const res = await $api[data.value.api]({params: params.value})
		if(data.value.hasOwnProperty('getDataCallBack')) {
			data.value.getDataCallBack(res)
		}else {
			if (res.code == 1) {
				dataList.value = [...dataList.value, ...res.list]
				if(dataList.value.length >= res.total) {
					loadstatus.value = 'nomore'
				}
				else {
					loadstatus.value = 'loadmore'
				}
			}
		}
		
	}
	
	
	
	
	return {
		dataList,
		curP,
		loadstatus,
		params,
		getDataList,
		initDataListParams,
		initDataList, 
		getMoreDataList
	}
}
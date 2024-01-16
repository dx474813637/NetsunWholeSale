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
export default function usePacc(data ) { 
	const $api = inject('$api') 
	
	const lastMoney = ref({
		money: 'hide',
		loading: false
	})
	const list = ref({}) 
	async function getMoney() {
		if(lastMoney.value.loading) return
		lastMoney.value.loading = true
		const res = await $api.query_loans_information({params: {id: list.value.id}})
		lastMoney.value.loading = false
		if(res.code == 1) { 
			lastMoney.value.money = res.list.money
		}
	}
	async function getyiqianbao(contract_id) {
		const res = await $api.yiqianbao_start({params: {id: pid, contract_id}})
		if(res.code == 1) { 
			uni.showToast({
				title: res.msg
			})
			// refreshData()
		}
	} 
	async function updateyiqianbao(contract_id) {
		console.log($api)
		const res = await $api.query_signflows({params: {id: list.value.id, contract_id}})
		if(res.code == 1) {
			uni.showToast({
				title: res.msg
			})
			// refreshData()
		}
	} 
	// async function cancelyiqianbao(contract_id) {
	// 	const res = await $api.yiqianbao_cancel({params: {id: list.value.id, contract_id}})
	// 	if(res.code == 1) {
	// 		uni.showToast({
	// 			title: res.msg
	// 		})
	// 		refreshData()
	// 	}
	// } 
	function watchPDF({signflows_state, file_url, pdf_http}) {  
		uni.downloadFile({
		  url: signflows_state == 3? file_url: pdf_http,
		  success: function (res) {
		    var filePath = res.tempFilePath;
		    uni.openDocument({
		      filePath: filePath,
		      showMenu: true,
		      success: function (res) {
		        console.log('打开文档成功');
		      }
		    });
		  }
		});
	}
	
	
	
	return {
		getMoney,
		getyiqianbao,
		updateyiqianbao,
		// cancelyiqianbao,
		watchPDF,   
		list,
		lastMoney 
	}
}
import {
	defineStore
} from 'pinia';
import apis from '@/config/apis/index';

export const useFinanceStore = defineStore('finance', {
	state: () => {
		return { 
			account_info: {},
			account_loading: false, 
			organizations_info: {},
			organizations_loading: false, 
			transfer_process_info: {},
			transfer_process_loading: false, 
			idTypeList: [
				{
					name: '中国大陆身份证',
					value: 'CRED_PSN_CH_IDCARD'
				},
				{
					name: '台湾来往大陆通行证',
					value: 'CRED_PSN_CH_TWCARD'
				},
				{
					name: '澳门来往大陆通行证',
					value: 'CRED_PSN_CH_MACAO'
				},
				{
					name: '香港来往大陆通行证',
					value: 'CRED_PSN_CH_HONGKONG'
				},
				{
					name: '护照',
					value: 'CRED_PSN_PASSPORT'
				},
			],
			bank_list: [],
			bank_loading: false, 
			regional_list: [],
			regional_loading: false, 
			bank_buy_all: {},
			bank_buy_all_loading: false, 
			no_order_buyer: {},
			no_order_buyer_loading: false, 
			tooclePic: 'https://img-i-album.toocle.com/200-200/',
			numList: [
				{
					name: '信息填写'
				}, 
				{
					name: '个人认证'
				}, 
				{
					name: '企业认证'
				}, 
				{
					name: '完成',
				},
			]
		};
	},
	getters: { 
	}, 
	actions: { 
		async getno_order_buyer() {
			this.bank_buy_all_loading = true
			try { 
				const res = await apis.no_order_buyer_detail();
				if(res.code == 1 && res.list.hasOwnProperty('id')) {
					this.no_order_buyer = {...res.list, filesList: [{url: `${this.tooclePic}${res.list.reg_pic}`}] }
				} 
			} catch (error) {
				
			}
			this.bank_buy_all_loading = false
			
		},    
		async getbankbuyall() {
			this.bank_buy_all_loading = true
			try { 
				const res = await apis.bank_buy_all();
				if(res.code == 1) {
					this.bank_buy_all = res.list 
				} 
			} catch (error) {
				
			}
			this.bank_buy_all_loading = false
			
		},    
		async getAccountData() {
			this.account_loading = true
			try {
				await apis.verify_account_3()
				const res = await apis.account();
				if(res.code == 1) {
					this.account_info = res.list 
				} 
			} catch (error) {
				
			}
			this.account_loading = false
			
		},  
		async getCpyData() {
			this.organizations_loading = true
			try {
				await apis.query_organizations()
				const res = await apis.organizations(); 
				if(res.code == 1) {
					this.organizations_info = res.list 
				} 
			} catch (error) {
				
			}
			this.organizations_loading = false
		},  
		async query_transfer_process() {
			this.transfer_process_loading = true
			try { 
				const res = await apis.query_transfer_process(); 
				if(res.code == 1) {
					this.transfer_process_info = res.list.info
				} 
			} catch (error) {
				
			}
			this.transfer_process_loading = false
		},  
		async getBankListData() {
			this.bank_loading = true 
			const res = await apis.transfer_random_amount_detail();
			this.bank_loading = false
			if(res.code == 1) {
				this.bank_list = res.list.bank_list
			} 
		},  
		async getRegionalData() {
			this.regional_loading = true 
			const res = await apis.get_regional();
			this.regional_loading = false
			if(res.code == 1) { 
				this.regional_list = exchangeRegionalData( 'items', res.list)  
			} 
		},  
	},
});

function exchangeRegionalData(keyname, origin) {
    let arr = uni.$u.deepClone(origin[keyname]).map(ele => ({ text: ele.name, value: ele.code }));
    arr.forEach(ele => {
        let key = 'items' + ele.value
        let item = origin[key]
        if (item) {
            ele.children = exchangeRegionalData(key, origin)
        }
    });

    return arr

}
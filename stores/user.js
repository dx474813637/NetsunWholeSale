import {
	defineStore
} from 'pinia';
import apis from '@/config/apis/index';

export const userStore = defineStore('user', {
	state: () => {
		return { 
			// 微信openID的相关信息
			user: uni.getStorageSync('user') || {},
			// 预约信息
			user_info: {},
			balance: false,
			user_loading: false,
			// 选品用户信息
			mall_user: uni.getStorageSync('mall_user') || {},
			mall_user_info: {},
			mall_user_loading: false, 
			// 公司信息
			cpy_info: {},
			cpy_loading: false,
			tmp_id_list: [],
			zx: 0,
			biji_files: [],
			biji_info: '',
			biji_step: false,
			biji_linshi: false
		};
	},
	getters: { 
	}, 
	actions: { 
		async sendDingyue() {
			wx.getSetting({
				withSubscriptions: true,
				success: async res => {
					console.log(res)
					const r = await apis.get_tmp_id_time({
						params: {
							str: JSON.stringify(res)
						}
					});
				}
			})
		},
		async gettmp_id_list() {
			const res = await apis.tmp_id_list();
			if(res.code == 1) {
				this.tmp_id_list = res.list
			}
		},
		async getUserInfo(data) { 
			this.user_info = data;
			
			data.tid && uni.$u.http.setToken({
				tid: data.tid
			})  
			data.id && uni.$u.http.setToken({
				poster: data.id
			})  
		},
		async refreshUserData() {
			const res = await apis.memu()
			if(res.code == 1) {  
				this.zx = res.zx 
				// if(this.zx == 1) {
				// 	uni.reLaunch({
				// 		url: '/pages/userInactive/userInactive'
				// 	})
				// }
				this.getUserInfo(res.info)
				this.balance = res.balance 
			}
		},
		// async getCpyInfo() {
		// 	this.cpy_loading = true
		// 	const res = await apis.my_company();
		// 	this.cpy_loading = false
		// 	if(res.code == 1) {
		// 		this.cpy_info = res.list || {} 
		// 	}else {
		// 		this.cpy_info = {}
		// 	}
		// 	// uni.setStorageSync('WebSocketInfo', res)
		// 	return res
		// },
		// async getMallUserInfo() {
		// 	this.mall_user_loading = true
		// 	const res = await apis.my_card();
		// 	this.mall_user_loading = false
		// 	if(res.code == 1) {
		// 		this.mall_user_info = res.list || {}
				
		// 	}else {
		// 		this.mall_user_info = {}
		// 	}
		// 	// uni.setStorageSync('WebSocketInfo', res)
		// 	return res
		// },
		clearLogout() {
			this.user = {}
			this.user_info = {}
			this.mall_user_info = {}
			uni.removeStorageSync('user')
			uni.removeStorageSync('mall_user')
			uni.removeStorageSync('poster')
			uni.removeStorageSync('userid')
			uni.removeStorageSync('WebSocketInfo')
			// if(data.needRouteUserHome) {
			// 	uni.reLaunch({
			// 		url: '/pages_user/index/index'
			// 	})
			// }
			
		},
		// async logout() {
		// 	uni.showLoading()
		// 	const res = await apis.sign_out();
		// 	if(res.code == 1) {
		// 		this.clearLogout()
		// 	}
		// },
		saveUserInfo(data) {
			this.user = data; 
			uni.setStorageSync('poster', data.poster) 
			uni.setStorageSync('user', data) 
			uni.setStorageSync('userid', data.userid) 
		},
		get_xcx_code() {
			return new Promise((resolve, rejected) => {
				uni.login({
					success: function (res){
						resolve(res.code);
					},
					fail: err => {
						// md5flag = true
						rejected(err)
					}
				});
			});
		},
		async refreshToken() {
			try{
				let code = await this.get_xcx_code();
				console.log('code打印:',code)
				return apis.xcx_login({params: {code}}) 
			}catch(e){
				return e
			}
		}
	},
});
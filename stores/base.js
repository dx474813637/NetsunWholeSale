import {
	defineStore,
	storeToRefs
} from 'pinia';
import pinia from '@/stores/index.js'
import apis from '@/config/apis/index';
import {initAddressData} from '@/utils/base.js'
let addressData = initAddressData()
import { userStore } from '@/stores/user'; 
// const extConfig = uni.getExtConfigSync ? uni.getExtConfigSync():{}
// console.log(extConfig) 
let pageRoute = uni.getStorageSync('noTokenNeedPermissionRoute') || ''
export const baseStore = defineStore('base', {
	state: () => {
		return {
			sys: uni.getSystemInfoSync(),
			configBaseURL: 'https://wstm.y.netsun.com/pifa/Xcxapi/',
			configHeader: {
				'content-type': 'application/x-www-form-urlencoded',
				// 'content-type': 'application/json',
				'appid': 10002,
				'appsecret': '8643T/XqQU0lFMPS50jF6ZwdpZCRVoAQywrdxm7E5VdG/z60fByQLQg',
				// 'xcxlogin': extConfig.attr.login,
				// 'xcxappid': extConfig.attr.wxappid,
				'tid2': uni.getStorageSync('tid2') || '',
				'poster2': uni.getStorageSync('poster2') || '',
				'shareother': uni.getStorageSync('share_other') || '',
			},
			share_other: '',
			themeColor: '#f11242',
			empty: 'https://wx.rawmex.cn/Public/memu/data1.png',
			online: {
				count: 0, 
			}, 
			msg: {},
			home: {},
			roomList: [],
			home_loading: false,
			noTokenNeedPermissionRoute: pageRoute,
			regional_list: addressData,
			regional_list_loading: false,
			addressData: addressData
		};
	}, 
	actions: {
		async getRoomList() {
			if(this.home_loading) return
			try {
				this.home_loading = true
				const res = await apis.yuyue_roomid_list() 
				if(res.code == 1) { 
					this.home_loading = false
					//获取搜索类型数据
					this.home = res.home
					this.roomList = res.list
					return res
				}
			} catch (error) { 
				this.home_loading = false
				return error
			}
		},
		getMsg(data) {
			console.log('getMsg', data)
			this.msg = data
		},
		addMsg(data) {
			console.log('add', data)
			this.msg.push(data)
		},
		delMsg(data) {
			this.msg.shift(data)
		},
		saveShareInfo(data) {
			this.share_other = data;
		}, 
		handleGoto(data, type="") {
			if(type == 'serviceChat') { 
				if(!data.url || !data.appid) {
					uni.showToast({ title: '客服参数异常' })
					return 
				}
				wx.openCustomerServiceChat({
				  extInfo: { url: data.url },
				  corpId: data.appid,
				  ...data,
				  success(res) {
					  if(data.hasOwnProperty('success')) {
						  data.success(res)
					  }
				  },
				  fail(err) {
					  if(data.hasOwnProperty('fail')) {
						  data.fail(err)
					  }
				  }
				})
				return
			}
			uni.$u.route(data)
		}, 
		setNoTokenNeedPermissionRoute(data) {
			this.noTokenNeedPermissionRoute = data;
			uni.setStorageSync('noTokenNeedPermissionRoute', data)
		},
		async get_regional_list() {
			if(this.regional_list_loading) return
			try {
				this.regional_list_loading = true
				const res = await apis.addressDetail() 
				if(res.code == 1) { 
					this.regional_list_loading = false
					//获取搜索类型数据
					this.regional_list = exchangeData(JSON.parse(res.regional_list))
					// console.log(this.regional_list)
					return true
				}
			} catch (error) { 
				this.regional_list_loading = false
				return error
			}
		},
		async getImageBase64_readFile(tempFilePath) {
			console.log(tempFilePath)
			  return await new Promise(resolve => {
					//获取全局唯一的文件管理器 
					uni.getFileSystemManager().readFile({ //读取本地文件内容
					  filePath: tempFilePath, // 文件路径
					  encoding: 'base64', // 返回格式
					  success: ({
						data
					  }) => {
						// return resolve('data:image/png;base64,' + data);
						return resolve( data);
					  }
					});
			  });
		},
		async uploadFilePromise(url, api="upimg") { 
			return new Promise((resolve, reject) => { 
				uni.uploadFile({
					url: `${this.configBaseURL}${api}`, 
					filePath: url,
					name: 'file',
					header: {
						...this.configHeader,
						'content-type': 'multipart/form-data',
						userid: uni.getStorageSync('userid'),
					},
					success: (res) => {
						console.log(res)
						resolve(JSON.parse(res.data))
					},
					fail(error) { 
						console.log(error)
						reject(error)
					}
				});
			})
		}
	},
});
 

export const menusStore = defineStore('menus', {
	state: () => {
		return {  
			menus: [], 
			menus_51xp: [], 
			menus_wd: [],
			menus_wd1: [], 
			menus_ad: {},
			new_memu: [],
			news: 0,
			currPage: {
				route: '/pages/index/home',
				options: {}
			},
			cpy_type_origin: [[]],
			cpy_type: [[]],
		};
	},
	getters: {
		menusActive: (state) => state.menus.findIndex(ele => ele.route == state.currPage.route) ,
	}, 
	actions: {
		saveCurPage(data) {
			// console.log('saveCurPage', data)
			this.currPage = data;
		},
		async getMenusData($http) {   
			const res = await apis.memu()  
			if(res.code == 1) {  
				let user = userStore()
				// user.saveUserInfo(res.info)
				user.getUserInfo(res.info)
				//获取底部导航菜单
				this.menus = res.memu.map((ele, index) => {
					let paramsStr = ele.url.split('?')[1] || ''
					let paramsObj = {}
					paramsStr && paramsStr.split('&').forEach(item => {
						paramsObj[item.split('=')[0]] = item.split('=')[1]
					})
					 
					return {
						...ele,
						route: ele.url.split('?')[0],
						options: paramsObj
					}
				})   
				// this.menus_51xp = res.list.memu
				// 获取个人中心基础菜单
				this.menus_wd = res.list
				this.menus_wd1 = res.list1
				this.menus_ad = res.ad
				 
			} 
		}
	},
});


export const useCateStore = defineStore('cate', {
	state: () => {
		return {  
			cate_list: [],  
			cate_loading: false
		};
	},
	getters: { 
	}, 
	actions: { 
		async getCateData() { 
			this.cate_loading = true
			try {
				const res = await apis.cate_list() 
				this.cate_loading = false
				if(res.code == 1) { 
					//获取搜索类型数据
					this.cate_list = res.list.map(ele => {
						ele.children.unshift({
							name: '全部',
							id: ele.id
						})
						return {
							...ele
						}
					})  
				}
			} catch (error) { 
				console.log(error)
				this.cate_loading = false
				return error
			}
			
		}
	},
});


function exchangeData(data) {
	let arr = []
	arr = data.map(ele => {
		let base = {
			text: ele.value,
			value: ele.id, 
		}
		if(ele.childs) {
			base.children = exchangeData(ele.childs)
		}
		return base
	})  
	return arr
}
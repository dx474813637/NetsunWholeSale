import {
	userStore
} from '@/stores/user';
import {
	menusStore,
	baseStore
} from '@/stores/base'; 
import pinia  from '@/stores/index.js'; 
import {inject, nextTick} from 'vue'

const user = userStore(pinia)
const menus = menusStore(pinia)
const base = baseStore(pinia) 
/**
 * @description 自定义路由拦截
 */ 
 const whiteList = [ 
 	'/pages_user/index/index', 
	'/pages_user/reservation_list/reservation_list',
 	{
 		pattern: /^\/pages/
 	},
 	// '/pages/user/index',
 	// {
 	// 	pattern: /^\/pages\/list.*/
 	// },
 	// // { pattern: /^\/pages\/index\/login*/ },
 	// {
 	// 	pattern: /^\/pages\/baojia*/
 	// },
 	// {
 	// 	pattern: /^\/pages_user\/*/
 	// },
 	// {
 	// 	pattern: /^\/pages\/more*/
 	// },
 	// { pattern: /^\/pages\/index\/(?!attention).*/ },
 ];
 // 用户信息未完善 权限列表
const userStateList =  [
	// {
 // 		pattern: /^\/pages\/my\/broker\/edit*/
 // 	},
 // 	{
 // 		pattern: /^\/pages\/my\/broker\/prod_edit*/
 // 	},
 ]
 
export function permissionBase(e, data) {
	 
	 	const url = e.url.split('?')[0]
	 	console.log('url:addInterceptor ===> ', e.url) 
	 	// const r = uni.getStorageSync('WebSocketInfo')
	 	// $ws.send('{"type":"xcx","client_name":"' + r.w_login + '","rawmex_login":"' +
	 	// 	r.login + '","room_id":"zhushou_xcx","token":"' + r.w_token +
	 	// 	'","login":"' + r.w_login + '","content":"' + e.url + '"}')
	 		
	 	// 判断当前窗口是白名单，如果是则不重定向路由
	 	let pass 
	 	if (whiteList) {
	 		pass = whiteList.some((item) => { 
	 			if (typeof(item) === 'object' && item.pattern) { 
	 				return item.pattern.test(url)
	 			}
	 			return url === item
	 		}) 
	 	}
	 	// 不是白名单并且没有token
		// console.log(user.user.login, user.user_info.login)
		// console.log(!user.user.login, !user.user_info.login, pass)
	 	// if (!pass && (!user.user.login || !user.user_info.user )) {
	 	// if (!pass && (!user.user.login || user.user.login == '0' )) {
			
	 	// 	// uni.setStorageSync('prePage', e.url)
			// base.setNoTokenNeedPermissionRoute(e.url)
			// // user.clearLogout()
			// base.handleGoto({url: '/pages/login/login'})  
	 	// 	return false
	 	// }
	 	
	 	if (!pass) { 
	 		// if (user.myCpy.hasOwnProperty('state') && user.myCpy
	 		// 	.state == 0) { 
	 		// 	uni.showToast({
	 		// 		title: '请等待用户信息审核成功',
	 		// 		icon: 'none'
	 		// 	})
	 		// 	return false
	 		// }
	 		// if (!user.myCpy.hasOwnProperty('state')) {
	 		// console.log('=======>3')
	 		// 	uni.showModal({
	 		// 		title: '提示',
	 		// 		content: '请先完善用户信息',
	 		// 		confirmText: '去完善',
	 		// 		cancelText: '考虑一下',
	 		// 		success: function(res) {
	 		// 			if (res.confirm) {
	 		// 				uni.setStorageSync('prePage', e.url)
	 		// 				uni.navigateTo({
	 		// 					url: "/pages/my/user/info"
	 		// 				})
	 		// 			} else if (res.cancel) {
	 		// 				console.log('用户点击取消');
	 		// 			}
	 		// 		}
	 		// 	});
	 		// 	return false
	 		// } 
	 	} 
	 	//记录路径参数数据 底部菜单跳转判断买卖盘用
	 	let paramsObj = {}
	 	e.url.split('?')[1]?.split('&').forEach(item => {
	 		paramsObj[item.split('=')[0]] = item.split('=')[1]
	 	})
		menus.saveCurPage({
	 		route: url,
	 		options: paramsObj
	 	}) 
		if(paramsObj.tid) {
			data.$http.setToken({
				tid: paramsObj.tid
			}) 
		}
		return true
}
 
export default async function(data) {
	// console.log($ws)   
	const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'] 
	// 用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
	list.forEach(item => {
		uni.addInterceptor(item, {
			invoke(e) {  
				let res = permissionBase(e, data)
				if(!res) return false 
				return e
			},
			fail(err) { // 失败回调拦截
				console.log(err)
			}
		})
	})
}

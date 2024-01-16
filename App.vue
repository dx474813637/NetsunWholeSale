<script setup>
	import routingIntercept from '@/config/permission/index.js' 
	import {inject, nextTick} from 'vue'
	import {
		baseStore
	} from '@/stores/base';
	import {
		userStore
	} from '@/stores/user';
	import {
		onLaunch,
		onShow,
		onHide,
	} from "@dcloudio/uni-app"; 
	// const $ws = inject('$ws')
	const $api = inject('$api')
	const $http = inject('$http')
	const base = baseStore() 
	const user = userStore() 
	onLaunch(async () => {
		if (uni.canIUse('getUpdateManager')) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: function(res) {
								console.log('success====', res);
								// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
						});
					});
				}
			});
		} 
		let options = uni.getLaunchOptionsSync() 
		if(options.query.hasOwnProperty('scene')) { 
			let arr = decodeURIComponent(options.query.scene).split('&') 
			arr.forEach(item => {
				let arr2 = item.split('=')
				options.query[arr2[0]] = arr2[1]
			})
		} 
		console.log('opt', options) 
		if(options.query?.share_other) {
			if(options.query.hasOwnProperty('scene')) {
				$http.setToken({
					shareother: options.query.share_other
				})
				uni.setStorageSync('share_other', options.query.share_other)
			}
			
			base.saveShareInfo(options.query.share_other) 
			
			
		} 
		if (options.query?.poster) {
			$http.setToken({
				poster2: options.query.poster
			})
			uni.setStorageSync('poster2', options.query.poster)
		}
		if (options.query?.tid) {
			$http.setToken({
				tid2: options.query.tid
			}) 
			uni.setStorageSync('tid2', options.query.tid)
		}
		if (options.query?.gdt_vid || options.query?.qz_gdt) {
			$http.setToken({
				clickId: options.query.gdt_vid || options.query.qz_gdt
			}) 
		}
		routingIntercept({$http})  
		user.refreshUserData()
		user.sendDingyue()
	});
	onShow(async (options) => {   
		// if(uni.getStorageSync('WebSocketInfo')) $ws.init()
		 
		 // if(options.query?.route && options.query.route != '/pages/home/home2' && user.user.login == 0) {
		 // 	uni.redirectTo({
		 // 		url: '/pages/home/home2', 
		 // 	})
		 // }
		// if(!user.user_info.user) {
		// 	uni.redirectTo({
		// 		url: '/pages/index/index'
		// 	})
		// 	// base.handleGoto({url: '/pages/index/index', type: 'redirectTo'}) 
		// }
		
	});
	onHide((options) => {
		// console.log('App Hide')
		// uni.closeSocket()
		// if(uni.getStorageSync('WebSocketInfo')) $ws.completeClose()
	}); 
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-plus/index.scss";
	@import '@/common/ext.scss';
	@import '@/common/iconfont.css';
	$u-error: #F12E24;
	page {
		background-color: #f8f8f8;
	}
	page {
		::v-deep {
			.u-upload__deletable {
				width: 30px!important;
				height: 30px!important;
				background-color: #f00!important;
				.u-upload__deletable__icon { 
					transform: scale(1)!important;
					top: 6px!important; 
					right: 4px!important;
					.uicon-close {
						font-size: 16px!important;
					}
				}
			}
		}
	}
</style>
import {
	defineComponent,
	ref,
	reactive,
	inject,
	computed,
	watch
} from 'vue'
import {
	onLoad,
	onReachBottom
} from '@dcloudio/uni-app' 
import {useCateStore, baseStore} from '@/stores/base.js'   
import {userStore} from '@/stores/user.js' 
import "../utils/vod-wx-sdk-v2.js"
const VodUploader = require("../utils/vod-wx-sdk-v2.js"); 
console.log(VodUploader)
export default function useUploadMedia(data = {}) { 
	const defaultConfig = {
		count: 9,
		mediaType: ['mix'],
		sourceType: ['album', 'camera'],
		maxDuration: 60, 
		pic_maxSize: 5120000,
		// video_maxSize: 51200000,
	}	  
	const base = baseStore() 
	const config = computed(() => ({
		...defaultConfig,
		...data.value
	}))
	const user = userStore() 
	const { biji_files, biji_step, biji_info, biji_linshi } = toRefs(user)
	const $api = inject('$api')   
	const $http = inject('$http')
	const $VodUploader = VodUploader // inject('$VodUploader') 
	const files = ref([])
	const uploadLoading = ref(false)
	const coverFile = ref({tempFilePaths:[]})
	watch(
		() => biji_files.value,
		(n) => {
			console.log(n)
			files.value = n
		},
		{
			deep: true,
			immediate: true
		}
	)
	// const dataList = ref([])
	// const curP = ref(1)
	// const loadstatus = ref('loadmore')
	function chooseMedia() { 
		console.log(data, config) 
		return new Promise((resolve, reject) => {
			uni.chooseMedia({
				count: config.value.count,
				mediaType: config.value.mediaType,
				sourceType: config.value.sourceType,
				maxDuration: config.value.maxDuration,
				camera: 'back',
				success: function (res) {
					console.log(res)
					// const files_type = res.type
					let indexs = []
					let data = res.tempFiles.filter((ele, index) => {
						let {flag, err} = validateFile(ele)
						if(!flag) indexs.push({index, err})
						return flag
					})
					 
					files.value = data 
					
					console.log(`all files`, res);
					console.log(`add files`, data);
					
					let content = `共选择${res.tempFiles.length}个文件，添加成功${files.value.length}个，失败${indexs.length}个。`
					if(indexs.length > 0) {
						let errStr = indexs.map(ele => `【第${ele.index+1}个文件：${ele.err.join('；')}】`)
						content += `失败原因：${errStr}。`
					}
					console.log(content)  
					uni.showModal({
						title: '添加提示',
						content: content,
						confirmText: '进入预览', 
						success: (r) => {
							if (r.confirm) {
								console.log('用户点击确定');
								biji_files.value = data
								files.value = data
								resolve(true)
							} else if (r.cancel) {
								console.log('用户点击取消');
								reject(false)
							}
						}
					}); 
					
					
				},
				fail: (err) => {
					console.log(err)
				}
			});
		})
		
	}
	function validateFile(file) {
		const type = file.fileType 
		let flag = true
		let err = []
		if(type == 'image') {
			if(file.size > config.value.pic_maxSize) { 
				flag = false
				err.push(`图片大小请勿超过${Math.round(config.value.pic_maxSize/1024/1024)}MB`)
			}
		}
		else if(type == 'video') {
			if (file.duration > config.value.maxDuration) {
				flag = false
				err.push(`视频时长请勿超过${config.value.maxDuration}秒`) 
				
			}else if ( config.value.hasOwnProperty('video_maxSize') && file.size > config.value.video_maxSize ) {
				flag = false
				err.push(`视频大小请勿超过${config.value.video_maxSize/1000000}MB`) 
			}
		}
		return { flag, err }
	}
	 
	async function startUpload() {
		if (!uploadLoading.value) {
			uploadLoading.value = true
			// setTimeout(()=> {
			// 	uploadLoading.value = false
			// }, 5000) 
			
			for (let i = 0; i < files.value.length; i++) {
				let item = files.value[i] 
				if(item.status != 'success') {
					let result = {}
					if(item.fileType == 'image') {
						result = await base.uploadFilePromise(item.tempFilePath) 
						if(result.code == 1) {
							files.value.splice(i, 1, Object.assign(item, {
							 	status:'success',
							 	message:'',
							 	title:'',
							 	url: result.list[0],
							 	name: result.list[0]
							}))  
						}
						else {
							files.value.splice(i, 1, Object.assign(item, {
								status: 'error',
								message: result.msg, 
								url: '',
								name: ''
							}))  
							 
						}
						
					} 
					else if(item.fileType == 'video') {
						result = await videoUploadEvent(item) 
						files.value.splice(i, 1, Object.assign(item, {
							status: result.status,
							message: '',
							url: result.result.videoUrl,
							name: result.result.fileId
						}))  
					} 
					else {
						files.value.splice(i, 1, Object.assign(item, {
							status: 'error',
							message: '文件有误',
							url: '',
							name: ''
						}))
					}
					console.log(result)
				} 
				
				
				
			}
			uploadLoading.value = false
			let errArr = files.value.filter(ele => ele.status == 'error')  
			if(errArr.length > 0) {
				let content = `当前传输列表共计${files.value.length}个文件，其中${errArr.length}个文件发生上传错误。`
				if(files.value.length > errArr.length) {
					content += '是否移除错误文件？'
				}
				uni.showModal({
					title: '上传提示',
					content: content, 
					success: (r) => {
						if (r.confirm) {
							if(files.value.length > errArr.length) {
								files.value = files.value.filter(ele => ele.status == 'success') 
								biji_files.value = files.value
							} 
							console.log('用户点击确定');
						} else if (r.cancel) {
							console.log('用户点击取消'); 
						}
					}
				}); 
			}
			else {
				biji_step.value = true
				biji_files.value = files.value
			}
			 
			
			
	
		}else {
			uni.showToast({
				title:'请稍后重试',
				icon:'none'
			})
		}
	}
	function videoUploadEvent(fileItem) {
		// console.log(fileItem)
		return new Promise((resolve, reject) => { 
			$VodUploader.start({
				mediaFile: fileItem, //必填，把chooseVideo回调的参数(file)传进来
				getSignature: getSignature, //必填，获取签名的函数
				mediaName: '', //选填，名称，强烈推荐填写(如果不填，则默认为“来自微信小程序”)
				coverFile: coverFile.value, // 选填，封面
				// success: (result) => {
				// 	console.log('success');
				// 	console.log(result);
					
				// },
				error: (result) => {
					console.log('error');
					console.log(result);
					uni.showModal({
						title: '上传失败',
						content: JSON.stringify(result),
						showCancel: false
					});
					reject({result, status: 'error'})
				},
				progress: (result) => {
					console.log('progress');
					console.log(result);
					uni.showLoading({
						title: '上传中 ' + result.percent * 100 + '%'
					});
				},
				finish: (result) => {
					console.log('finish');
					console.log(result); 
					
					uni.hideLoading();	
					resolve({result, status: 'success'})
				}
			});
		})
		
	} 
	function getSignature (callback) {
		// console.log(22)
		$api.get_vod_sign()
		.then(res => {
			console.log(res)
			if (res.code == 1) {
				callback(res.list);
			} else {
				return '获取签名失败';
			}
		}).catch(err => {
			console.log(err)
		})
	} 
	
	return {
		files,
		getSignature,
		startUpload,
		chooseMedia,
		uploadLoading
	}
}
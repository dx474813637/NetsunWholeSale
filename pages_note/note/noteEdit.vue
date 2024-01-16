<template>
	<view class="w u-p-20"> 
		<template v-if="step == 1">
			<view class="step-one box-border u-flex-column u-flex-between">
				<view class="swiper-w box-border u-flex-1">
					<view class="error-w u-flex u-flex-items-center u-flex-center text-white box-border u-p-20" 
						v-if="biji_files[swiperCurrent].status == 'error'" 
					>
						<view class="u-p-20 u-radius-40 u-font-28 u-flex u-flex-items-center" style="background-color: #5f595a;">
							<u-icon name="error-circle" color="#fff" size="16"></u-icon>
							<view class="u-m-l-20">{{biji_files[swiperCurrent].message}}</view>
						</view>
					</view>
					<u-swiper
						:list="swiperlist"
						height="100%"
						keyName="tempFilePath"
						:current="swiperCurrent"
						:autoplay="false"
						imgMode="aspectFit"
						bgColor="#222"
						indicator
						:indicatorActiveColor="themeColor"
						indicatorMode="dot" 
						@change="swiperChange"
					></u-swiper>
				</view>
				<view class="u-p-20 box-border">
					<u-scroll-list :indicator="false">
						<view v-for="(item, index) in swiperlist" class="preview-pic-w" :key="index">
							<view class="item u-m-r-20 u-radius-5" 
								:class="{
									success: item.status == 'success',
									error: item.status == 'error',
									active: index == swiperCurrent,
								}" 
							>
								<view class="u-radius-5" @click="previewClick(index)">
									<up-image
										width="50px"
										height="50px"
										mode="aspectFit"
										:src="item.fileType == 'video' ? item.thumbTempFilePath : item.tempFilePath "
										radius="5"
									>
									</up-image>
									<view class="video-icon" v-if="item.fileType == 'video'">
										<u-icon name="play-right-fill" color="#fff" size="14"></u-icon>
									</view>
									<view class="success-w u-flex u-flex-items-center u-flex-center" >
										<u-icon name="checkmark-circle-fill" color="#00aa7f" size="18"></u-icon>
									</view>
									<view class="error-w u-flex u-flex-items-center u-flex-center" >
										<u-icon name="error-circle-fill" color="#FF2442" size="18"></u-icon>
									</view>
								</view> 
							</view>
							
						</view>
					</u-scroll-list>
				</view>
				<view class="u-flex u-flex-items-center u-flex-between u-p-15">
					<view class="item">
						<u-button 
							:customStyle="{background: '#FF2442'}" 
							shape="circle" 
							type="error"  
							@click="deleteBtn"
							:disabled="uploadLoading"
							v-if="biji_files.length > 1"
						>
							<view class="u-flex u-flex-items-baseline">
								<view class="u-m-r-10">移除当前文件</view>
								<u-icon name="trash" color="#fff" size="14"></u-icon>
							</view>
						</u-button>
					</view>
					<view class="item">
						<u-button 
							:customStyle="{background: '#FF2442'}" 
							shape="circle" 
							type="error"
							:loading="uploadLoading"
							loadingText="提交媒体文件中"
							@click="submitFilesBtn"
						>
							<view class="u-flex u-flex-items-baseline">
								<view class="u-m-r-10">上传文件并编辑文案</view>
								<u-icon name="arrow-rightward" color="#fff" size="14"></u-icon>
							</view>
						</u-button>
					</view>
				</view>
				<u-safe-bottom></u-safe-bottom>
			</view>
			
			
		</template>
		
		<template v-if="success == 1">
			<view  class="u-p-20 u-p-l-40 bg-white u-radius-10 u-flex-column u-flex-items-center u-flex-center">
				<view class="u-m-t-40 u-m-b-40">
					<u-icon name="checkmark-circle-fill" color="#F12E24" size="50"></u-icon>
				</view>
				<view class="u-font-34 u-m-b-40">发布成功</view>
			</view>  
		</template>  
		<template v-else>
			<view class="text-base u-font-28 u-p-20">
				已上传文件
			</view>
			<view class="u-p-l-20 u-p-t-20 u-p-r-20 box-border bg-white u-radius-10 u-m-b-20">
				<u-scroll-list :indicator="false">
					<view v-for="(item, index) in swiperlist" class="preview-pic-w" :key="index">
						<view class="item u-m-r-20 u-radius-5" >
							<view class="u-radius-5" >
								<up-image
									width="50px"
									height="50px"
									mode="aspectFit"
									:src="item.fileType == 'video' ? item.thumbTempFilePath : item.tempFilePath "
									radius="5"
								>
								</up-image>
								<view class="video-icon" v-if="item.fileType == 'video'">
									<u-icon name="play-right-fill" color="#fff" size="14"></u-icon>
								</view> 
							</view> 
						</view>
						
					</view>
				</u-scroll-list>
			</view>
			<view class="u-p-20 bg-white u-p-l-40 u-radius-10">
				<u--form
					labelPosition="top" 
					:model="model" 
					:rules="rules" 
					ref="uForm"
					labelWidth="100%"
					:borderBottom="false"
					:labelStyle="{color: '#7c88a0', fontSize: '30rpx', lineHeight: '18px'}"
					>
					<u-form-item
					 	:borderBottom="false"
					 	label="笔记" 
					 	prop="info"  
					 	ref="info"
					 	required 
					 	>
						<view class="editor-wrapper">
							<editor 
								id="editor" 
								class="ql-container" 
								placeholder="开始输入..." 
								show-img-size 
								show-img-toolbar
								show-img-resize 
								@statuschange="onStatusChange"  
								@ready="onEditorReady"
								@blur="blur"
							>
							</editor>
						</view>
					</u-form-item>
					
					<!-- <u-form-item
					 	:borderBottom="false"
					 	label="笔记" 
					 	prop="info"  
					 	ref="info"
					 	required 
					 	>  
						<u--textarea 
							v-model="model.info" 
							placeholder="请输入笔记（文案）"  
							:customStyle="{border: 'none'}"
							height="350"
							maxlength="500"
						></u--textarea>
					</u-form-item> --> 
				</u--form>
			</view>
		</template>
		
		 
	</view>
	<u-safe-bottom></u-safe-bottom>
	<TabBar >
		<view class="pan-tabbar u-flex u-flex-items-center u-flex-around " style="height: 100%;"> 
			<view class="item-btn  u-flex u-flex-items-center u-flex-center u-flex-1 u-p-10 u-p-l-20 u-p-r-20">
				<u-button type="error" shape="circle" @click="submit" :disabled="success == 1">{{config.submitBtnText}}</u-button>
	
			</view>
		</view>
	
	</TabBar> 
</template>
  
<script setup>
	import zeroLazyLoad from '@/uni_modules/zero-lazy-load/components/zero-lazy-load/zero-lazy-load.vue'
	import { share } from '@/composition/share.js'
	import useDataList from '@/composition/useDataList.js' 
	import useUploadMedia from '@/composition/useUploadMedia.js'
	import {useCateStore, baseStore} from '@/stores/base.js'  
	import {userStore} from '@/stores/user.js' 
	const user = userStore() 
	const { biji_files, biji_step, biji_info, biji_linshi  } = toRefs(user)
	const base = baseStore() 
	const {themeColor, empty} = toRefs(base)
	const { setOnlineControl } = share()
	const $api = inject('$api')
	const $http = inject('$http') 
	const id = ref('') 
	const model = ref({
		info: '',
		pic: ''
	})  
	const fileLists = reactive({
		pic: [] 
	});
	const swiperCurrent = ref(0)
	const swiperlist = ref([])
	const step = ref(1)
	const fileName = ref('')
	const coverFile = ref({tempFilePaths:[]})
	const success = ref(0)
	const uForm = ref('') 
	const uToast = ref('') 
	const mode = ref(1)
	const videoLoading = ref(false)
	const videoFile = ref({})
	const editorCtx = ref('')
	const formats = ref({})
	const modeTabs = ref([
		{
			name: '图片',
			disabled: false,
			value: 1,
		},
		{
			name: '视频',
			disabled: false,
			value: 2,
		}
	]) 
	const config = computed(() => {
		let func = 'add_product_longs';
		let submitBtnText = '确认发布';
		let params = {...model.value, id: id.value };  
		return {
			func,
			submitBtnText,
			params
		}
	}) 
	const {
		files, 
		uploadLoading,
		startUpload 
	} = useUploadMedia()
	const loading = ref(false)
	const rules = {
		info: {
			required: true,
			message: '请输入中字',
			trigger: ['blur', 'change']
		},
	}
	watch(
		() => biji_files.value,
		(n) => {
			console.log(n)
			swiperlist.value = n
		},
		{
			deep: true,
			immediate: true
		}
	)
	watch(
		() => biji_step.value,
		(n) => {
			if(n) { 
				step.value = 2
				model.value.pic = biji_files.value.map(ele => ele.url).join('|')
			}
		},
		{
			immediate: true
		}
	) 
	onLoad(async (options) => { 
		if (options.hasOwnProperty('id')) {
			id.value = options.id
		}    
		// console.log(biji_files.value)
		// await initDataList()  
	}) 
	const blur = (e) => {
		console.log(e)
		if(containsChinese(e.detail.html)) {
			model.value.info = e.detail.html
		}
		else {
			model.value.info = ''
		}
		uForm.value.validateField('info')
	}
	function containsChinese(str) {
		var pattern = /[\u4e00-\u9fa5]/;
		return pattern.test(str);
	}
	function onEditorReady() {
		// #ifdef MP-BAIDU
		editorCtx.value = requireDynamicLib('editorLib').createEditorContext('editor');
		// #endif

		// #ifdef APP-PLUS || MP-WEIXIN || H5
		uni.createSelectorQuery().select('#editor').context((res) => {
			editorCtx.value = res.context
		}).exec()
		// #endif
	}
	function onStatusChange(e) {
		const formats = e.detail
		formats.value = formats
	}
	function backHandler() {
		if(biji_step.value) {
			uni.showModal({
				title: '退出提示',
				content: `是否临时保存草稿箱`, 
				success: (r) => {
					if (r.confirm) {
						console.log('用户点击确定');
						biji_files.value = files.value
						biji_info.value = model.info
						biji_linshi.value = true 
					} else if (r.cancel) {
						console.log('用户点击取消'); 
					}
				}
			}); 
		} 
		return true
	} 
	function submitFilesBtn() {
		startUpload()
	}
	function swiperChange(item) { 
		swiperCurrent.value = item.current
	}
	function previewClick(index) {
		swiperCurrent.value = index
	}
	function deletePic(event) {
		fileLists[event.name].splice(event.index, 1) 
	} 
	function handleoversize(mb) {
		uni.showToast({
			title: `建议上传${mb}M以内的图片`,
			icon: 'none'
		})
	}
	function submit() {
		uni.showModal({
			title: '提示',
			content: `是否发布`, 
			success: (r) => {
				if (r.confirm) {
					console.log('用户点击确定'); 
					uForm.value.validate().then(async () => {
						loading.value = true;
						uni.showLoading()
						try{
							const res = await $api[config.value.func]({...config.value.params});
							if(res.code == 1) { 
								uni.$emit('list_refresh')
								uni.showToast({
									title: res.msg,
									icon: 'success'
								})    
								success.value = 1 
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							}
						}catch(e){
							//TODO handle the exception
						}
						loading.value = false;
						
					}).catch(errors => {
						console.log(errors)
						uni.$u.toast('请检查表单')
					}) 
				} else if (r.cancel) {
					console.log('用户点击取消'); 
				}
			}
		}); 
		
	} 
	function deleteBtn() {
		biji_files.value.splice(swiperCurrent.value, 1)
	}
</script>

<style lang="scss">
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
<style lang="scss" scoped>
	.editor-wrapper {
		height: 400px;
		background: #fff;
	}
	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 30vh;
		height: 100%;
		margin-top: 20px;
		font-size: 16px;
		line-height: 1.5;
	}
	.step-one {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 200;
		background-color: #222;
		.swiper-w {
			// height: 100%;
			position: relative;
			.error-w {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 20%; 
				width: 100%;
				z-index: 50;
			}
		}
	}
	.preview-pic-w {
		.item {
			border: 2px solid #eee;
			position: relative;
			&.active {
				border-color: #FF2442!important;
			} 
			&.success {
				border-color: #00aa7f;
				.success-w {
					display: flex;
					background-color: rgba(0, 168, 126, .15);
				}
			}
			&.error {
				border-color: #ffaa00;
				.error-w {
					display: flex;
					background-color: rgba(255, 170, 32, 0.1);
				}
			}
			.video-icon {
				position: absolute;
				right: 5%;
				bottom: 5%;
				// transform: translate(-50%, -50%);
			}
			.success-w,
			.error-w, {
				display: none;
				position: absolute;
				z-index: 50; 
				top: 0;
				left: 0;
				width: 100%; 
				height: 100%;
			}
		}
	}
	.w {
		padding-bottom: 60px;
	}
</style>

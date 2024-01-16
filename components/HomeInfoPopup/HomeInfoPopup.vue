<template>
	<view>
		<PopupNormal v-bind="$attrs" > 
			<view class="list-w bg-white">   
				<scroll-view class="main-list  u-p-30" scroll-y > 
					<u--form
						labelPosition="top" 
						:model="model"  
						ref="uForm"
						labelWidth="100%"
						:borderBottom="false"
						:labelStyle="{
							color: '#7c88a0', 
							fontSize: '36rpx',  
							fontWeight: 'bold'
						}"
						> 
						<u-form-item
							:borderBottom="false"
							label="特卖店名称" 
							prop="name"  
							ref="name"
							required 
							> 
							<up-input
								v-model="model.name" 
								placeholder="特卖店名称"
								clearable 
							></up-input>  
						</u-form-item> 
						<u-form-item
							:borderBottom="false"
							label="特卖店头像(大小不要超出2MB)" 
							prop="img"  
							ref="img" 
							> 
							<u-upload
								:fileList="fileLists.img"
								@afterRead="afterRead"
								@delete="deletePic"
								name="img" 
								:maxCount="1"
								:maxSize="2048000"
								@oversize="handleoversize"
							></u-upload>
						</u-form-item>
						<u-form-item
							:borderBottom="false"
							label="简介" 
							prop="info"  
							ref="info" 
							> 
							<u--textarea
								v-model="model.info" 
								placeholder="简介"
								 clearable 
							></u--textarea>  
						</u-form-item>  
						<u-form-item
							:borderBottom="false"
							label="特卖店背景(大小不要超出2MB)" 
							prop="bg"  
							ref="bg" 
							> 
							<u-upload
								:fileList="fileLists.bg"
								@afterRead="afterRead"
								@delete="deletePic"
								name="bg" 
								:maxCount="1"
								:maxSize="2048000"
								@oversize="handleoversize"
							></u-upload>
						</u-form-item>
					</u--form> 
				</scroll-view> 
			</view>  
			<template #footer>
				<view class="u-p-20">
					<u-button type="error" shape="circle" @click="submit">提交</u-button>
				</view>
			</template>
		</PopupNormal>
	</view>  
</template>

<script setup>
	import { onLoad, onReady } from "@dcloudio/uni-app";
	import {
		ref,
		toRefs,
		inject,
		computed,
		onMounted,
		reactive, 
		watch,
		useAttrs,
		nextTick
	} from 'vue' 
	const attrs = useAttrs()
	const $api = inject('$api')
	import { baseStore } from '@/stores/base'
	const base = baseStore();
	const { themeColor, configBaseURL, configHeader } = toRefs(base)
	import { userStore } from '@/stores/user'
	const user = userStore();
	const { user_info } = toRefs(user)
	const props = defineProps({  
		homeInfo: {
			type: Object,
			default: () => {
				return {}
			},
		}
	})    
	const emits = defineEmits(['submit']) 
	const model = ref({ 
		name: '', 
		info: '',
		img: '', 
		bg: '', 
	})
	const uForm = ref(null)
	const fileLists = reactive({
		img: [],
		bg: []
	});
	const rules = {
		name: {
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},   
	}
	onMounted(async () => {  
	})    
	onReady(() => {
		
	}) 
	watch(
		() => attrs.show,
		(n) => { 
			if(n) {
				initForm()
				setTimeout(() => {
					uForm.value.setRules(rules)
				}, 100)
			}
		}
	)
	watch(
		() => props.homeInfo,
		(homeInfo) => {  
			initForm()
		},
		{
			deep: true
		}
	)
	function initForm() {
		let homeInfo = props.homeInfo
		model.value.name = homeInfo.name
		model.value.info = homeInfo.info 
		if(homeInfo.img) {
			model.value.img = homeInfo.img
			fileLists.img = [{url: homeInfo.img}]
		}
		if(homeInfo.bg) {
			model.value.bg = homeInfo.bg
			fileLists.bg = [{url: homeInfo.bg}]
		}
	}
	function previewImage(index, imgs) {
   		uni.previewImage({
   			urls: imgs,
   			current: index, 
   			loop: true
   		})
   	}
	function submit() { 
		uForm.value.validate().then(async () => { 
			emits('submit', {...model.value})
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('请检查表单')
		})  
	}
	// 新增图片
	async function afterRead(event) {
		// console.log(event)
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		let lists = [].concat(event.file)
		let obj = fileLists[event.name]
		let fileListLen = obj.length
		lists.map((item, index) => {
			obj.push({
				...item,
				status: 'uploading',
				message: '上传中'
			})
		})
		console.log(lists)
		for (let i = 0; i < obj.length; i++) {
			let item = obj[i]
			console.log(item) 
			const result = await base.uploadFilePromise(item.thumb)  
			if(result.code == 1) {
				obj.splice(i, 1, Object.assign(item, {
					status: 'success',
					message: '',
					url: result.list[0],
					name: result.list[0]
				}))  
			}
			else {
				obj.splice(i, 1)  
				uni.showToast({
					title: result.msg,
					icon: 'none'
				})
			}
			
			
			
		}
		model.value[event.name]= fileLists[event.name].map(ele => ele.url).join('|')
	}  
	function deletePic(event) {
		fileLists[event.name].splice(event.index, 1) 
		model.value[event.name] = ''
	} 
	function handleoversize() {
		uni.showToast({
			title: '建议上传2M以内的图片',
			icon: 'none'
		})
	} 
</script>

<style lang="scss" scoped>
	.list-w {
		height: 70vh;
		// background-color: #f2f2f2;
		position: relative;
		.load-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 20;
			background-color: rgba(255,255,255,.6);
		}
		.list-item {
			position: relative;
			z-index: 10;
			height: 100%;
			&.item-left {
				flex: 0 0 35%;
				background-color: #f8f8f8;
			}
		}
	}
	.nav-item {
		color: #666; 
		&.active-nav {
			background-color: #f2f2f2;
			color: $u-primary; 
		}
	}
	.main-list {
		height: 100%;
		box-sizing: border-box;
	}
	.item-card { 
		background-color: #e8e8e8;
		box-sizing: border-box;  
		margin-bottom: 10px; 
		padding: 10px;
		color: #666;
		border-radius: 5px;
		border: 1rpx solid #e8e8e8;
		&.active {
			background-color: $u-primary-light;
			color: $u-primary;
			border-color: $u-primary;
		}
	}
	.service-card {
		box-sizing: border-box;
		width: 100%;
	}
</style>
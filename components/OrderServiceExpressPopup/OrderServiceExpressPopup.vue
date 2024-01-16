<template>
	<view>
		<PopupNormal v-bind="$attrs" > 
			<view class="list-w bg-white">   
				<scroll-view class="main-list  u-p-30" scroll-y > 
					<view v-if="info">
						<u-parse :content="info"></u-parse>
					</view>
					
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
							label="提交快递单号" 
							prop="express"  
							ref="express"
							required 
							> 
							<u-input
								v-model="model.express" 
								placeholder="提交快递单号" 
							></u-input>  
						</u-form-item>  
					</u--form> 
				</scroll-view> 
			</view>  
			<template #footer>
				<view class="u-p-20">
					<u-button type="error" shape="circle" @click="serviceBtn">提交</u-button>
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
		info: {
			type: String,
			default: '',
		}, 
		list: {
			type: Array,
			default: () => {
				return []
			},
		}
	})    
	const emits = defineEmits(['submitExpress'])
	const serviceFormShow = ref(false)   
	const model = ref({ 
		express: '', 
	})
	const uForm = ref(null) 
	const rules = {
		express: {
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},   
	}
	onMounted(async () => {  
	})  
	watch(
		() => serviceFormShow.value,
		(n) => {
			if(n) {
				setTimeout(() => {
					uForm.value.setRules(rules)
				}, 100)
				// nextTick(() => {
				// 	uForm.value.setRules(rules)
				// })
				
			}
		}
	) 
	watch(
		() => attrs.show,
		(n) => { 
			serviceFormShow.value = n
		}
	)
	onReady(() => {
		
	})     
	function serviceBtn() { 
		uForm.value.validate().then(async () => { 
			emits('submitExpress', {params: {...model.value}})
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('请检查表单')
		})  
	} 
</script>

<style lang="scss" scoped>
	.list-w {
		height: 40vh;
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
<template>
	<view class="u-p-30 bg " style="padding-bottom: 60px!important;">
		
		<view  class="u-p-20 u-p-l-40 bg-white u-radius-5">
			  
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
				 	label="团标题（团名）" 
				 	prop="title"  
				 	ref="title"
				 	required 
				 	> 
				 	<up-input 
				 		v-model="model.title"
				 		placeholder="团标题（团名）"
				 		></up-input> 
				</u-form-item>   
				<u-form-item
				 	:borderBottom="false"
				 	label="团说明" 
				 	prop="info"  
				 	ref="info"
				 	required 
				 	> 
					<u--textarea 
						v-model="model.info" 
						placeholder="团说明" 
					></u--textarea> 
				</u-form-item>    
				<u-form-item
				 	:borderBottom="false"
				 	label="达人分成比例(%)" 
				 	prop="divide"  
				 	ref="divide"
				 	required 
				 	> 
				 	<up-input 
				 		v-model="model.divide"
				 		placeholder="达人分成比例(%)"
						readonly 
				 		></up-input> 
					<!-- <slider :value="model.divide" activeColor="#F12E24" @changing="lokk" showValue  /> -->
				</u-form-item>  
				<view v-if="list.divide_info">
					<u-parse :content="list.divide_info"></u-parse>
				</view>
			</u--form> 
			
		</view>
		<view class="u-p-t-30 u-p-b-30">
			<view class="u-flex u-flex-items-center u-flex-center">
				<view class="item u-flex-1">
					<u-button type="error" @click="submit" throttleTime="500" >{{config.submitBtnText}}</u-button>
				</view> 
			</view>
			<view class="u-flex u-flex-items-center u-flex-center u-m-t-40">
				<u-icon name="checkmark-circle" size="15" color="#aaa"></u-icon>
				<view class="text-light u-font-28 u-m-l-20">信息安全保障中</view>
			</view>
		</view>   
	</view>
	
	<u-safe-bottom></u-safe-bottom>
	<MenusBar mode="2"></MenusBar>
</template>
<script setup>
	import { onLoad, onReady, onShareTimeline, onShareAppMessage, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch } from 'vue' 
	import { baseStore } from '@/stores/base'
	import {userStore} from '@/stores/user' 
	const user = userStore()
	const base = baseStore()  
	
	const $api = inject('$api')    
	const config = computed(() => {
		let func = 'tuan_add';
		let submitBtnText = '提交';
		let params = {...model.value };  
		return {
			func,
			submitBtnText,
			params
		}
	}) 
	const uForm = ref() 
	const type = ref('add') 
	const list = ref({}) 
	const model = ref({ 
		title: '', 
		info: '',
		divide: 80, 
	}) 
	const rules = {
		title: {
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},  
		info: {
			required: true,
			message: '公司不能为空',
			trigger: ['blur', 'change']
		},   
	}
  
	onLoad(async(options) => {
		if(options?.type) {
			type.value = options.type
		}
		if(type.value == 'edit') {
			uni.showLoading()
			await getData()
		}
	})
	onReady(() => {
		uForm.value.setRules(rules)
	})     
	function submit() {
		uForm.value.validate().then(async () => {  
			uni.showLoading()
			const res = await $api[config.value.func]({...config.value.params});  
			if(res.code == 1) { 
				uni.showToast({
					title: res.msg,
					icon: 'success'
				})  
				uni.$emit('updateData')
				setTimeout(() => {
					uni.navigateBack()
				}, 800)
			}
			
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('请检查表单')
		}) 
	}   
	async function getData() {
		const res = await $api.tuan_detail()
		if(res.code == 1 ) { 
			list.value = uni.$u.deepClone(res.list)
			res.list.divide_info = ''
			model.value = res.list
		}
	} 
	function lokk(v) {  
		model.value.divide = v.detail.value
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
	.bg {
		min-height: 100vh;
		background-image: linear-gradient(to bottom, #e6f2fe, #f6f6f6);
	}
	.select-w {
		position: relative;
	}
	.load-w {
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255,255,255,.2);
		
	}
</style>
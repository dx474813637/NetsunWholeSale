<template>
	<view class="u-p-30 bg " style="padding-bottom: 60px!important;">
		
		<template v-if="success == 1">
			<view  class="u-p-20 u-p-l-40 bg-white u-radius-5 u-flex-column u-flex-items-center u-flex-center">
				<view class="u-m-t-40 u-m-b-40">
					<u-icon name="checkmark-circle-fill" color="#F12E24" size="50"></u-icon>
				</view>
				<view class="u-font-34 u-m-b-40">提交成功</view>
			</view>
			<view class="u-p-t-30 u-p-b-30">
				<view class="u-flex u-flex-items-center u-flex-center">
					<view class="item u-flex-1">
						<u-button type="error" @click="success = 0" >返回填写</u-button>
					</view> 
				</view>   
			</view>   
		</template>  
		<template v-else>
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
					  	label="姓名" 
					  	prop="name"  
					  	ref="name"
					  	required 
					  	> 
					  	<up-input 
					  		v-model="model.name"
					  		placeholder="姓名"
							clearable 
					  		></up-input> 
					 </u-form-item> 
					<u-form-item
					 	:borderBottom="false"
					 	label="手机号" 
					 	prop="tel"  
					 	ref="tel"
					 	required 
					 	> 
					 	<up-input 
					 		v-model="model.tel"
					 		placeholder="手机号"
							clearable 
					 		></up-input> 
					</u-form-item> 
					<u-form-item
					 	:borderBottom="false"
					 	label="单位名称" 
					 	prop="company"  
					 	ref="company"
					 	required 
					 	> 
					 	<up-input 
					 		v-model="model.company"
					 		placeholder="单位名称"
							clearable 
					 		></up-input> 
					</u-form-item> 
					<u-form-item
					 	:borderBottom="false"
					 	label="网盛对接人" 
					 	prop="person"  
					 	ref="person"
					 	required 
					 	> 
					 	<up-input 
					 		v-model="model.person"
					 		placeholder="网盛对接人"
							clearable 
					 		></up-input> 
					</u-form-item>    
				</u--form> 
				
			</view>
			<view class="u-p-t-30 u-p-b-30">
				<view class="u-flex u-flex-items-center u-flex-center">
					<view class="item u-flex-1">
						<u-button type="error" @click="submit" :loading="loading" throttleTime="500">{{config.submitBtnText}}</u-button>
					</view> 
				</view> 
				<view class="u-flex u-flex-items-center u-flex-center u-m-t-40">
					<u-icon name="checkmark-circle" size="15" color="#aaa"></u-icon>
					<view class="text-light u-font-28 u-m-l-20">信息安全保障中</view>
				</view>
			</view>   
		</template>
		
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
		let func = 'selection';
		let submitBtnText = '提交';
		let params = {...model.value };  
		return {
			func,
			submitBtnText,
			params
		}
	}) 
	const loading = ref(false)
	const success = ref(0)
	const uForm = ref()  
	const model = ref({ 
		name: '', 
		tel: '',
		company: '', 
		person: '', 
	}) 
	const rules = {
		name: {
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},  
		tel: {
			validator: (rule, value, callback) => { 
				return uni.$u.test.mobile(value);
			},
			message: '输入正确的手机号码', 
			trigger: ['change','blur'],
		},   
		company: {
			required: true,
			message: '公司不能为空',
			trigger: ['blur', 'change']
		},   
		person: {
			required: true,
			message: '公司不能为空',
			trigger: ['blur', 'change']
		},   
	}
  
	onLoad(async(options) => { 
	})
	onReady(() => {
		uForm.value.setRules(rules)
	})     
	function submit() {
		uForm.value.validate().then(async () => {  
			loading.value = true;
			uni.showLoading()
			try{
				const res = await $api[config.value.func]({params: {...config.value.params}});
				if(res.code == 1) { 
					uni.showToast({
						title: res.msg,
						icon: 'success'
					})   
					success.value = 1
				}
			}catch(e){
				//TODO handle the exception
			}
			loading.value = false;
			
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('请检查表单')
		}) 
	}   
	function reset() {
		uForm.value.resetFields()
	}
	// async function getData() {
	// 	const res = await $api.tuan_detail()
	// 	if(res.code == 1 ) { 
	// 		list.value = uni.$u.deepClone(res.list)
	// 		res.list.divide_info = ''
	// 		model.value = res.list
	// 	}
	// } 
	// function lokk(v) {  
	// 	model.value.divide = v.detail.value
	// }
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
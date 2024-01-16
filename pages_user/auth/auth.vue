<template>
	<view class="u-p-30 bg box-border" style="padding-bottom: 60px!important;">
		
		<template v-if="success == 1">
			<view  class="u-p-20 u-p-l-40 bg-white u-radius-10 u-flex-column u-flex-items-center u-flex-center">
				<view class="u-m-t-40 u-m-b-40">
					<u-icon name="checkmark-circle-fill" color="#F12E24" size="50"></u-icon>
				</view>
				<view class="u-font-34 u-m-b-40">提交成功</view>
			</view>
			<view class="u-p-t-30 u-p-b-30">
				<view class="u-flex u-flex-items-center u-flex-center">
					<view class="item u-flex-1">
						<u-button type="error" @click="success = 0" >返回</u-button>
					</view> 
				</view>   
			</view>   
		</template>  
		<template v-else>
			<view class="u-flex u-flex-between u-flex-items-center text-base u-p-10 u-font-28 u-m-b-20" v-if="origin.id">
				<view class="item">最近提交：{{origin.uptime}}</view>
				<view class="item">
					<template v-if="origin.zt == 1">待认证签约</template>
					<template v-if="origin.zt == 2">认证成功</template>
					<template v-if="origin.zt == 3">签约成功</template>
				</view>
			</view>
			<view  class="u-p-20 u-p-l-40 bg-white u-radius-10">
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
							:disabled="!isEdit"
						></up-input>  
					</u-form-item> 
					<u-form-item
						:borderBottom="false"
						:label="onlineConfig.id_card" 
						prop="id_card"  
						ref="id_card" 
						required 
						v-if="sh != 1"
						> 
						<template v-if="isEdit">
							<up-input
								v-model="model.id_card" 
								placeholder="身份证号码"
								clearable  
							></up-input> 
						</template>
						<template v-else>
							<view class="u-radius-5 u-border u-p-20" style="background-color: #F5F7FA;">
								<up-text :text="model.id_card" format="encrypt" mode="phone"></up-text>
							</view>
						</template> 
					</u-form-item>  
					<u-form-item
						:borderBottom="false"
						label="手机" 
						prop="phone"  
						ref="phone" 
						required 
						>  
						<up-input
							v-model="model.phone" 
							placeholder="手机"
							clearable 
							:disabled="!isEdit"
						></up-input> 
					</u-form-item>  
					<!-- <template v-if="auth_url">
						<u-form-item
							:borderBottom="false"
							label="跳转链接"  
							> 
							<view class="u-flex u-flex-between">
								<view class=" u-flex-1 u-radius-5 u-p-10 u-border page-bg2">
									<view class="u-line-1">{{auth_url}}</view>
								</view>
								<view class="u-m-l-15"><u-button type="primary" plain size="small" shape="circle">复制</u-button></view>
							</view>
						</u-form-item> 
					</template> -->
					<template v-if="sh != 1">
						<u-form-item
							:borderBottom="false"
							:label="onlineConfig.bank_account" 
							prop="bank_account"  
							ref="bank_account" 
							required 
							> 
							<up-input
								v-model="model.bank_account" 
								:placeholder="onlineConfig.bank_account"
								clearable 
								:disabled="!isEdit"
							></up-input> 
						</u-form-item> 
						
					</template>
					   
				</u--form> 
				
			</view>
			<view class="u-p-t-30 u-p-b-30">
				<view class="u-flex u-flex-items-center u-flex-center u-m-b-30" v-if="!disabled">
					<view class="item u-flex-1">
						<u-button :type="isEdit ? 'error' : 'primary'" @click="submit" :loading="loading" throttleTime="500">{{config.submitBtnText}}</u-button>
					</view> 
				</view> 
				<view class="u-flex u-flex-items-center u-flex-center" v-if="origin.zt == 1 || origin.zt == 2">
					<view class="item u-flex-1">
						<u-button type="error" @click="rzShow = true" >认证签约</u-button>
					</view> 
				</view> 
				<view class="u-flex u-flex-items-center u-flex-center u-m-t-40">
					<u-icon name="checkmark-circle" size="15" color="#aaa"></u-icon>
					<view class="text-light u-font-28 u-m-l-20">信息安全保障中</view>
				</view>
			</view>   
		</template>
		
	</view>
	<u-popup 
		:show="rzShow" 
		mode="center" 
		@close="rzShow = false" 
		round="10" 
		:safeAreaInsetBottom="false"
		>
		<view class="u-p-20 box-border" style="width: 65vw;"> 
			<view style="min-height: 100px;">
				<u-parse :content="auth_info"></u-parse> 
			</view>
			
			<u-button type="primary" shape="circle" @click="copy" v-if="auth_url">复制链接</u-button>
		</view>
	</u-popup>
	<u-safe-bottom></u-safe-bottom>
	<MenusBar ></MenusBar>
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
		let func = 'save_linghuo';
		let submitBtnText = isEdit.value ? '提交表单' : '我要修改';
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
	const origin = ref({})
	const model = ref({ 
		name: '',
		id_card: '',
		phone: '',
		bank_account: '',
	}) 
	const auth_url = ref('')
	const auth_info = ref('')
	const sh = ref(0)
	const zt = ref('')
	const onlineConfig = ref({})
	const isEdit = ref(true)
	const rzShow = ref(false)
	const disabled = computed(() => {
		return origin.value.zt > 1
	}) 
	const rules = {
		name: {
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},   
		id_card: {
			validator: (rule, value, callback) => uni.$u.test.idCard(value) ,
			message: '号码不正确',
			trigger: ['blur', 'change']
		},   
		phone: {
			validator: (rule, value, callback) => uni.$u.test.mobile(value),
			message: '手机号码不正确',
			trigger: ['blur', 'change']
		},   
		bank_account: {
			required: true,
			message: '不能为空',
			trigger: ['blur', 'change']
		},   
	}
	onLoad(async(options) => { 
		uni.showLoading()
		await getData()
	})
	watch(
		() => zt.value,
		(n) => {
			if(n >= 1 && model.value.name) {
				isEdit.value = false
			}
		}
	)
	onReady(() => {
		uForm.value.setRules(rules)
	})     
	async function getData() {
		const res = await $api.linghuo();
		if(res.code == 1) { 
			zt.value = res.list?.zt || 0
			origin.value = res.list || {}
			sh.value = res.sh;
			onlineConfig.value = res.info
			auth_url.value = res.ewm
			auth_info.value = res.ewm_info
			initForm(res)
			if(res.sh != 1) {
				res.title && uni.setNavigationBarTitle({
					title: res.title
				})
			}
			
			// setOnlineControl(res)
		}
	}
	 
	function initForm(res) {  
		let data = res.list || {}
		model.value.name = data.name
		model.value.id_card = data.id_card 
		model.value.phone = data.phone 
		model.value.bank_account = data.bank_account  
	}
	function submit() {
		if(!isEdit.value) {
			isEdit.value = true
			return
		}
		uForm.value.validate().then(async () => {  
			loading.value = true;
			uni.showLoading()
			try{
				const res = await $api[config.value.func]({...config.value.params});
				if(res.code == 1) { 
					uni.showToast({
						title: res.msg,
						icon: 'success'
					})   
					getData()
					success.value = 1
					isEdit.value = false
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
	function copy() {
		uni.setClipboardData({
			data: auth_url.value,
			success() {
				uni.showToast({
					title: '复制网址成功，请在其他浏览器操作',
					icon: 'none'
				})
			}
		})
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
		min-height: 60vh;
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
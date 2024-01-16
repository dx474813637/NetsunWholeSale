<template>
	<view class="u-p-20">
		<view class="login-box u-radius-20 bg-white u-p-30 uni-shadow-sm">
			<view class="tabs-w u-p-l-80 u-p-r-80">
				<u-tabs
					:list="login_mode_list"  
					lineWidth="0"
					:scrollable="false"
					:current="login_mode_current" 
					:activeStyle="{
						color: themeColor,
						fontWeight: 'bold'
					}"
					@change="handleTabsChange"
				></u-tabs>	
			</view> 
			<view class="form-w u-p-l-30 u-p-r-30">
				<u--form
					labelPosition="left"
					:model="form" 
					ref="uForm"  
					labelWidth="60px"
					:labelStyle="{color: '#000'}"  
					:rules="rules"
					> 
					<u-form-item
						label="手机"
						prop="login"   
						required 
						>
						<u--input
							v-model="form.login" 
							placeholder="手机" 
							border="bottom"
							clearable
							suffixIcon="phone-fill"
							suffixIconStyle="color: #ccc;" 
						></u--input> 
					</u-form-item> 
					<u-form-item
						label="验证码"
						prop="code"   
						required 
						>
						<up-input 
							v-model="form.code" 
							placeholder="验证码" 
							clearable
							border="bottom"> 
							<template #suffix>
								<up-code
									ref="uCode"
									@change="codeChange"
									seconds="20"
									changeText="X秒重新获取"
								></up-code>
								<up-button
									@tap="getCode"
									:text="tips"
									type="warning"
									size="small"
								></up-button>
							</template> 
						</up-input>
					</u-form-item> 
					<u-form-item
						label=""
						prop="role"    
						labelWidth="0"
						>
						<u-radio-group
							v-model="radiovalue1"
							placement="row"
							@change="groupChange"
						  >
							<u-radio
							  :customStyle="{marginBottom: '8px', marginRight: '12px'}"
							  v-for="(item, index) in radiolist1"
							  :key="index"
							  :label="item.name"
							  :name="item.name"
							  @change="radioChange"
							>
							</u-radio>
						</u-radio-group>
					</u-form-item> 
					<view class="u-p-t-40 u-p-b-40 u-m-t-40">
						<u-button type="primary" shape="circle" @click="submit">登录</u-button>
					</view>
				</u--form>
			</view>
		</view>
		
	</view>
		<u-safe-bottom></u-safe-bottom>
		<MenusBar mode='2'></MenusBar>
</template>

<script setup>
	import { onLoad, onShareTimeline, onShareAppMessage } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted, nextTick } from 'vue'
	import { share } from '@/composition/share.js' 
	const { setOnlineControl } = share()
	const $api = inject('$api')
	
	import {userStore} from '@/stores/user.js'
	const user = userStore()
	import {useCartStore} from '@/stores/cart.js'
	const cart = useCartStore()
	const { cart_list, cart_list_num, cart_list_checked_num, cart_list_checked_price } = toRefs(cart)
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore() 
	const { home, roomList, themeColor } = toRefs(base)
	const cate = useCateStore()
	const { cate_list, cate_loading } = toRefs(cate)
	
	const tips = ref('')
	const uCode = ref()
	const uForm = ref()
	const login_mode_current = ref(0)
	const login_mode_list = ref([
		{
			name: '注册',
			disabled: false,
			value: 'code'
		},
		{
			name: '登录',
			disabled: false,
			value: 'tologin' 
		} 
	])
	const form = reactive({
		login: "", 
		code: "",
		role: ''
	})
	const radiolist1 = reactive(
		[
			{
				name: '供应商',
				disabled: false,
				value: '1'
			},
			{
				name: '主播/机构',
				disabled: false,
				value: '2'
			}, 
		]
	)
	const radiovalue1 = ref('')
	const params = computed(() => {
		let obj = { login: form.login };
		if(login_mode.value == 'pwd'){
			obj = {
				...obj,
				passwd: form.passwd,
			}
		}
		else if(login_mode.value == 'code') {
			obj = {
				...obj, 
				msgcode: form.code,
			}
		}
		return obj
	})
	const rules = computed(() => {
		let obj = {}
		if (login_mode.value == 'pwd') {
			obj = {
				...obj,
				login: [
					{
						required: true,
						message: '账号不得为空',
						trigger: ['change', 'blur'],
					}
				],
				passwd: [
					{
						required: true,
						message: '密码不得为空',
						trigger: ['change', 'blur'],
					}
				],
			} 
		}
		else {
			obj = {
				...obj,
				login: [
					{
						validator: (rule, value, callback) => { 
							return uni.$u.test.mobile(value);
						},
						message: '输入正确的手机号',
						trigger: ['change', 'blur'],
					}
				],
				code: [
					{
						required: true,
						message: '验证码不得为空',
						trigger: ['change', 'blur'],
					}
				],
				role: [
					{
						required: true,
						message: '请选择账户身份',
						trigger: ['change', 'blur'],
					}
				],
			}
		}
		nextTick(() => {
			if(uForm.value && uForm.value.setRules) {
				uForm.value.setRules(obj)
			} 
		})
		
		return obj
	})
	
	const login_mode = computed(() => {  
		return login_mode_list.value[login_mode_current.value].value
	})
	
	function groupChange(n) {
        console.log('groupChange', n);
		form.role = n 
		uForm.value.validateField('role')
    } 
    function radioChange(n) {
        console.log('radioChange', n);
    }
	function handleTabsChange(data) { 
		uForm.value.resetFields()
		login_mode_current.value = +data.index 
		if(login_mode.value == 'tologin') {
			base.handleGoto({
				url: '/pages/login/login',
				type: 'reLaunch'
			}) 
		}
	}
	function codeChange(text) {
        tips.value = text;
    }
	async function getCode() {
		if(!uni.$u.test.mobile(form.login)) {
			uForm.value.validateField('login')
			return
		} 
        if (uCode.value.canGetCode) {
			  // 模拟向后端请求验证码
			uni.showLoading({
				title: '正在获取验证码'
			}) 
			const res = await $api.msgcode({params: {login: form.login}}) 
			if(res.code == 1) {
				uCode.value.start();
			}
			uni.$u.toast(res.msg);
			
			
        } else {
			uni.$u.toast('倒计时结束后再发送');
        }
    } 
	
	function submit() {
		uForm.value.validate().then(async () => {
			const res = await $api.syblogin({params: params.value})
			if(res.code == 1) {
				uni.$u.toast(res.msg);
				uni.showLoading()
				const new_user = await user.refreshToken()
				user.saveUserInfo(new_user)
				let prePage = base.noTokenNeedPermissionRoute
				if(prePage) {
					uni.showLoading()
					try{
						await user.getMallUserInfo()
					}catch(e){
						//TODO handle the exception
					} 
					base.setNoTokenNeedPermissionRoute('')
					uni.redirectTo({
						url: prePage
					})
				}
				else {
					uni.reLaunch({
						url: '/pages_user/index/index'
					})
				}
			}
			
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('检查表单')
		})
	}
	
</script>

<style lang="scss" scoped>

</style>

<template>
	<view class="u-p-20 u-p-l-40 u-p-r-40">
		<u--form
			labelPosition="left"
			:model="addressData"
			ref="uForm"
			labelWidth="80"
		> 
			<u-form-item
				label="联系人"
				prop="name"
				ref="addressData_name"
				required
			>
				<u--input
					v-model="addressData.name"
					clearable
				></u--input>
			</u-form-item>
			<u-form-item
				label="手机号"
				prop="tel"
				ref="addressData_tel"
				required
			>
				<u--input
					v-model="addressData.tel"
					clearable
					type="number"
				></u--input>
			</u-form-item>
			<u-form-item
				label="地区"
				prop="area"
				ref="addressData_area"
				required
			> 
				<view style="width: 100%;">
					<uni-data-picker
						placeholder="所在地" 
						popup-title="请选择所在地区" 
						:localdata="regional_list" 
						v-model="addressData.area"  
						@change="handleValArea"
						:map="{
							text: 'label',
							value: 'value',
						}"
					></uni-data-picker>
				</view>
				
			</u-form-item>
			<u-form-item
				label="详细地址"
				prop="address"
				ref="addressData_address"
				required
			>
				<u--textarea
					v-model="addressData.address" 
					placeholder="详细地址" 
					height="90"
				></u--textarea>
			</u-form-item>
			
			<u-form-item
				label="设为默认" 
			>
				<u-switch 
				activeColor="#F12E24"
				v-model="addressData.default" 
				:activeValue="1"
				:inactiveValue="0"
				></u-switch>
			</u-form-item>
			<!-- <u-form-item
				label="备注"
				prop="remark"
				ref="addressData_remark"
			>
				<u--textarea
					v-model="addressData.remark" 
					placeholder="备注" 
					height="90"
				></u--textarea>
			</u-form-item> -->
		</u--form>
		
		<view class="u-p-t-20">
			<u-button type="error" @click="submit">提交</u-button>
		</view>
		<!-- <view class="u-p-t-20 u-m-b-40" v-if="addressData.id">
			<u-button type="error" @click="delAddrClick">删除地址</u-button>
		</view> -->
	</view>
</template>

<script setup>
	import { onLoad, onUnload, onReady, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'  
	const $api = inject('$api') 
	import { baseStore } from '@/stores/base.js'
	const base = baseStore() 
	const { themeColor, regional_list, regional_list_loading } = toRefs(base) 
	
	const uForm = ref()
	const addressData = ref({
		id: '',
		name: '',
		tel: '',
		area: '',
		area_name: '',
		address: '',
		remark: '',
		default: 0,  
	})
	const rules = {
		name: [
			{
				required: true,
				message: '联系人不得为空',
				trigger: ['change', 'blur'],
			}
		],
		tel: [
			{
				validator: (rule, value, callback) => { 
					return uni.$u.test.mobile(value);
				},
				message: '输入正确的手机号',
				trigger: ['change', 'blur'],
			}
		],
		area: [
			{
				required: true,
				message: '地区不得为空',
				trigger: ['change', 'blur'],
			}
		],
		address: [
			{
				required: true,
				message: '详细地址不得为空',
				trigger: ['change', 'blur'],
			}
		],
	}
	onLoad(async (options) => {
		// if(regional_list.value.length == 0 && !regional_list_loading.value ) {
		// 	base.get_regional_list()
		// }
		// console.log(regional_list.value)
		if(options.hasOwnProperty('id')) {
			addressData.value.id = options.id
			await getData()
		} 
	})
	onReady(() => {
		uForm.value.setRules(rules)
	})
	
	async function getData() {
		const res = await $api.address_detail({
			params: {
				id: addressData.value.id
			}
		})
		if(res.code == 1 ) {
			addressData.value = {
				...addressData.value,
				...res.list,
				area: res.list.area+'',
				defaultCheck: res.list.default == 1? true: false
			}
		}
	}
	
	function submit() {
		uForm.value.validate().then(async () => {
			uni.showLoading()
			const res = await $api.address_save({params: {
				...addressData.value
			}})
			if(res.code == 1) { 
				uni.showToast({
					title: res.msg
				})
				let data = {data: addressData.value, type: 'add'}
				if(addressData.value.id) {
					data.type = 'edit'
				}
				uni.$emit('address_update', data )
				setTimeout(() => {
					base.handleGoto({type: 'navigateBack'})
				}, 800)
				
			}
			
		}).catch(errors => {
			console.log(errors)
			uni.$u.toast('检查表单')
		})
	}
	function handleValArea(e) { 
		addressData.value.area_name = e.detail.value.map(ele => ele.text).join('')
	}
	
</script>
<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>

</style>

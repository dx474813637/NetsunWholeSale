<template>
	<view class="card bg-white u-radius-12 u-p-20" @click="cardClick">
		<!-- <view class="card-header u-flex u-flex-items-center u-flex-between u-m-b-20">
			<view class="item u-flex u-flex-items-end">
				<view class="name u-flex u-flex-items-center">
					<u-icon name="account-fill" size="16" color="#afd2ff"></u-icon>
					<text class="u-m-l-10 u-line-1">{{origin.name}}</text> 
				</view>
				<view class="u-m-l-20 u-flex u-flex-items-center">
					<u-icon name="phone-fill" size="16" color="#afd2ff"></u-icon>
					<text class="u-m-l-10">{{origin.tel}}</text> 
				</view>
			</view>
			<view class="item text-nowrap u-m-l-20">
				<u-tag type="primary" size="mini" text="默认" v-if="origin.default == '1'"></u-tag>
			</view>
		</view> -->
		<view class="card-row u-flex u-flex-items-center u-flex-between u-m-b-20"> 
			<u-icon name="map-fill" size="26" color="#E66449"></u-icon>
			<view class="item u-flex-1 u-m-l-20">
				<view class="text-base u-m-b-10">
					{{origin.area_name}}
				</view> 
				<view class="text-bold u-font-36 u-m-b-10">
					{{origin.address}}
				</view> 
				<view class="u-flex u-flex-items-center u-font-28">
					<view>
						{{origin.name}}
					</view> 
					<view class="u-m-l-20">
						{{origin.tel}}
					</view> 
					<view class="item text-nowrap u-m-l-20">
						<u-tag type="error" size="mini" text="默认" v-if="origin.default == '1'"></u-tag>
					</view>
				</view> 
			</view>
			<view class="item u-p-l-20 u-p-10 u-p-r-20" v-if="cardClickToEdit">
				<u-icon name="edit-pen-fill" size="16" color="#999"></u-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
	import { ref, reactive, computed, toRefs, inject, watch, onMounted } from 'vue'  
	const $api = inject('$api') 
	import { baseStore } from '@/stores/base.js'
	const base = baseStore() 
	const { themeColor, regional_list, regional_list_loading } = toRefs(base) 
	
	const props = defineProps({
		origin: {
			type: Object,
			default: () => {
				return {}
			}
		},
		cardClickToEdit: {
			type: Boolean,
			default: true
		}
	})
	 
	const emits = defineEmits(['cardClick'])
	function cardClick() {
		if(props.cardClickToEdit) {
			base.handleGoto({
				url: '/pages_user/address/addressDetail',
				params: {
					id: props.origin.id
				}
			})
			return
		}
		emits('cardClick', {data: props.origin})
	}
	
</script>

<style lang="scss" scoped>
	.name {
		font-weight: bold;
	} 
</style>
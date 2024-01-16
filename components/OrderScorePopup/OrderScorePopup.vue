<template>
	<view>
		<PopupNormal v-bind="$attrs" > 
			<view class="list-w bg-white">   
				<view class="main-list  u-p-50 u-flex u-flex-center u-flex-items-center" >
					<uni-rate 
						:touchable="false" 
						v-model="score" 
						@change="onChange" 
					/>
				</view>  
			</view>  
			<template #footer>
				<view class="u-p-20">
					<u-button type="error" :disabled="score == 0" shape="circle" @click="submit">提交评分</u-button>
				</view>
			</template>
		</PopupNormal>
	</view>
</template>

<script setup>
	import {
		ref,
		toRefs,
		inject,
		computed,
		onMounted,
		reactive, 
		watch,
		useAttrs
	} from 'vue' 
	const attrs = useAttrs()
	const $api = inject('$api')
	import { baseStore } from '@/stores/base'
	const base = baseStore();
	const { themeColor } = toRefs(base)
	import { userStore } from '@/stores/user'
	const user = userStore();
	const { user_info } = toRefs(user)
	 
	const props = defineProps({  
		list: {
			type: Array,
			default: () => {
				return []
			},
		} 
	})   
	watch(
		() => props.list.score,
		(n) => {
			score.value = +n
		}
	)
	const score = ref(0)
	const emits = defineEmits(['submitScore'])
	onMounted(async () => { 
	})  
	function onChange () {
		
	}
	function submit () {
		if(score.value == 0) return
		emits('submitScore', score.value)
	}
</script>

<style lang="scss" scoped>
	.list-w { 
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
</style>
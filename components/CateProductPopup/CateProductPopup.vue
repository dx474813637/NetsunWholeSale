<template>
	<view>
		<PopupNormal v-bind="$attrs" >
			<!-- <template #header>
				<view>header1</view>
			</template> -->
			<view class="list-w u-flex">
				<view class="list-item item-left">
					<u-list height="100%">
						<u-list-item
							v-for="(item, index) in nav_left"
							:key="item.name"
						> 
							<view 
								class="u-p-20 u-p-t-30 u-p-b-30 nav-item u-font-28 u-flex-column u-flex-items-center"
								 @click="handleNavClick(index)"
								:class="{
									'active-nav': index == nav_current 
								}"> 
									<view class="u-p-t-20">{{item.name}}</view>
								</view> 
							
						</u-list-item>
					</u-list>
				</view>
				<view class="list-item item-right u-flex-1"> 
					<scroll-view class="main-list u-p-20" scroll-y >
						<view class=" u-flex u-flex-wrap u-flex-items-start">
							<view  
								class="item-card u-p-20 u-radius-5 bg-white u-font-28 u-flex-column u-flex-items-center u-flex-center"
								:class="{
									active: nav_current == props.current[0] && index == props.current[1]
								}"
								v-for="(item, index) in mainList"
								:key="item.id"
								@click="onConfirm(item, index)"
							>	
								<up-image
									showLoading
									:src="item.img"
									width="60px"
									height="60px" 
									v-if="item.img"
								></up-image>
								<view class="u-flex u-flex-items-center u-flex-center" style="width: 60px; height: 60px;" v-else>
									<u-icon name="grid-fill" size="40" color="#bbb"></u-icon>
								</view> 
								<view class="u-m-t-20 u-line-1 text-base">
									{{item.name}}
								</view>
							</view> 
						</view>
					</scroll-view>
				</view>
			</view> 
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
		watch
	} from 'vue' 
	import {useCateStore, baseStore} from '@/stores/base.js'
	const base = baseStore()
	const cate = useCateStore()
	const { cate_list, cate_loading } = toRefs(cate)
	const { themeColor } = toRefs(base)
	const props = defineProps({ 
		current: {
			type: Array,
			default: () => {
				return [1, -1]
			},
		}
	}) 
	const emits = defineEmits(['onConfirm'])
	const nav_current = ref(1) 
	const nav_left = computed(() => {
		if(cate_list.value.length == 0) return []
		return [{
			name: '全部',
			id: ''
		}, ...cate_list.value]
	})
	const mainList = computed(() => {
		if(nav_left.value.length == 0) return []
		return nav_left.value[nav_current.value].children
	})
	onMounted(async () => {
		if(cate_list.value.length == 0 && !cate_loading) {
			uni.showLoading()
			await cate.getCateData()
		} 
	})
	watch(
		() => props.current,
		(n) => {
			nav_current.value = n[0]
		},
		{
			deep: true,
			immediate: true
		}
	)
	
	function handleNavClick(index) {
		if(index == 0) {
			onConfirm(nav_left.value[0], -1)
			return
		}
		nav_current.value = index
	}
	function onConfirm (item, index) {
		emits('onConfirm', {data: item, cate_label: index > -1? `${nav_left.value[nav_current.value].name} - ${mainList.value[index].name}` : '全部' })
	}
</script>

<style lang="scss" scoped>
	.list-w {
		height: 60vh;
		background-color: #fff;
		.list-item {
			height: 100%;
			&.item-left {
				flex: 0 0 30%;
				background-color: #f8f8f8;
			}
		}
	}
	.nav-item {
		color: #666; 
		filter: grayscale(100%);
		&.active-nav {
			background-color: #fff;
			color: $u-error; 
			filter: none;
		}
	}
	.main-list {
		height: 100%;
	}
	.item-card {  
		box-sizing: border-box;  
		margin-bottom: 10px; 
		padding: 10px;
		color: #666;
		border-radius: 5px;
		&.active {
			background-color: $u-primary-light;
			color: $u-primary;
		}
	}
</style>
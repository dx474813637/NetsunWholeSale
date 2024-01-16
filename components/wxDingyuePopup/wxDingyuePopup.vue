<template>
	<view>
		<u-popup :show="show" mode="center" @close="$emit('close')" round="10" :safeAreaInsetBottom="false">
			<view class="u-p-20 ">
				<view class="img-w">
					<u--image
						showLoading
						:src="`https://wx3.y.netsun.com/Public/2023xuanpinhui/a08.png?time=${new Date().getTime()})`"
						width="80vw"
						height="auto"
						mode="widthFix"
					></u--image>
				</view>
				<u-button type="primary" @click="$emit('dingyuebtn')">立即订阅</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name:"wxDingyuePopup",
		props: {
			show: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
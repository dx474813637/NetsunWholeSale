import {
	defineComponent,
	ref,
	reactive,
	inject,
	watch,
	computed
} from 'vue'
import {
	onLoad,
	onReady
} from '@dcloudio/uni-app'
import pinia  from '@/stores/index.js';
import {
	baseStore
} from '@/stores/base';
const base = baseStore(pinia)


export function notify_show({dom, options={}}) {
	// console.log(dom.value)
	dom.value.show({
		top: 44,
		type: 'primary',
		color: '#fff',
		// bgColor: '#fff',
		message:  'showNotify',
		duration: 3000,
		fontSize: 14,
		safeAreaInsetTop: true, 
		...options
	}) 
	
}

export function baseNotify(dom, options={}) {  
	const msguptime = computed(() => base.msg.time)
	watch(
	  msguptime,
	  (item) => {
		 notify_show({dom, options: {
			 message: `${base.msg.content} ${base.msg.time}`,
			 ...options
		 }}) 
	}) 
}

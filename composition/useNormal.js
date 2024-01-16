import {
	defineComponent,
	ref,
	reactive,
	inject
} from 'vue'
import {
	onLoad
} from '@dcloudio/uni-app'
export function useNormal() {
	const $http = inject('$http') 
	// console.log(curPage) 
	onLoad((options) => {
		initArgs(options) 
	})   
	function initArgs(ids) {
		// console.log(ids, 'xx') 
		let options = ids
		if(options.hasOwnProperty('scene')) {
			let arr = decodeURIComponent(options.scene).split('&') 
			arr.forEach(item => {
				let arr2 = item.split('=')
				options[arr2[0]] = arr2[1]
			})
		} 
		console.log(options, 'xx2') 
	}
	return { 
		initArgs
	}
} 
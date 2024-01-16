import App from './App'

import uviewPlus from 'uview-plus'
import pinia from '@/stores/index.js';
import apis from './config/apis/index'
import setHttp from '@/config/request.js'  
// import ws from '@/utils/webstocket.js'
 // import mpShare from 'uview-plus/libs/mixin/mpShare'
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.provide('$http', uni.$u.http);
	// app.provide('$VodUploader', VodUploader);
	// app.provide('$ws', ws); 
	app.provide('$api', apis);
	app.use(uviewPlus).use(pinia); 
	// app.mixin(mpShare)
	setHttp()
	return {
		app
	}
}
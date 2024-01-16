import {
	defineConfig
} from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite'  
export default defineConfig({
	plugins: [
		uni(),
		AutoImport({
			imports: [
				'vue',
				'uni-app', 
				{
					'@/composition/useNormal': [
						// [
						// 	// 默认导入
						// 	['default', 'useNormal'], // import { default as axios } from 'axios',
						// ],
						// 命名导入
						'useNormal', // import { useMouse } from '@vueuse/core',
						// 设置别名
						// ['useFetch',
						// 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
					]
				}, 
			]
		})
	],
});
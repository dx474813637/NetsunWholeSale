export function isObjectEqual(obj1, obj2) {
	const obj1Keys = Object.keys(obj1);
	const obj2Keys = Object.keys(obj2);

	if (obj1Keys.length !== obj2Keys.length) {
		return false;
	}

	for (let key of obj1Keys) {
		if (obj1[key] !== obj2[key]) {
			return false;
		}
	}

	return true;
}
export function deepMerge(target = {}, source = {}) {
	target = uni.$u.deepClone(target)
	if (typeof target !== 'object' || typeof source !== 'object') return false
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue
		if (prop in target) {
			if (typeof target[prop] !== 'object' || target[prop] === null) {
				target[prop] = source[prop]
			} else if (typeof source[prop] !== 'object' || source[prop] === null) {
				target[prop] = source[prop]
			} else if (target[prop].concat && source[prop].concat) {
				target[prop] = target[prop].concat(source[prop])
			} else {
				target[prop] = deepMerge(target[prop], source[prop])
			}
		} else {
			target[prop] = source[prop]
		}
	}
	return target
}

export function isNumber(num) {
	return !isNaN(parseFloat(num)) && isFinite(num)
}

export async function getImageBase64_readFile(tempFilePath) {
	return await new Promise(resolve => {
		//获取全局唯一的文件管理器 
		uni.getFileSystemManager().readFile({ //读取本地文件内容
			filePath: tempFilePath, // 文件路径
			encoding: 'base64', // 返回格式
			success: ({
				data
			}) => {
				// return resolve('data:image/png;base64,' + data);
				return resolve(data);
			}
		});
	});
}


import provinces from '@/utils/province.js';
import citys from '@/utils/city.js';
import areas from '@/utils/area.js';

// console.log(provinces)
// console.log(citys)
// console.log(areas)
export function initAddressData() {
	let data = uni.$u.deepClone(provinces);
	data.forEach((province, index) => {
		province.children = uni.$u.deepClone(citys[index]).map((item, i) => {
			item.children = uni.$u.deepClone(areas[index][i])
			return item
		}) 
	}) 
	return data
}
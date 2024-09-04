import {
	defineStore,
	storeToRefs
} from 'pinia';
import apis from '@/config/apis/index';
import {deepMerge} from '@/utils/base.js'
import { userStore } from '@/stores/user';
import { baseStore } from '@/stores/base';
const USER = userStore();
let { user } = storeToRefs(USER);  
const base = baseStore();
let { noTokenNeedPermissionRoute } = storeToRefs(base);  

let cart_list = [];
if(uni.getStorageSync('cart_list')) {
	cart_list = uni.getStorageSync('cart_list')[user.value.login] || []
	if(cart_list.length > 0 && !cart_list[0].products[0].hasOwnProperty('base')) {
		cart_list = []
		uni.setStorageSync('cart_list', [])
	}
} 

export const useCartStore = defineStore('cart', {
	state: () => {
		return { 
			cart_list: cart_list,
			is_order_data: []
		};
	},
	getters: { 
		cart_list_num() {
			if(!this.cart_list || this.cart_list.length == 0) return 0
			return this.cart_list.map(ele => ele.products.map(s => s.list.reduce((prev, item) => prev + item.num, 0))).reduce((prev, item) => prev + item, 0)
		},
		cart_list_checked() {
			if(!this.cart_list || this.cart_list.length == 0) return []
			let arr = this.cart_list.map(ele => {
				let products_checked = ele.products.filter(item => item.checked);
				// console.log(products_checked)
				if(products_checked.length == 0) return false;
				return {
					...ele,
					products: products_checked
				}
			}).filter(ele => ele !== false)
			// console.log(arr)
			return arr
		},
		cart_list_checked_num() {
			if(!this.cart_list || this.cart_list.length == 0) return 0
			let sum = this.cart_list.map(ele => ele.products.filter(item => item.checked).reduce((prev, item) => prev + Number(item.num), 0)).reduce((prev, item) => prev + item, 0) 
			return sum
		},
		cart_list_abled_num() {
			if(!this.cart_list || this.cart_list.length == 0) return 0
			return this.cart_list.map(ele => ele.products.filter(item => !item.disabled).reduce((prev, item) => prev + Number(item.num), 0)).reduce((prev, item) => prev + item, 0)
		},
		cart_list_checked_price() {
			if(!this.cart_list || this.cart_list.length == 0) return 0
			let sum = this.cart_list.map(ele => ele.products.filter(item => item.checked).map(s => s.list.reduce((prev, item) => prev + (item.num*item.price), 0)).reduce((prev, item) => prev + item, 0)).reduce((prev, item) => prev + item, 0)
			return sum
		},
		is_order_data_price() {
			if(!this.is_order_data || this.is_order_data.length == 0) return 0
			// return this.is_order_data.map(ele => ele.products.map(s => s.list.reduce((prev, item) => prev + (item.num*item.price), 0))).reduce((prev, item) => prev + item, 0)  
			let sum = this.is_order_data.map(ele => ele.products.filter(item => item.checked).map(s => s.list.reduce((prev, item) => prev + (item.num*item.price), 0)).reduce((prev, item) => prev + item, 0)).reduce((prev, item) => prev + item, 0)
			return sum
		},
		is_order_data_num() {
			if(!this.is_order_data || this.is_order_data.length == 0) return 0
			return this.is_order_data.map(ele => ele.products.map(s => s.list.reduce((prev, item) => prev + Number(item.num), 0))).reduce((prev, item) => prev + +item, 0) 
		},
	}, 
	actions: { 
		saveCartData2LocalStorage() {
			let oridinData = uni.getStorageSync('cart_list') || {}
			oridinData[user.value.login] = this.cart_list
			uni.setStorageSync('cart_list', oridinData)
		},
		saveLocalStorage2CartData() {
			if(uni.getStorageSync('cart_list')) {
				this.cart_list = uni.getStorageSync('cart_list')[user.value.login] || []
			} 
		},
		removeCartData() {
			this.cart_list = []
			this.saveCartData2LocalStorage()
		},
		specs2Obj(specs) {
			let arr = [];
			for(let key in specs) {
				arr.push({
					label: key,
					value: specs[key]
				})
			}
			return arr
		},
		addProduct2Cart(data, shop, product) {
			console.log(product)
			// if(!user.value.login) {
			// 	let page = uni.$u.pages()[0] || {}
			// 	base.setNoTokenNeedPermissionRoute({
			// 		url: page.route,
			// 		params: page.options,
			// 	})
			// 	base.handleGoto({
			// 		url: '/pages/login/login',
			// 		type: 'redirect'
			// 	})
			// 	// settings.setPrevPage(router.currentRoute.value)
			// 	// ElMessage.error('请先登录');
			// 	// settings.goLogin()
			// 	return
			// }
			
			let { id: shopId } = shop; 
			product.loading = false
			product.checked = false
			// product.list = product.list.map(ele => {
			// 	return {
			// 		...ele,  
			// 		specs_arr: this.specs2Obj(ele.specs), 
			// 	} 
			// }) 
			let shop_index = this.cart_list.findIndex(ele => ele.shop.id == shopId); 
			if(shop_index == -1) {
				let datas = {
					shop: {
						...shop, 
						checked: false,
						indeterminate: false
					},
					products: [product]
				}
				this.cart_list.unshift(datas)  
			} else {
				let active_shop_list = this.cart_list[shop_index].products
				let product_base_data = product.base;
				let product_base_data_id = product_base_data.id
				let product_index = active_shop_list.findIndex(ele => ele.base.id == product_base_data_id); 
				if(product_index == -1) { 
					active_shop_list.unshift(product)  
				} else {
					let active_sku_list = active_shop_list[product_index].list
					product.list.forEach(ele => {  
						let i = active_sku_list.findIndex(p => p.id == ele.id); 
						let p_new = {
							...ele 
						}
						if(i != -1) {
							p_new = {
								...active_sku_list[i],
								...p_new,
								num: active_sku_list[i].num + ele.num,
								specs_arr: ele.specs_arr
							}
							active_sku_list.splice(i, 1)
						} 
						active_sku_list.unshift(p_new)
					})
				}
			}
			
	// 		data = data.map(ele => {
	// 			return {
	// 				...ele,  
	// 				specs_arr: this.specs2Obj(ele.specs), 
	// 				stock: +ele.stock,
	// 				loading: false, 
	// 				checked: false
	// 			} 
	// 		}) 
	// 		let shop_index = this.cart_list.findIndex(ele => ele.shop.id == shopId); 
	// 		if(shop_index == -1) {  
	// 			let datas = {  
	// 				shop: {
	// 					...shop, 
	// 					checked: false,
	// 					indeterminate: false
	// 				},
	// 				products: data
	// 			}
	// 			this.cart_list.unshift(datas) 
	// 		}
	// 		else { 
	// 			let datas = this.cart_list[shop_index] 
	// 			shop.checked = datas.shop.checked;  
	// 			datas.shop = deepMerge(datas.shop, shop) 
	// 			data.forEach(prod => { 
	// 				let productIndex = datas.products.findIndex(ele => ele.id == prod.id);  
	// 				if(productIndex == -1) {
	// 					if(datas.shop.checked) datas.shop.indeterminate = true
	// 					datas.shop.checked = false 
	// 					datas.products.unshift(prod)
	// 				}else {
	// 					prod.num = (+prod.num) + (+datas.products[productIndex].num)
	// 					// console.log(prod.num)
	// 					prod.checked = datas.products[productIndex].checked 
	// 					let item = uni.$u.deepClone(datas.products[productIndex])
	// 					item = deepMerge(item, prod)  
	// 					datas.products.splice(productIndex, 1)
	// 					datas.products.unshift(item) 
	// 				}
	// 			})
	// 		}
			this.initProductNum()
			this.saveCartData2LocalStorage()

			return true
		},
		initProductNum() {
			this.cart_list.forEach((ele, ele_i) => ele.products.forEach((item, item_i) => {
				item.num = item.list.reduce((prev, sku) => prev + sku.num, 0)
				// console.log(item.num)
				if(item.num < item.znum) item.checked = false // 判断是否小于商品起批数
			}))
		},
		addOrderProduct(data, shop, product) { 
			//直接购买下单的商品     
			let datas = {  
				shop: {
					...shop,  
				},
				products: [product]
			}  
			this.is_order_data.unshift(datas)  
			return true
		},
		setPidSku(arr, idStr) { 
			this.cart_list = this.cart_list.map((cart ) => {
				cart.products = cart.products.map((s) => {
					s.list = s.list.map(item => {
						let itemIndex = arr.findIndex((ele) => ele.id == item.id)
						if(itemIndex != -1) {
							let itemObj = arr[itemIndex] 
							item = {
								...item,
								img: itemObj.img? itemObj.img : item.img,
								stock: +itemObj.stock,
								// num: +(itemObj.stock > item.num? item.num : itemObj.stock),
								num: +item.num,
								price: itemObj.pprice, 
								// min: +itemObj.znum, 
							} 
							s.znum = +itemObj.znum
							if(item.num > item.stock) {
								item.num = item.stock
							}
							// if( item.min > item.stock ) {
							// 	item.disabled = true
							// 	item.checked = false
							// 	item.num = 0
							// }
							// else {
							// 	if(item.num < item.min) {
							// 		item.num = item.min
							// 	}
							// 	if(item.num > item.stock) {
							// 		item.num = item.stock
							// 	}
							// } 
							
						}else if(idStr.includes(item.id)) { 
							item.disabled = true
							item.checked = false
						} 
						return item
					})
					return s
					
					// let itemIndex = arr.findIndex((ele) => ele.id == item.id)
					// if(itemIndex != -1) { 
					// 	let itemObj = arr[itemIndex] 
					// 	item = {
					// 		...item,
					// 		img: itemObj.img? itemObj.img : item.img,
					// 		stock: +itemObj.stock,
					// 		// num: +(itemObj.stock > item.num? item.num : itemObj.stock),
					// 		num: +item.num,
					// 		price: itemObj.pprice, 
					// 		// min: +itemObj.znum, 
					// 	} 
						
					// 	if( item.min > item.stock ) {
					// 		item.disabled = true
					// 		item.checked = false
					// 		item.num = 0
					// 	}
					// 	else {
					// 		if(item.num < item.min) {
					// 			item.num = item.min
					// 		}
					// 		if(item.num > item.stock) {
					// 			item.num = item.stock
					// 		}
					// 	} 
						
					// }else if(idStr.includes(item.id)) { 
					// 	item.disabled = true
					// 	item.checked = false
					// } 
					// return item
				}) 
				return cart
			}) 
		},
		async getPidSku(idStr) { 
			if(!idStr) return 
			let obj = {}
			obj = await apis.web_pid_sku1({
				params: { id: idStr }
			})
			.then( res => {
				this.setPidSku(res.list, idStr)
				this.initProductNum()
				this.saveCartData2LocalStorage()
				return {
					res: res.list
				}
			})
			.catch(res => {
				this.setPidSku([], idStr)
				this.saveCartData2LocalStorage()
				return {
					res: []
				}
			})
			console.log(obj)
			return obj
			
			 
		},
		removeProductsById(arr) { 
			let data = uni.$u.deepClone(this.cart_list)
			data.forEach((cart, index ) => {
				cart.products.forEach((item, i) => {
					item.list.forEach((ele, ele_i) => {
						let eleIndex = arr.findIndex((id) => id == ele.id)
						if(eleIndex != -1) {
							data[index].products[i].list[ele_i] = false 
						} 
					})
					// let itemIndex = arr.findIndex((id) => id == item.id)
					// if(itemIndex != -1) {   
					// 	data[index].products[i] = false 
					// } 
				}) 
			})
			this.cart_list = data.map(ele =>( {
				...ele, 
				products: ele.products.map(item => ({
						...item,
						list: item.list.filter(s => s)
					})).filter(item => item.list.length != 0),
				// products: ele.products.filter(item => item)
				})
			).filter(ele => ele.products.length != 0)
			console.log(this.cart_list) 
		}
	},
});
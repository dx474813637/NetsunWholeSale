import { ref, onMounted, onUnmounted, inject, computed, toRefs } from 'vue';
import {isNumber} from '@/utils/base';

const $api = inject('$api') 
import {useCartStore} from '@/stores/cart.js'
const cart = useCartStore()
const { cart_list, cart_list_num, cart_list_checked, cart_list_checked_num, cart_list_checked_price } = toRefs(cart)

function useProductSku(){
	const sku_ids = computed(() => cart_list.value.map(ele => {
		return ele.products.filter(item => !item.disabled)
							.map(item => item.id)
							.join(',')
	}).filter(ele => ele).join(','))
    const sku2treeData = (skuStr) => {
        let arr = []
        arr = skuStr.split('^').map(ele => {
            let obj = {};
            let item = ele.split('|')
            obj.label = item[0]
            obj.children = item[1].split(',').map(item => ({label: (isNumber(item)? +item : item), disabled: false}))
            return obj
        })
        console.log(arr)
        return arr
    }

    const skuTable2domains = (sku) => {
        let arr = [];
        let newTabName = ''
        arr = sku.map((ele, index) => { 
            newTabName = `${++index}` 
            return {
                key: newTabName,
                values: ele.children.map((item, i) => {
                    return {
                        value: item.label,
                        filesList: [],
                        key: i+1,
                        parentKey: newTabName
                    }
                }),
                label: ele.label, 
                name: newTabName,
                isMainKey: false,
                valuesIndex: ele.children.length,
            } 
        })
        return {
            arr,
            newTabName
        }
    }

    const sku2domains = (skuStr) => {
        let arr = [];
        let newTabName = ''
        arr = skuStr.split('^').map((ele, index) => {
            newTabName = `${++index}` 
            let itemArr = ele.split('|') 
            let children = itemArr[1].split(',') 
            let obj = {
                key: newTabName,
                label: itemArr[0], 
                name: newTabName,
                isMainKey: false,
                valuesIndex: children.length,
                values: children.map((item, i) => {
                    return {
                        value: item,
                        filesList: [],
                        key: i+1,
                        parentKey: newTabName
                    }
                })
            };
            return obj
        })
        return {arr, newTabName}
    }
    const getPriceStockBySkuId = async (skuId) => {
		return await $api.web_pid_sku1({params: {id: skuId}})
    }

    return {
		sku_ids,
        sku2treeData,
        skuTable2domains,
        sku2domains,
        getPriceStockBySkuId
    }
}

export default useProductSku
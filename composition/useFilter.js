import {
	computed
} from 'vue'

export default function useFilter(zt) { 
	const order_zt2str = computed(() => {
		let value = zt?.value.order_zt
		let text = value
		if(value == '0') text = '待付款'
		else if(value == '1') text = '付款成功' 
		else if(value == '2') text = '待收货' 
		else if(value == '3') text = '订单完成' 
		else if(value == '4') text = '评分完成' 
		else if(value == '5') text = '申请售后' 
		else if(value == '6') text = '拒绝退款' 
		else if(value == '7') text = '订单关闭'  
		return text
	}) 
	const yuyue_zt2str = computed(() => {
		let value = zt?.value.yuyue_zt
		let text = value
		if(value == '0') text = '待审核'
		else if(value == '1') text = '通过' 
		else if(value == '2') text = '拒绝' 
		return text
	}) 
	
	const idTypeList2str = computed(() => {
		let value = zt?.value.idType
		let text = value
		if(value == 'CRED_PSN_CH_IDCARD') text = '中国大陆身份证'
		else if(value == 'CRED_PSN_CH_TWCARD') text = '台湾来往大陆通行证' 
		else if(value == 'CRED_PSN_CH_MACAO') text = '澳门来往大陆通行证' 
		else if(value == 'CRED_PSN_CH_HONGKONG') text = '香港来往大陆通行证' 
		else if(value == 'CRED_PSN_PASSPORT') text = '护照' 
		return text
	}) 
	
	const finance_account_status = computed(() => {
		let value = zt?.value.finance_account_status
		let text = value
		if(value == '0') text = '未创建'
		else if(value == '1') text = '未认证'
		else if(value == '2') text = '已认证'
		else if(value == '3') text = '已注销' 
		return text
	}) 
	const finance_organizations_status = computed(() => {
		let value = zt?.value.finance_organizations_status
		let text = value
		if(value == '0') text = '待认证'
		else if(value == '1') text = '认证发送中'
		else if(value == '2') text = '认证成功'
		else if(value == '3') text = '认证失败' 
		else if(value == '4') text = '认证中' 
		return text
	}) 
	const pacc_query_status = computed(() => {
		let value = zt?.value.pacc_query_status
		let text = value 
		if(value == '1') text = '授信申请中'
		else if(value == '2') text = '授信已递交'
		else if(value == '4') text = '授信失败'
		else if(value == '5') text = '授信通过，签约中'
		else if(value == '6') text = '授信通过，贷款企业已签约'
		else if(value == '7') text = '授信通过，签约通过'
		else if(value == '8') text = '授信通过，贷款账户已激活'
		return text
	}) 
	
	const order_pay_status = computed(() => {
		let value = zt?.value.order_pay_status
		let text = value 
		if(value == '1') text = '等待支付' 
		else if(value == '5') text = '支付成功'
		else if(value == '6') text = '支付失败' 
		return text
	})  
	const sign_file_status1 = computed(() => {
		let value = zt?.value.sign_file_status1
		let text = value 
		if(value == 0) text = '未提交'
		else if(value == 1) text = '已创建'
		else if(value == 2) text = '已开启'
		else if(value == 3) text = '已归档'
		else if(value == 4) text = '已撤销' 
		return text
	})   
	const sign_file_status2 = computed(() => {
		let value = zt?.value.sign_file_status2
		let text = value 
		if(value == 0) text = '未提交'
		else if(value == 1) text = '已创建'
		else if(value == 2) text = '已开启'
		else if(value == 3) text = '已归档'
		else if(value == 4) text = '已撤销' 
		return text
	})   
	const order_rz_status = computed(() => {
		let value = zt?.value.order_rz_status
		let text = value 
		if(value == '1') text = '融资申请中'
		else if(value == '2') text = '流程暂停'
		else if(value == '3') text = '财务已拒绝'
		else if(value == '4') text = '放款机构已同意'
		else if(value == '5') text = '放款机构已拒绝'
		else if(value == '6') text = '提款成功'
		else if(value == '7') text = '提款失败'
		return text
	})    
	const role2Str = computed(() => {
		let value = zt?.value.role
		let text = value 
		if(value == '0') text = '买家'
		else if(value == '1') text = '达人' 
		else if(value == '2') text = '团长' 
		return text
	}) 
	const divide_rz_status = computed(() => {
		let value = zt?.value.divide_rz_status
		let text = value 
		if(value == '0') text = '待付款'
		else if(value == '1') text = '已付款'
		else if(value == '2') text = '订单完成'
		else if(value == '3') text = '可提取'
		else if(value == '4') text = '已提取' 
		else if(value == '5') text = '订单关闭' 
		return text
	})    
	return {
		order_zt2str,
		yuyue_zt2str,
		idTypeList2str,
		finance_account_status,
		finance_organizations_status,
		pacc_query_status,
		order_pay_status,
		sign_file_status1,
		sign_file_status2,
		order_rz_status,
		role2Str,
		divide_rz_status,
	}
}
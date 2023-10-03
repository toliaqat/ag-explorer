export default {
	myVar1: [],
	myVar2: {},
	walletId: "1",
	slash: "\\",
	cleanTxt (txt) {
		if (txt === undefined) return ""
		return JSON.parse(txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll(/\"/g,'"'));
		//	this.myVar1 = [1,2,3]
	},
	async getWalletData () {
		if (tbl_wallets.tableData.length < 1) {
			return [];
		}
		if (tbl_wallets.selectedRowIndex < 0) {
			return [];
		}
		return JSON.parse((await getWalletDataAPI.run({ "walletId": tbl_wallets.selectedRow.wallet })).value).values.map(v => ({value: (this.cleanTxt(v))})).map(kv => ({ "value": kv.value.body}))

		return [];
	},
	async getWallets () {
		
		return (await getWalletAPI.run()).children.map(v => ({wallet: v}));
	}
}
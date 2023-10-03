export default {
	dataPath: "/custom/vstorage/data/published.kread.character.".concat(tbl_wallets.selectedRow.character),
	myVar2: {},
	height: 1,
	walletId: "1",
	slash: "\\",
	cleanTxt (txt) {
		if (txt === undefined) return "";
		let result = txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll('\"#[', '[').replaceAll(']\"', ']');
		
		//return JSON.parse(txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll(/\"/g,'"'));
		//let result = txt;
		//console.log(result.body);
		return result;
		//	this.myVar1 = [1,2,3]
	},

	async getRpcWalletData () {
		showModal('Modal1');

		//resetWidget("tbl_walletsData", true);

		if (tbl_wallets.tableData.length < 1) {
			closeModal('Modal1');
			return [];
		}
		if (tbl_wallets.selectedRowIndex < 0) {
			closeModal('Modal1');
			return [];
		}

		this.dataPath = "/custom/vstorage/data/published.kread.character.".concat(tbl_wallets.selectedRow.character);
		
		
		let response = await RpcGetWalletDataAPI.run();
		
		if (response.result.response.value === null) {
			closeModal('Modal1');
			return [{ "value": response.result.response.log}];
		}

		this.height = response.result.response.height;
		let data = response.result.response.value && JSON.parse(atob(response.result.response.value));
		let result = JSON.parse((data).value).values.map(v => ({value: (this.cleanTxt(v))})).map(kv => ({ "value": JSON.parse(kv.value)}));

		console.log(result);
		closeModal('Modal1');
		
		return result;
	},

	async getRpcWallets () {
		if (searchInput.text.length > 0) {
			return [{character: searchInput.text}];
		}

		let response = await RpcGetWalletApi.run();
		this.height = response.result.response.height;
		//return response;
		let children = response.result.response.value && JSON.parse(atob(response.result.response.value)).children;

		return children.map(v => ({character: v}));
	}
}
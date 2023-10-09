export default {
	dataPath: "/custom/vstorage/data/published.vaultFactory.managers.manager0.vaults.vault0",
	myVar2: {},
	height: 1,
	listCount: 0,
	walletId: "1",
	slash: "\\",
	cleanTxt (txt) {
		if (txt === undefined) return ""
		return JSON.parse(txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll(/\"/g,'"'));
		//	this.myVar1 = [1,2,3]
	},
	async getState() {
		vaultsApi.getRpcWalletData.data;
	},
	
  async getRpcWalletData () {
		showModal('Modal1');
		if (tbl_wallets.tableData.length < 1) {
			closeModal('Modal1');
			return [];
		}
		if (tbl_wallets.selectedRowIndex < 0) {
			closeModal('Modal1');
			return [];
		}

		if (tbl_wallets.selectedRowIndices < 0) {
			if (appsmith.URL.queryParams.vaultId != undefined && appsmith.URL.queryParams.vaultId != null) {
				this.dataPath = "/custom/vstorage/data/published.vaultFactory.managers.manager0.vaults.".concat(appsmith.URL.queryParams.vaultId);
			}
		} else {
			this.dataPath = "/custom/vstorage/data/published.vaultFactory.managers.manager0.vaults.".concat(tbl_wallets.selectedRow.vault);
		}
		
		let response = await RpcGetWalletDataAPI.run();
		closeModal('Modal1');
		
		this.height = response.result.response.height;
		let data = response.result && 
				response.result.response &&
				response.result.response.value &&
				JSON.parse(atob(response.result.response.value));
		let result = JSON.parse((data).value).values.map(v => ({value: (this.cleanTxt(v))})).map(kv => ({ "value": kv.value.body}));
		
		return result;
	},

	async getRpcWallets () {
		if (searchInput.text.length > 0) {
			return [{vault: searchInput.text}];
		}
		let response = await RpcGetWalletApi.run();
		this.height = response.result.response.height;
		let children = response.result.response.value && JSON.parse(atob(response.result.response.value)).children;
		this.listCount = children.length;
		return children.map(v => ({vault: v}));
	},
	
		
	async pageLoad() {
		if (appsmith.URL.queryParams.vaultId != undefined && appsmith.URL.queryParams.vaultId != null) {
			searchInput.setValue(appsmith.URL.queryParams.vaultId);
		}
		
		if (appsmith.URL.queryParams.network != undefined && appsmith.URL.queryParams.network != null) {
			networkInput.setSelectedOption(appsmith.URL.queryParams.network);
		}
		
		this.getRpcWalletData();
	}
}
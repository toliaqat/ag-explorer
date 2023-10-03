export default {
	dataPath: "/custom/vstorage/data/published.vaultFactory.managers.manager0.vaults.vault0",
	myVar2: {},
	height: 1,
	walletId: "1",
	slash: "\\",
	cleanTxt (txt) {
		if (txt === undefined) return ""
		return JSON.parse(txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll(/\"/g,'"'));
		//	this.myVar1 = [1,2,3]
	},

  async getRpcWalletData () {
		showModal('Modal1');
		//resetWidget(json1);
		//json1.setValue("Loading...");
		//json1.setDisabled(true);
		
		if (tbl_wallets.tableData.length < 1) {
			closeModal('Modal1');
			//json1.setDisabled(false);
			return [];
		}
		if (tbl_wallets.selectedRowIndex < 0) {
			closeModal('Modal1');
			//json1.setDisabled(false);
			return [];
		}

		this.dataPath = "/custom/vstorage/data/published.vaultFactory.managers.manager0.vaults.".concat(tbl_wallets.selectedRow.vault);

		let response = await RpcGetWalletDataAPI.run();
		closeModal('Modal1');
		
		this.height = response.result.response.height;
		//return response;
		//return res.result;
		let data = response.result && 
				response.result.response &&
				response.result.response.value &&
				JSON.parse(atob(response.result.response.value));
		//return data;
		let result = JSON.parse((data).value).values.map(v => ({value: (this.cleanTxt(v))})).map(kv => ({ "value": kv.value.body}));
		//closeModal('Modal1');
		return result;
	},

	async getRpcWallets () {
		let response = await RpcGetWalletApi.run();
		this.height = response.result.response.height;
		//return response;
		let children = response.result.response.value && JSON.parse(atob(response.result.response.value)).children;
		//return children;
		return children.map(v => ({vault: v}));
	}
}
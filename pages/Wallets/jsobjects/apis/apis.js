export default {
	dataPath: "/custom/vstorage/data/published.wallet.".concat(tbl_wallets.selectedRow.wallet).concat(".current"),
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

		resetWidget("tbl_walletsData", true);

		if (tbl_wallets.tableData.length < 1) {
			closeModal('Modal1');
			return [];
		}
		if (tbl_wallets.selectedRowIndex < 0) {
			closeModal('Modal1');
			return [];
		}

		if (tbl_wallets.selectedRowIndices < 0) {
			if (appsmith.URL.queryParams.walletId != undefined && appsmith.URL.queryParams.walletId != null) {
				this.dataPath = "/custom/vstorage/data/published.wallet.".concat(appsmith.URL.queryParams.walletId).concat(".current");
			}
		} else {
			this.dataPath = "/custom/vstorage/data/published.wallet.".concat(tbl_wallets.selectedRow.wallet).concat(".current");
		}

		console.log(appsmith.URL.queryParams.walletId);
		console.log(tbl_wallets.selectedRow.wallet);
		console.log(this.dataPath);
		
		let response = await RpcGetWalletDataAPI.run();
		if (response.result.response.value === null) {
			closeModal('Modal1');
			return [{ "value": response.result.response.log}];
		}

		//return response;
		this.height = response.result.response.height;
		let data = response.result.response.value && JSON.parse(atob(response.result.response.value));

		let result = JSON.parse((data).value).values.map(v => ({value: (this.cleanTxt(v))})).map(kv => ({ "value": kv.value}));
		closeModal('Modal1');

		return result;
	},

	async getRpcWallets () {
		if (searchInput.text.length > 0) {
			return [{wallet: searchInput.text}];
		}

		let response = await RpcGetWalletApi.run();
		this.height = response.result.response.height;
		//return response;
		let children = response.result.response.value && JSON.parse(atob(response.result.response.value)).children;

		return children.map(v => ({wallet: v}));
	},
	
	async pageLoad() {
		if (appsmith.URL.queryParams.walletId != undefined && appsmith.URL.queryParams.walletId != null) {
			searchInput.setValue(appsmith.URL.queryParams.walletId);
		}
		
		if (appsmith.URL.queryParams.network != undefined && appsmith.URL.queryParams.network != null) {
			networkInput.setSelectedOption(appsmith.URL.queryParams.network);
		}
		
		this.getRpcWalletData();

	}
}
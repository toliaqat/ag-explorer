export default {
	dataPath: "/custom/vstorage/data/published.kread.item",
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

		this.dataPath = "/custom/vstorage/data/published.kread.item";
		
		console.log(this.dataPath);
		let response = await RpcGetWalletDataAPI.run();
		console.log(response);
		
		if (response.result.response.value === null) {
			closeModal('Modal1');
			return [{ "value": response.result.response.log}];
		}

		//return response;
		this.height = response.result.response.height;
		let data = response.result.response.value && JSON.parse(atob(response.result.response.value));

		let result = JSON.parse((data).value).values.map(v => ({value: (this.cleanTxt(v))})).map(kv => ({ "value": kv}));
		closeModal('Modal1');

		return result;
	},

	async getRpcWallets () {
		if (searchInput.text.length > 0) {
			return [{item: searchInput.text}];
		}

		let response = await RpcGetWalletApi.run();
		this.height = response.result.response.height;
		//return response;
		let children = response.result.response.value && JSON.parse(atob(response.result.response.value)).children;

		return children.map(v => ({item: v}));
	}
}
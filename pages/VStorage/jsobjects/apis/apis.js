export default {
	path: "/custom/vstorage/children/published",
	dataPath: "/custom/vstorage/data",
	height: 1,
	slash: "\\",
	cleanTxt (txt) {
		if (txt === undefined) return ""
		let sanitized = txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll('\"#[', '[').replaceAll(']\"', ']').replaceAll(/\"/g,'"').replaceAll('\"{', '{');
		if (!sanitized) {
			return sanitized;
		}
		return JSON.parse(sanitized);
	},

	async getRpcData () {

		showModal('Modal1');
		Iframe1.setVisibility(true);
		pathInput.setValue(this.dataPath);
		navigateTo('VStorage', {
			"path": this.dataPath,
			"network": networkInput.selectedOptionValue
		}, 'SAME_WINDOW');
		let response = await RpcGetDataAPI.run();
		if (response.result.response.value === null) {
			closeModal('Modal1');
			return [{ "value": response.result.response.log}];
		}

		this.height = response.result.response.height;
		let data = response.result.response.value && JSON.parse(atob(response.result.response.value));
		let result = JSON.parse((data).value) && JSON.parse((data).value).values.map(v => ({value: (this.cleanTxt(v))})).map(kv => ({ "value": kv.value}));
		result = { height: response.result.response.height, result };
		closeModal('Modal1');

		return result;
	},

	async getRpcChildren() {
		pathInput.setValue(this.path);
		showModal('Modal1');
		let response = await RpcGetChildrenApi.run();
		this.height = response.result.response.height;
		let children = response.result.response.value && JSON.parse(atob(response.result.response.value)).children;
		if (children.length === 0 || this.path.match(/published\.wallet\./g)) {
			this.dataPath = this.path;
			this.dataPath = this.dataPath.replace("/children/", "/data/");

			await this.getRpcData();
			closeModal('Modal1');

			return [];
		}
		closeModal('Modal1');
		navigateTo('VStorage', {
			"network": networkInput.selectedOptionValue
		}, 'SAME_WINDOW');
		return children.map(v => ({item: v}));
	},

	async getRpcChildrenLevelOne () {
		this.path = "/custom/vstorage/children/published";
		tbl_children1.setData([]);
		tbl_children2.setData([]);
		tbl_children3.setData([]);
		tbl_children4.setData([]);
		tbl_children5.setData([]);
		return await this.getRpcChildren();
	},

	async getRpcChildrenLevelTwo() {
		this.path = `/custom/vstorage/children/published.${tbl_children1.selectedRow.item}`;	
		tbl_children2.setData([]);
		tbl_children3.setData([]);
		tbl_children4.setData([]);
		tbl_children5.setData([]);
		Iframe1.setVisibility(false);
		return await this.getRpcChildren();
	},

	async getRpcChildrenLevelThree() {
		this.path = `/custom/vstorage/children/published.${tbl_children1.selectedRow.item}.${tbl_children2.selectedRow.item}`;
		tbl_children3.setData([]);
		tbl_children4.setData([]);
		tbl_children5.setData([]);
		Iframe1.setVisibility(false);
		return await this.getRpcChildren();
	},

	async getRpcChildrenLevelFour() {
		this.path = `/custom/vstorage/children/published.${tbl_children1.selectedRow.item}.${tbl_children2.selectedRow.item}.${tbl_children3.selectedRow.item}`;
		tbl_children4.setData([]);
		tbl_children5.setData([]);
		Iframe1.setVisibility(false);
		return await this.getRpcChildren();
	},

	async getRpcChildrenLevelFive() {
		this.path = `/custom/vstorage/children/published.${tbl_children1.selectedRow.item}.${tbl_children2.selectedRow.item}.${tbl_children3.selectedRow.item}.${tbl_children4.selectedRow.item}`;
		tbl_children5.setData([]);
		Iframe1.setVisibility(false);
		return await this.getRpcChildren();
	},

	async getRpcChildrenLevelSix() {
		this.path = `/custom/vstorage/children/published.${tbl_children1.selectedRow.item}.${tbl_children2.selectedRow.item}.${tbl_children3.selectedRow.item}.${tbl_children4.selectedRow.item}.${tbl_children5.selectedRow.item}`;
		Iframe1.setVisibility(false);
		return await this.getRpcChildren();
	},

	async pageLoad() {
		await this.getRpcChildrenLevelOne();

		if (appsmith.URL.queryParams.path) {
			if (appsmith.URL.queryParams.path.match(/\/data\//g)) {
				this.dataPath = appsmith.URL.queryParams.path;
				await this.getRpcData();
			}
		}

		if (appsmith.URL.queryParams.network) {
			const networkExists = networkInput.options.some(item => item.value === appsmith.URL.queryParams.network);
			if (networkExists) {
					networkInput.setSelectedOption(appsmith.URL.queryParams.network);	
			} 
		}
	},
}
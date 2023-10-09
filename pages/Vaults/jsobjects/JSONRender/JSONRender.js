export default {
	
	getJSONPage: () => {
		
		let json = vaultsApi.getRpcWalletData.data;
		
		//let val = json[0].value.debtSnapshot.interest.denominator.value / json[0].value.debtSnapshot.interest.numerator.value;
		//`${vaultsApi.getRpcWalletData.data[0].value.locked.value} ${vaultsApi.getRpcWalletData.data[0].value.locked.brand}`
		//interest. .setValue(val.toString());
		//storeValue('interest', val.toString());
		
		//state.setValue(json[0].value.vaultState);
		//locked.setValue(`${json[0].value.locked.value} ${json[0].value.locked.brand}`);
		
		json = JSON.stringify(json);
		return `
			<!DOCTYPE html>
		<html lang="en">
			<body>
				<div id="json-viewer"></div>
				<script src="https://cdn.jsdelivr.net/npm/w-jsonview-tree@1.0.29/dist/w-jsonview-tree.umd.js"></script>

				<script src="https://cdn.jsdelivr.net/npm/@textea/json-viewer@3"></script>
				<script>
					new JsonViewer({
					  defaultInspectDepth: 8,
						value: ${json}
					}).render('#json-viewer')
				</script>
			</body>
		</html>
			`;
	}
}
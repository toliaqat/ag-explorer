export default {
	data: (tbl_walletsData.selectedRowIndex < 0 && tbl_walletsData.tableData[0].value ) || (tbl_walletsData.selectedRow && tbl_walletsData.selectedRow.value),
	getJSONPage: () => {
		
		let json = '';
		if (tbl_walletsData.selectedRowIndex < 0) {
			json = tbl_walletsData.tableData[0].value;
		} else {
			if (tbl_walletsData.selectedRow != undefined) {
					json = tbl_walletsData.selectedRow.value;
			}
		}
		
		json = JSON.stringify(json);
		return `
			<!DOCTYPE html>
		<html lang="en">
			<body>
				<div id="json-viewer"></div>
				<script src="https://cdn.jsdelivr.net/npm/w-jsonview-tree@1.0.29/dist/w-jsonview-tree.umd.js"></script>

				<script src="https://cdn.jsdelivr.net/npm/@textea/json-viewer@3"></script>
				<script>
					console.log("test");
					new JsonViewer({
						value: ${json}
					}).render('#json-viewer')
				</script>
			</body>
		</html>
			`;
	}
}
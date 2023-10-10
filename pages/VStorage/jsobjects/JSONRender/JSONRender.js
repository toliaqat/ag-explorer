export default {
	
	getJSONPage: () => {
		
		let json = apis.getRpcData.data;

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
					  defaultInspectDepth: 10,
						value: ${json}
					}).render('#json-viewer')
				</script>
			</body>
		</html>
			`;
	}
}
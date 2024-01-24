export default {
	tx: searchInput.text,
	apiToRpcEndpoint: {
    "https://main.api.agoric.net/": "https://main.rpc.agoric.net/",
		"https://emerynet.api.agoric.net/": "https://emerynet.rpc.agoric.net/",
		"https://ollinet.api.agoric.net/": "https://ollinet.rpc.agoric.net/",
		"https://devnet.api.agoric.net/": "https://devnet.rpc.agoric.net/",
	},
	data: '',
	height: 1,
	walletId: "1",
	slash: "\\",
	cleanTxt (txt) {
		if (txt === undefined) return ""
		return JSON.parse(txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll(/\"/g,'"'));
	},
	async getBundleTxs() {
		showModal('Modal1');
		const txs = [];
		const response = await GetBundleInstallTxs.run();
		if (!response || !response.result) {
			closeModal('Modal1');
			return txs;
		}
		
		for (const tx of response.result.txs) {
			txs.push({tx: tx.hash, height: tx.height});
		}
		closeModal('Modal1');
		return txs;
	},
	
	async getBundleData() {	
		this.tx = searchInput.text;
		if (!searchInput.text) {
			console.log(`in: ${searchInput.text}`);
			if (appsmith.URL.queryParams.tx != undefined && appsmith.URL.queryParams.tx != null) {
				console.log(`innn: ${appsmith.URL.queryParams.tx}`);
				this.tx = appsmith.URL.queryParams.tx;
				searchInput.setValue(appsmith.URL.queryParams.tx);
			}
		}
		
		if (!searchInput.text) {
			return false;
		}
		let response = await GetTxApi.run();
		let s = {data: response.tx.body.messages[0].compressed_bundle};
		postWindowMessage(s, 'Iframe1', "*");
		return true;
	},
	async pageLoad() {
		if (appsmith.URL.queryParams.tx != undefined && appsmith.URL.queryParams.tx != null) {
			searchInput.setValue(appsmith.URL.queryParams.tx);
		}
		
		if (appsmith.URL.queryParams.apinetwork) {
			networkInput.setSelectedOption(appsmith.URL.queryParams.apinetwork);
		}
		
		this.getBundleData();
	},
	async getJSONPage() {
		return `
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.64.0/codemirror.min.css">
				
					<p style="color:#191919;font-family:sans-serif">Code from the bundle!</p>
			    <textarea id="codeFromBundle" name="code" style="border:solid 1px grey;"></textarea>
					<p style="color:#191919;font-family:sans-serif">Code from <a id="githublink" href="url" target="_blank" rel="noopener noreferrer">github</a></p>
			    <textarea id="codeFromGithub" name="code" style="border:solid 1px grey;padding:50px"></textarea>
					
			    <script src="https://cdn.jsdelivr.net/npm/zip-loader@1.2.0/dist/zip-loader.min.js"></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.64.0/codemirror.min.js"></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.64.0/mode/javascript/javascript.min.js"></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify.min.js"></script>
			    <script>
						let loader;
			      const decompressBlob = async blob => {
			        const ds = new DecompressionStream('gzip');
			        const decompressedStream = blob.stream().pipeThrough(ds);
			        const r = await new Response(decompressedStream).blob();
			        return r;
			      }
			      const toBlob = (data, type = 'application/octet-stream') => fetch("data:application/octet-stream;base64,".concat(data)).then(res => {
			        return res.blob();
			      });
			      const getBundle = async (data) => {
			        const gzipBlob = await toBlob(data);
			        const fullText = await decompressBlob(gzipBlob).then(b => b.text());
			        const bundle = JSON.parse(fullText);
			        if (!('moduleFormat' in bundle)) {
			          throw Error('no moduleFormat');
			        }
			        console.log(fullText);
			        const size = fullText.length;
			        return {
			          bundle,
			          size
			        };
			      }
						
			      const getZipLoader = async bundle => {
			        const {
			          moduleFormat
			        } = bundle;
			        console.log(moduleFormat, 'TODO: check for endo type');
			        const {
			          endoZipBase64
			        } = bundle;
			        const zipBlob = await toBlob(endoZipBase64);
			        return ZipLoader.unzip(zipBlob);
			      }
						
			      const explore = async (data) => {
			        const {
			          bundle,
			          size: storedSize
			        } = await getBundle(data);
			        loader = await getZipLoader(bundle);
			        const cmap = loader.extractAsJSON('compartment-map.json');
			        const {
			          files
			        } = loader;
			        const map = [];
			        //const tbody = $('tbody');
			        let totalSize = 0;
			        for (const name of Object.keys(files)) {
			          const size = loader.extractAsText(name).length;
			          console.log(size, name);
			          map.push({
			            file: name,
			            size
			          });
			          totalSize += size;
			        }
			        return {
			          storedSize,
			          files: map
			        };
			      };
						
						const packageNames = {
							'ertp': 'ERTP',
							'swingset-vat': 'SwingSet'
						}
						
						const constructUrl = (base, namespace, filename) => {
								let parts = filename.split('/');
								if (!parts[1].match(/-v[0-9]/g)) {
										return undefined;
								}

								let package = parts[1].split('-v0')[0];
								let realPackage = packageNames[package] || package;
								let filePart = parts.slice(2).join('/');
								let version = \`0\${parts[1].split('-v0').slice(1).join('-')}\`;

								return \`\${base}/\${namespace}/\${package}@\${version}/packages/\${realPackage}/\${filePart}\`;
						}

						const fileToGhUrl = (filename) => {
								const package = filename.split('/')[0];
								const packageToBase = {
									"@agoric": "https://raw.githubusercontent.com/Agoric/agoric-sdk",
									"@endo": "https://raw.githubusercontent.com/endojs/endo"
								}
								return packageToBase[package] && constructUrl(packageToBase[package], package, filename);
						}

			      const githubCode = (url, type = 'application/text') => fetch(url).then(res => {
			        return res;
			      });

						var codeFromBundle = CodeMirror.fromTextArea(document.getElementById("codeFromBundle"), {
							lineNumbers: true,
							readOnly: true,
							mode: "javascript"
						});
						var codeFromGithub = CodeMirror.fromTextArea(document.getElementById("codeFromGithub"), {
							lineNumbers: true,
							readOnly: true,
							mode: "javascript"
						});
						 codeFromBundle.setSize("100%", "450px");
						 codeFromGithub.setSize("100%", "450px");
						
					   window.addEventListener('message', (event) => {
						 		console.log(event.data);
						 		if (event.data.file != undefined) {
									
									let url = fileToGhUrl(event.data.file)
									if (url != undefined) {
										let code = githubCode(url).then(res => {
											return res.text();	
										}).then(text => {											
											codeFromGithub.setValue(text);
										});
									} else {
										codeFromGithub.setValue('Cannot fetch github code for this file!');
									}
									
									let fileText = '';
									if (event.data.file.endsWith('json')) {
										fileText = loader.extractAsJSON(event.data.file);
										fileText = JSON.stringify(fileText);
										fileText = js_beautify(fileText);
									} else {
										fileText = loader.extractAsText(event.data.file);
										if (event.data.beautify === true) {
											fileText = JSON.parse(fileText);
											fileText = fileText.__syncModuleProgram__;
											fileText = fileText.replaceAll(/\\n\\n+/g, '\\n\\n');
											
											fileText = js_beautify(fileText);
										}
									}
									
									codeFromBundle.setValue(fileText);
									
								} else if (event.data.data != undefined) {
									explore(event.data.data).then(r => {
										window.parent.postMessage(r, "*");
									});
								}
						});
					</script>
			`;
	}
}
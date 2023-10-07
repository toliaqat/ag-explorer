export default {
	data: '',
	height: 1,
	walletId: "1",
	slash: "\\",
	cleanTxt (txt) {
		if (txt === undefined) return ""
		return JSON.parse(txt.replaceAll(this.slash, '').replaceAll('\"#{', '{').replaceAll('}\"', '}').replaceAll(/\"/g,'"'));
		//	this.myVar1 = [1,2,3]
	},
	async getBundleData() {
		
		console.log("getBundleData called");
		let response = await GetTxApi.run();
		console.log(response);
		//this.data = response.tx.body.messages[0].compressed_bundle;
		let s = {data: response.tx.body.messages[0].compressed_bundle};
		console.log(s);
		postWindowMessage(s, 'Iframe1', "*");
		return true;
		//<h4 style="color:#191919;font-family:sans-serif;">Github view</h4>
		//return this.data;
	},
	async getJSONPage() {
		console.log("getJSONPage called");
		return `
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.64.0/codemirror.min.css">
				
					<p style="color:#191919;font-family:sans-serif">Extracted from the bundle</p>
			    <textarea id="codeFromBundle" name="code" style="border:solid 1px grey;">
					
					</textarea>
					
					
					<a id="githublink" href="url" style="color:#191919;font-family:sans-serif;">Github view</a>
					
			    <textarea id="codeFromGithub" name="code" style="border:solid 1px grey;padding:50px">
					</textarea>
					
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
			        console.log('explore');
			        //const txHash = $('input[name="txHash"]').value;
			        //const node = $('input[name="node"]').value;
			        //const [m0] = await Cosmos.txMessages(txHash, node);
			        const {
			          bundle,
			          size: storedSize
			        } = await getBundle(data);
			        //const storagePrice = parseFloat($('input[name="storagePrice"]').value);
			        //$('input[name="storedSize"]').value = storedSize;
			        //$('input[name="storageFee"]').value = storedSize * storagePrice;
			        loader = await getZipLoader(bundle);
			        const cmap = loader.extractAsJSON('compartment-map.json');
			        //$('input[name="entry"]').value = JSON.stringify(cmap.entry);
			        // TODO: cmap.compartments
			        // cmap.tags ???
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
							'ertp': 'ERTP'
						}
						const fileToGhUrl = (filename) => {
							if (filename.startsWith("@agoric/")) {
								let parts = filename.split('/');
								if (parts[1].match(/-v[0-9]/g)) {
									//parts[1] = parts[1].replace('-v', '-');
									let package = parts[1].split('-v')[0];
									let realPackage = packageNames[package] || package;
									let filePart = parts.slice(2).join('/');
									let version = parts[1].split('-v').slice(1).join('-');
									const finalUrl = \`https://raw.githubusercontent.com/Agoric/agoric-sdk/%40agoric/\${package}%40\${version}/packages/\${realPackage}/\${filePart}\`;
									var urlElement = document.getElementById('githublink');
									
									urlElement.setAttribute('href', finalUrl);
 
									return finalUrl;
							
								}
								
							} else if (filename.startsWith("@endo/")) {
									console.log("teset");
									let parts = filename.split('/');
									if (parts[1].match(/-v[0-9]/g)) {
										//parts[1] = parts[1].replace('-v', '-');
										let package = parts[1].split('-v')[0];
										let realPackage = packageNames[package] || package;
										let filePart = parts.slice(2).join('/');
										let version = parts[1].split('-v').slice(1).join('-');
										const finalUrl = \`https://raw.githubusercontent.com/endojs/endo/%40endo/\${package}%40\${version}/packages/\${realPackage}/\${filePart}\`;
										var urlElement = document.getElementById('githublink');
 										urlElement.setAttribute('href', finalUrl);
 
										return finalUrl;
									}
							}
							return undefined;
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
						 codeFromBundle.setSize("100%", "460px");
						 codeFromGithub.setSize("100%", "460px");
						
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
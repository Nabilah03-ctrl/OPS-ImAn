import fs from 'node:fs';
// The upstream ESM fontkit build contains a bare pako import. Its UMD build
// bundles pako and is wrapped here for the buildless, offline browser app.
fs.copyFileSync('node_modules/pdf-lib/dist/pdf-lib.esm.min.js','dist/vendor/pdf-lib.js');
fs.copyFileSync('node_modules/pdf-lib/LICENSE.md','dist/vendor/PDF-LIB-LICENSE.md');
fs.copyFileSync('node_modules/pako/LICENSE','dist/vendor/PAKO-LICENSE.txt');
fs.writeFileSync('dist/vendor/fontkit.js',fs.readFileSync('node_modules/@pdf-lib/fontkit/dist/fontkit.umd.min.js','utf8')+'\nexport default globalThis.fontkit;\n');

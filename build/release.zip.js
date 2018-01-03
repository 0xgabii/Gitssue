const fs = require('fs-extra');
const archiver = require('archiver');

const archive = archiver('zip', {
  zlib: { level: 9 },
});

fs.readJson('chrome/manifest.prod.json').then((obj) => {
  const output = fs.createWriteStream(`releases/v${obj.version}.zip`);

  output.on('close', function() {
    console.log(`Compress complete - check 'release/v${obj.version}.zip'`);
  });

  archive.pipe(output);
  archive.directory('prod/', false);
  archive.finalize();
});
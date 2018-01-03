const fs = require('fs-extra');
const readline = require('readline');

const json = 'chrome/manifest.prod.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.readJson(json).then((obj) => {
  console.log('----------------------------------------------');
  rl.question(`Enter new version (current: ${obj.version}): `, (version) => {
    fs.writeJson(json, { ...obj, version }, { spaces: 2 }).then(() => {
      console.log(`Version changed ${obj.version} => ${version}`);
      console.log('----------------------------------------------');
      rl.close(); 
    })   
  });
});
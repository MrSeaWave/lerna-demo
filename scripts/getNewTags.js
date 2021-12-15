const exec = require('child_process').execSync;

const versions = exec('git describe --tags').toString().split('\n');

console.log('versions', versions);

console.log('process.env', (process.env.GITHUB_TOKEN || 'tem git').slice(0, 4));

const GitHub = require('github');
const fs = require('fs');
const path = require('path');

const github = new GitHub({
  debug: process.env.NODE_ENV === 'development'
});

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN || process.env.GITHUB_AUTH
});

// eslint-disable-next-line no-unused-vars
const getChangelog = (content, version) => {
  const lines = content.split('\n');
  const changeLog = [];
  const startPattern = new RegExp(`^## ${version}`);
  const stopPattern = /^## /; // 前一个版本
  const skipPattern = /^`/; // 日期
  let begin = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (begin && stopPattern.test(line)) {
      break;
    }
    if (begin && line && !skipPattern.test(line)) {
      changeLog.push(line);
    }
    if (!begin) {
      begin = startPattern.test(line);
    }
  }
  return changeLog.join('\n');
};

const getMds = (allVersion = false) => {
  const TARGET_DIRECTORY = path.join(__dirname, '../packages');
  const packageFolders = fs.readdirSync(TARGET_DIRECTORY).filter((filename) => filename[0] !== '.');
  console.log('packageFolders', packageFolders);
  packageFolders.map((packageFolder) => {
    const directory = path.join(TARGET_DIRECTORY, packageFolder);
    const packageInfoPath = path.join(directory, 'package.json');
    // eslint-disable-next-line no-unused-vars
    const content = fs.readFileSync(path.join(directory, './CHANGELOG.md')).toString();
    const info = require(packageInfoPath);
    const versions = [info.version];
    const pkgName = info.name;

    console.log(versions);
    versions.map((version) => {
      const versionPkg = `${pkgName}@${version}`;
      const changeLog = 'content' + Math.random(); // getChangelog(content, versionPkg);
      if (!changeLog) {
        return;
      }

      const releaseData = {
        owner: 'MrSeaWave',
        repo: 'lerna-demo',
        tag_name: versionPkg,
        name: versionPkg,
        body: changeLog
      };
      console.log('release', releaseData);
      github.repos.createRelease(releaseData).catch((e) => {
        console.log(e);
      });
    });
  });
};

getMds();

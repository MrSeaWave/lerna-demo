import { readdirSync } from 'fs';
import { join } from 'path';

// utils must build before core
const headPkgs = ['pkg-a'];
const tailPkgs = readdirSync(join(__dirname, 'packages')).filter((pkg) => {
  return !headPkgs.includes(pkg);
});

console.log('headPkgs', headPkgs, tailPkgs);

export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: [...headPkgs, ...tailPkgs],
  extraBabelPlugins: [],
};

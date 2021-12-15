import chalk from 'chalk';

function sum (a, b) {
  console.log(chalk.green('go sum params:'), a, b);
  return a + b;
}

export default sum;

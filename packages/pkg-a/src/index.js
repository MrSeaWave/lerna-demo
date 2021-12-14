import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

const result = uuidv4();

console.log('--->uuidV4:', chalk.blue(result));

export default result;

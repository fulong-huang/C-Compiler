import { readTestFiles } from "./src/file-reader";
import type { TOKEN } from "./src/token-type";
import lexer from "./src/lexer";
import parser from "./src/parser";
import { createVariable, getVT, insertVT, printVT } from "./src/value-table";

import type { Variable } from "./src/value-table";
function main() {
  let tests: Array<string> = readTestFiles();
  for (let i = 0; i < tests.length; i++) {
    let tokens: Array<TOKEN> = lexer(tests[i]);
    parser(tokens);
  }
}

main();


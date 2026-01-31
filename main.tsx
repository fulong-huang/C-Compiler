import { readTestFiles } from "./src/file-reader";
import TOKEN from "./src/token-type";
import lexer from "./src/lexer";
import parser from "./src/parser";

function main() {
  let tests: Array<string> = readTestFiles();
  for (let i = 0; i < tests.length; i++) {
    let tokens: Array<TOKEN> = lexer(tests[i]);
    parser(tokens);
  }
}

main();


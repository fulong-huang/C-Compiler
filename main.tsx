import { readTestFiles } from "./src/file-reader";
import type { TOKEN } from "./src/token-type";
import lexer from "./src/lexer";
import parser from "./src/parser";

function main() {
  const tests: Array<string> = readTestFiles();
  for (let i = 0; i < tests.length; i++) {
    const tokens: Array<TOKEN> = lexer(tests[i]);
    parser(tokens);
  }
}

main();


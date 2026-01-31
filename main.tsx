import { readTestFiles } from "./src/file-reader";
import lexer from "./src/lexer";

function main() {
  let tests: Array<string> = readTestFiles();
  for (let i = 0; i < tests.length; i++) {
    lexer(tests[i]);
  }
  console.log("RETURN FROM MAIN");
}

main();


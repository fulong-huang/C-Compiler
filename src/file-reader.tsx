import { readdirSync, readFileSync } from "fs";
import path from "path";

const TEST_FILE_PATH = "tests/";

function readTestFileAsync(fileName: string): string {
  const file = readFileSync(TEST_FILE_PATH + fileName);
  return file.toString();
}
export function readTestFiles(): Array<string> {
  const result: Array<string> = [];
  readdirSync(path.resolve(TEST_FILE_PATH)).forEach(

    (fileName) => {
      const fileContent = readTestFileAsync(fileName);
      result.push(fileContent);
    }
  )
  return result;
}


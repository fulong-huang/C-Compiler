import { createToken, TOKEN_TYPES } from "./token-type";
import type { TOKEN } from "./token-type";

let txt: string;
let currIdx: number;

function getInteger(): string {
  let result: string = txt[currIdx];
  currIdx++;
  while (currIdx < txt.length &&
    txt[currIdx] >= '0' && txt[currIdx] <= '9') {
    result += txt[currIdx];
    currIdx++;
  }
  return result;
}
function getIdentifier(): string {
  let result: string = txt[currIdx];
  currIdx++;
  while (
    currIdx < txt.length &&
    (
      txt[currIdx] == '_' ||
      (txt[currIdx] >= '0' && txt[currIdx] <= '9') ||
      (txt[currIdx] >= 'a' && txt[currIdx] <= 'z') ||
      (txt[currIdx] >= 'A' && txt[currIdx] <= 'Z')
    )) {
    result += txt[currIdx];
    currIdx++;
  }
  return result;
}

function getNextToken(): TOKEN {
  let result: TOKEN;
  let currChar = txt[currIdx];
  while (currChar == ' ' || currChar == '\n') {
    currIdx++;
    if (currIdx >= txt.length) {
      return createToken(TOKEN_TYPES.EOF, "EOF");
    }
    currChar = txt[currIdx];
  }
  if (currChar == '(') {
    result = createToken(TOKEN_TYPES.LPAREN, '(');
    currIdx++;
  }
  else if (currChar == ')') {
    result = createToken(TOKEN_TYPES.RPAREN, ')');
    currIdx++;
  }
  else if (currChar >= '0' && currChar <= '9') {
    let intStr = getInteger();
    result = createToken(TOKEN_TYPES.INTEGER, intStr);
  }
  else if ((currChar >= 'a' && currChar <= 'z') || currChar >= 'A' && currChar <= 'Z') {
    let intStr = getIdentifier();
    result = createToken(TOKEN_TYPES.INTEGER, intStr);
  }
  else if (currChar == '+' || currChar == '-' ||
    currChar == '*' || currChar == '/') {
    result = createToken(TOKEN_TYPES.OPERATOR, currChar);
    currIdx++;
  }
  else {
    result = createToken(TOKEN_TYPES.UNKNOWN, currChar);
    currIdx++;
  }
  return result;
}

export default function lexer(content: string): Array<TOKEN> {
  console.log();
  console.log("=====================");
  console.log("NEW LEXER");
  console.log("=====================");
  const result: Array<TOKEN> = [];
  txt = content;
  console.log("=====================");
  console.log("INPUT: ", txt);
  currIdx = 0;
  while (currIdx < txt.length) {
    result.push(getNextToken());
  }
  return result;
}


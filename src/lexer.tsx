import TOKEN, { TOKEN_TYPES } from "./token-type";

const SPECIAL_CHARS: Array<string> = [
  '=',
];


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
      return new TOKEN(TOKEN_TYPES.EOF, "EOF");
    }
    currChar = txt[currIdx];
  }
  if (currChar == '(') {
    result = new TOKEN(TOKEN_TYPES.LPAREN, '(');
    currIdx++;
  }
  else if (currChar == ')') {
    result = new TOKEN(TOKEN_TYPES.RPAREN, ')');
    currIdx++;
  }
  else if (currChar >= '0' && currChar <= '9') {
    let intStr = getInteger();
    result = new TOKEN(TOKEN_TYPES.INTEGER, intStr);
  }
  else if ((currChar >= 'a' && currChar <= 'z') || currChar >= 'A' && currChar <= 'Z') {
    let intStr = getIdentifier();
    result = new TOKEN(TOKEN_TYPES.INTEGER, intStr);
  }
  else if (currChar == '+' || currChar == '-' ||
    currChar == '*' || currChar == '/') {
    result = new TOKEN(TOKEN_TYPES.OPERATOR, currChar);
    currIdx++;
  }
  else {
    result = new TOKEN(TOKEN_TYPES.UNKNOWN, currChar);
    currIdx++;
  }
  return result;
}

export default function lexer(content: string): Array<TOKEN> {
  console.log("NEW LEXER");
  const result: Array<TOKEN> = [];
  txt = content;
  currIdx = 0;
  while (currIdx < txt.length) {
    let currToken = getNextToken();
    console.log(currToken);
  }
  return result;
}


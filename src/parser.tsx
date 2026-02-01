import { createToken, TOKEN_TYPES } from "./token-type"
import type { TOKEN } from "./token-type";
import { createVariable, getVT, insertVT, printVT, Variable } from "./value-table";

let CURR_TOKENS: Array<TOKEN>;
let CURR_TOKEN_IDX: number;

function getCurrToken(): TOKEN {
  if (CURR_TOKEN_IDX >= CURR_TOKENS.length) {
    console.error("EXPECTING TOKEN");
    return createToken(TOKEN_TYPES.ERROR, "ERROR, EXPECTING TOKEN");
  }
  return CURR_TOKENS[CURR_TOKEN_IDX];
}

function printRemainingToken() {
  console.log(CURR_TOKENS.slice(CURR_TOKEN_IDX));
}

function eatToken(): undefined {
  CURR_TOKEN_IDX++;
}

function identifier(): string {
  let currToken = getCurrToken();
  eatToken();
  if (currToken.TYPE == TOKEN_TYPES.IDENTIFIER) {
    let tokenValue = currToken.value;
    return tokenValue;
  }
  console.error("Expecting Identifier, got: ", currToken.value, " instead");
  return "";
}

function number(): number {
  let currToken = getCurrToken();
  eatToken();
  if (currToken.TYPE == TOKEN_TYPES.INTEGER) {
    let tokenValue = currToken.value;
    return parseInt(tokenValue);
  }
  console.error("Expecting Integer, got: ", currToken.value, " instead");
  return -1;
}

function factor(): number {
  let currToken = getCurrToken();
  let result = -1;
  if (currToken.TYPE == TOKEN_TYPES.LPAREN) {
    eatToken();
    result = expression();
    currToken = getCurrToken();
    if (currToken.TYPE != TOKEN_TYPES.RPAREN) {
      console.error("Expecting RPAREN ')', got: ", currToken.value, " instead");
    }
    else {
      eatToken();
    }
  }
  else if (currToken.TYPE == TOKEN_TYPES.INTEGER) {
    result = number();
  }
  else if (currToken.TYPE == TOKEN_TYPES.IDENTIFIER) {
    let ident: string = identifier();
    let currVar: Variable = getVT(ident);
    result = currVar.value;
  }
  else {
    console.error("Expecting expression, got: ", currToken.value, " instead");
    eatToken();
    printRemainingToken();
  }
  return result;
}

function term(): number {
  let lhs: number = factor();
  let currToken = getCurrToken();
  let operator = currToken.value;
  while (
    currToken.TYPE == TOKEN_TYPES.OPERATOR &&
    (operator == '*' || operator == '/')
  ) {
    eatToken();
    let rhs: number = factor();

    if (operator == '*') {
      lhs *= rhs;
    }
    else if (operator == '/') {
      if (rhs == 0) {
        console.error("ZERO DIVISION ERROR");
        lhs = -1;
      }
      else {
        lhs /= rhs;
      }
    }
    currToken = getCurrToken();
    operator = currToken.value;
  }
  return lhs;
}


// TODO: VARIABLE
function expression(): number {
  let lhs: number = term();
  let currToken = getCurrToken();
  let operator = currToken.value;
  while (
    currToken.TYPE == TOKEN_TYPES.OPERATOR &&
    (operator == '+' || operator == '-')
  ) {
    eatToken();
    let rhs: number = term();

    if (operator == '+') {
      lhs += rhs;
    }
    else if (operator == '-') {
      lhs -= rhs;
    }
    currToken = getCurrToken();
    operator = currToken.value;
  }
  return lhs;
}

function declaration(): undefined {
  // example: 
  //  int x = 3;
  let currToken = getCurrToken();
  if (currToken.value != 'int') {
    // Since this is only supported type as of now
    console.error("Expecting integer, got: ", currToken.TYPE);
  }
  eatToken();
  let ident = identifier();

  currToken = getCurrToken();
  if (currToken.TYPE == TOKEN_TYPES.SEMICOLON) {
    // Variable declared but not defined;
    let variable: Variable = createVariable(0, false);
    insertVT(ident, variable);
  }
  else if (currToken.TYPE == TOKEN_TYPES.ASSIGNMENT) {
    // Got assignment char, now evaluate expression;
    eatToken();
    let value: number = expression();
    let variable: Variable = createVariable(value, false);
    insertVT(ident, variable);
  }
  else {
    console.error("Expecting Assignment '=', got: ", currToken.TYPE);
  }
}

function assignment(): undefined {
  // example: 
  //  x = x + 3;
  let currToken = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.IDENTIFIER) {
    console.error("Expecting identifier, got: ", currToken.TYPE);
  }

  let ident = identifier();

  currToken = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.ASSIGNMENT) {
    console.error("Expecting Assignment '=', got: ", currToken.TYPE);
  }
  eatToken();

  currToken = getCurrToken();

  // Got assignment char, now evaluate expression;
  let value: number = expression();
  let variable: Variable = createVariable(value, false);
  insertVT(ident, variable);
}

function statement(): undefined {
  let currToken = getCurrToken();
  if (currToken.TYPE == TOKEN_TYPES.KEYWORD) {
    if (currToken.value == 'int') {
      declaration();
    }
    else if (currToken.value == 'print') {
      eatToken();
      currToken = getCurrToken();
      if (currToken.TYPE != TOKEN_TYPES.LPAREN) {
        console.error("Expecting '(', got: ", currToken, " instead");
      }
      eatToken();
      console.log("PRINTING EXPRESSION: ", expression());

      currToken = getCurrToken();
      if (currToken.TYPE != TOKEN_TYPES.RPAREN) {
        console.error("Expecting ')', got: ", currToken.value, " instead");
      }
    }
  }
  else if (currToken.TYPE == TOKEN_TYPES.IDENTIFIER) {
    assignment();
  }
  else {
    console.log("Expression result: ", expression());
  }
}

function statementSequence(): undefined {
  statement();
  let currToken = getCurrToken();
  while (currToken.TYPE == TOKEN_TYPES.SEMICOLON) {
    eatToken();
    currToken = getCurrToken();
    if (currToken.TYPE == TOKEN_TYPES.EOF) {
      break;
    }
    statement();
    currToken = getCurrToken();
  }
  console.log("PRINTING VT: ");
  printVT();

}


export default function parser(tokens: Array<TOKEN>) {
  CURR_TOKENS = tokens;
  CURR_TOKEN_IDX = 0;
  statementSequence();
}


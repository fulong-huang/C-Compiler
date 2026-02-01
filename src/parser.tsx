import { createToken, TOKEN_TYPES } from "./token-type"
import type { TOKEN } from "./token-type";

let CURR_TOKENS: Array<TOKEN>;
let CURR_TOKEN_IDX: number;

function getCurrToken(): TOKEN {
  if (CURR_TOKEN_IDX >= CURR_TOKENS.length) {
    console.error("EXPECTING TOKEN");
    return createToken(TOKEN_TYPES.ERROR, "ERROR, EXPECTING TOKEN");
  }
  return CURR_TOKENS[CURR_TOKEN_IDX];
}

function eatToken(): undefined {
  CURR_TOKEN_IDX++;
}

function number(): number {
  console.log("NUMBER");
  let currToken = getCurrToken();
  eatToken();
  if (currToken.TYPE == TOKEN_TYPES.INTEGER) {
    let tokenValue = currToken.value;
    return parseInt(tokenValue);
  }
  console.error("Expecting Integer, got: ", currToken.TYPE, " instead");
  return -1;
}

function factor(): number {
  console.log("factor");
  let currToken = getCurrToken();
  let result = -1;
  if (currToken.TYPE == TOKEN_TYPES.LPAREN) {
    eatToken();
    result = expression();
    currToken = getCurrToken();
    if (currToken.TYPE != TOKEN_TYPES.RPAREN) {
      console.error("Expecting RPAREN ')', got: ", currToken.TYPE, " instead");
    }
    else {
      eatToken();
    }
  }
  else if (currToken.TYPE == TOKEN_TYPES.INTEGER) {
    result = number();
  }
  else {
    console.error("Expecting expression, got: ", currToken.TYPE, " instead");
    eatToken();
  }
  return result;
}

function term(): number {
  console.log("term");
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
  console.log("RETURN TERM");
  return lhs;
}


function expression(): number {
  console.log("expression");
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
  console.log("RETURN EXPRESSION");
  return lhs;
}


export default function parser(tokens: Array<TOKEN>) {
  CURR_TOKENS = tokens;
  CURR_TOKEN_IDX = 0;
  let result = expression();
  let currToken = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.EOF) {
    console.log(currToken);
    console.error("EXPECTING END OF FILE");
  }
  else {
    console.log("Result: ", result);
  }
}


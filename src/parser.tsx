import { createToken, TOKEN_TYPES } from "./token-type"
import type { TOKEN } from "./token-type";
import { createParam, createVariable, getFunctionTable, getValueTable, insertFunctionTable, insertValueTable, Param, printVT, Variable } from "./value-table";

let CURR_TOKENS: Array<TOKEN>;
let CURR_TOKEN_IDX: number;

const TYPES: Array<string> = ["int", "void"];

function getNextToken(): TOKEN {
  if (CURR_TOKEN_IDX + 1 >= CURR_TOKENS.length) {
    console.error("EXPECTING TOKEN");
    return createToken(TOKEN_TYPES.ERROR, "ERROR, EXPECTING TOKEN");
  }
  return CURR_TOKENS[CURR_TOKEN_IDX + 1];
}
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

function typeName(): string {
  let currToken = getCurrToken();
  eatToken();
  if (currToken.TYPE == TOKEN_TYPES.KEYWORD) {
    let typeName = currToken.value;
    if (!TYPES.includes(typeName)) {
      console.error("Unknown Type Name: ", typeName);
    }
    else {
      return typeName;
    }
  }
  return "";
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
    currToken = getCurrToken();
    if (currToken.TYPE == TOKEN_TYPES.LPAREN) {
      let args = readArgs();
      functionCall(ident, args);
      // TODO: 
      // Result needs to be return value
      result = 999;
    }
    else {
      console.error(currToken);
      let currVar: Variable = getValueTable(ident);
      result = currVar.value;
    }
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

function functionCall(funcName: string, args: Array<number>): undefined {
  let params: Array<Param> = getFunctionTable(funcName);
  console.log("CALLING FUNCTION: ", funcName);
  console.log("\tWITH ARGS: ", args);
  console.log("PARAMS: ", params);
}
function functionDeclaration(funcName: string): undefined {
  let params = param();
  let currToken = getCurrToken();
  if (currToken.TYPE == TOKEN_TYPES.LBRACKET) {
    statementSequence();
    currToken = getCurrToken();
    insertFunctionTable(funcName, params);
  }
  else {
    console.log("====== Function Declaration ========");
  }
}

function readArgs(): Array<number> {
  let args: Array<number> = [];
  let currToken: TOKEN = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.LPAREN) {
    console.error("Expecting '(', got: ", currToken, " instead");
  }
  eatToken();

  currToken = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.RPAREN) {
    args.push(factor());
    currToken = getCurrToken();
    while (currToken.TYPE == TOKEN_TYPES.COMMA) {
      eatToken();
      args.push(factor());
      currToken = getCurrToken();
    }
  }
  // eat ')'
  eatToken();
  return args;
}
function param(): Array<Param> {
  let params: Array<Param> = [];
  let currToken: TOKEN = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.LPAREN) {
    console.error("Expecting '(', got: ", currToken, " instead");
  }
  eatToken();

  currToken = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.RPAREN) {
    let paramType = typeName();
    let paramName = identifier();
    let currParam = createParam(paramName, paramType);
    params.push(currParam);
    currToken = getCurrToken();
    while (currToken.TYPE == TOKEN_TYPES.COMMA) {
      eatToken();
      paramType = typeName();
      paramName = identifier();
      currParam = createParam(paramName, paramType);
      params.push(currParam);
      currToken = getCurrToken();
    }
    // eat ')'
    eatToken();
  }
  else {
    eatToken();
  }
  return params;
}

function declaration(): undefined {
  // example: 
  //  int x = 3;
  let currToken = getCurrToken();
  eatToken();
  let ident = identifier();

  currToken = getCurrToken();
  if (currToken.TYPE == TOKEN_TYPES.SEMICOLON) {
    // Variable declared but not defined;
    let variable: Variable = createVariable(0, false);
    insertValueTable(ident, variable);
  }
  else if (currToken.TYPE == TOKEN_TYPES.ASSIGNMENT) {
    // Got assignment char, now evaluate expression;
    eatToken();
    let value: number = expression();
    let variable: Variable = createVariable(value, false);
    insertValueTable(ident, variable);
  }
  else if (currToken.TYPE == TOKEN_TYPES.LPAREN) {
    functionDeclaration(ident);
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
  insertValueTable(ident, variable);
}

function printStatement(): undefined {
  // eat 'printf' token
  eatToken();
  let currToken: TOKEN = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.LPAREN) {
    console.error("Expecting '(', got: ", currToken, " instead");
  }
  console.log("PRINT STATEMENT");
  eatToken();
  currToken = getCurrToken();
  if (currToken.TYPE != TOKEN_TYPES.RPAREN) {
    let args: Array<number> = [];
    args.push(expression());
    currToken = getCurrToken();
    while (currToken.TYPE == TOKEN_TYPES.COMMA) {
      eatToken();
      args.push(expression());
      currToken = getCurrToken();
    }
    if (currToken.TYPE != TOKEN_TYPES.RPAREN) {
      console.error("Expecting ')', got: ", currToken.value, " instead");
    }
    eatToken();
    console.log("Print statement: ", args.join(' '));
  }
  else {
    eatToken();
    console.log("Print Statement Empty Line");
  }
}

function statement(): undefined {
  let currToken = getCurrToken();
  if (currToken.TYPE == TOKEN_TYPES.KEYWORD) {
    if (currToken.value == 'printf') {
      printStatement();
    }
    else { //  if (currToken.value == 'int') {
      declaration();
    }
  }
  else if (currToken.TYPE == TOKEN_TYPES.IDENTIFIER) {
    if (getNextToken().TYPE == TOKEN_TYPES.LPAREN) {
      eatToken();
      let args = readArgs();
      functionCall(currToken.value, args);
    }
    else {
      assignment();
    }
  }
  else {
    console.log("Expression result: ", expression());
  }
}

function statementSequence(): undefined {

  let currToken = getCurrToken();
  let lBracket = false;
  if (currToken.TYPE == TOKEN_TYPES.LBRACKET) {
    lBracket = true;
    eatToken();
  }

  statement();
  currToken = getCurrToken();
  while (currToken.TYPE == TOKEN_TYPES.SEMICOLON) {
    eatToken();
    currToken = getCurrToken();
    if (currToken.TYPE == TOKEN_TYPES.RBRACKET) {
      if (lBracket) {
        // eatToken();

        // SEMICOLON is not required after right bracket
        //  It might still needs to continue statement sequence after bracket
        //  since it might be an inner block;

        // NOT SO GOOD SOLUTION:
        //  change current token to SEMICOLON type as it return, 
        //  to continue statement sequence while loop in upper level
        currToken.TYPE = TOKEN_TYPES.SEMICOLON;
        currToken.value = ';';
        break;
      }
      else {
        console.error("Expecting '}', got: ", currToken.value, " instead");
      }
      break;
    }
    if (currToken.TYPE == TOKEN_TYPES.EOF) {
      break;
    }
    statement();
    currToken = getCurrToken();
  }
}


export default function parser(tokens: Array<TOKEN>) {
  CURR_TOKENS = tokens;
  CURR_TOKEN_IDX = 0;
  statementSequence();

  console.log("PRINTING VT: ");
  printVT();
}


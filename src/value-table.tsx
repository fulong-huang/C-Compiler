const VALUE_TABLE: { [ident: string]: Variable; } = {};
const FUNCTION_TABLE: { [funcName: string]: Array<Param>; } = {};

export interface Variable {
  value: number;
  inst: number;
}

export interface Param {
  ident: string;
  TYPE: string;
}

export function createParam(ident: string, type: string): Param {
  // TODO: 
  //  Param can not have void type
  let result: Param;
  result = { ident: ident, TYPE: type };
  return result;
}

export function createVariable(value: number, isInst: boolean): Variable {
  let result: Variable;

  if (isInst) {
    result = { value: -1, inst: value };
  }
  else {
    result = { value: value, inst: -1 };
  }

  return result;
}

export function insertValueTable(ident: string, variable: Variable) {
  VALUE_TABLE[ident] = variable;
}

export function insertFunctionTable(funcName: string, params: Array<Param>) {
  FUNCTION_TABLE[funcName] = params;
}

export function printVT() {
  console.log(VALUE_TABLE);
}
export function getValueTable(ident: string): Variable {
  let variable = VALUE_TABLE[ident];
  if (variable == undefined) {
    console.error("Variable ", ident, " not found");
  }
  return variable;
}
export function getFunctionTable(funcName: string): Array<Param> {
  let params = FUNCTION_TABLE[funcName];
  if (params == undefined) {
    console.error("Function ", funcName, " not found");
  }
  return params;
}


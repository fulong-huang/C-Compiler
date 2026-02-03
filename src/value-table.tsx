import { TOKEN_TYPES } from "./token-type";
const VT: { [ident: string]: Variable; } = {};
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

export function insertVT(ident: string, variable: Variable) {
  VT[ident] = variable;
}

export function printVT() {
  console.log(VT);
}
export function getVT(ident: string): Variable {
  let variable = VT[ident];
  if (variable == undefined) {
    console.error("Variable ", ident, " not found");
  }
  return VT[ident];
}


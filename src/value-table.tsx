const VT: { [ident: string]: Variable; } = {};
export interface Variable {
  value: number;
  inst: number;
}

export function insertVT(ident: string, variable: Variable) {
  VT[ident] = variable;
}



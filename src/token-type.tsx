export const enum TOKEN_TYPES {
  IDENTIFIER, LPAREN, RPAREN, INTEGER, OPERATOR,

  EOF, UNKNOWN, ERROR
}

export default class TOKEN {
  TYPE: TOKEN_TYPES;
  value: string;
  constructor(type: TOKEN_TYPES, value: string) {
    this.TYPE = type;
    this.value = value;
  }
}





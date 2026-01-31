export const enum TOKEN_TYPES {
  IDENTIFIER, LPAREN, RPAREN, INTEGER, OPERATOR,

  EOF, UNKNOWN
}

export default class TOKEN {
  token: TOKEN_TYPES;
  value: string;
  constructor(token: TOKEN_TYPES, value: string) {
    this.token = token;
    this.value = value;
  }
}





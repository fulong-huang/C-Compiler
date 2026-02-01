export const enum TOKEN_TYPES {
  IDENTIFIER, LPAREN, RPAREN, INTEGER, OPERATOR,
  KEYWORD, ASSIGNMENT, SEMICOLON, COMMA,

  EOF, UNKNOWN, ERROR
}

export interface TOKEN {
  TYPE: TOKEN_TYPES;
  value: string;
}

export function createToken(type: TOKEN_TYPES, value: string): TOKEN {
  return { TYPE: type, value: value };
}






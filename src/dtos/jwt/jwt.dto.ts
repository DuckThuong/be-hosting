export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface JwtSignInPayload {
  email: string;
  password: string;
}

export interface JwtSignInDtoResponse {
  access_token: string;
}

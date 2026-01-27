export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInDtoResponse {
  access_token: string;
}

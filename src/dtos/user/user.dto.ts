export class UserDecoratorDtoResponse {
  id: number;
  userCode: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  fullName?: string;
  dateOfBirth?: Date;
  status: UserStatus;
  role: UserRole;
  isEmailVerified: boolean;
}

// New

export enum UserStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  BLOCKED = 2,
}

export enum UserRole {
  ADMIN = 0,
  USER = 1,
  CUSTOMER = 2,
}
